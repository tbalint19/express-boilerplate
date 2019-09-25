var models = require('../models')
var express = require('express')
var router = express.Router()
var googleApi = require('../api/google.js')
var jwt = require('../utils/jwt')

router.post('/', async (req, res) => {
  const authorizationCode = req.body.authorizationCode
  if (!authorizationCode) return res.sendStatus(401)

  let userData
  try {
    const tokenResponse = await googleApi.getIdToken(authorizationCode)
    userData = jwt.parse(tokenResponse.data.id_token)
  } catch (e) {
    return res.sendStatus(401)
  }

  const googleId = userData.sub
  const email = userData.email
  let existingUser = await models.User.findOne({ where: { googleId } })

  if (!existingUser)
    existingUser = await models.User.create({ googleId, email })
  else if (existingUser.email != email)
    await models.User.update({ email }, { where: { googleId } })

  const sessionToken = await jwt.create({
    id: existingUser.googleId,
    email: existingUser.email,
    role: null,
    permissions: [],
  })

  return res.json({ sessionToken })
})

module.exports = router
