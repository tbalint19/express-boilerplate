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

  if (!existingUser) {
    await models.sequelize.transaction(async transaction => {
      existingUser = await models.User.create(
        { googleId, email }, { transaction })
      await models.Grant.update(
        { UserId: existingUser.id }, { where: { email } }, { transaction })
      await models.Grant.update(
        { email: null }, { where: { UserId: existingUser.id } }, { transaction })
    })
  }
  else if (existingUser.email != email)
    await models.User.update({ email }, { where: { googleId } })

  const grants = await existingUser.getGrants()

  const sessionToken = await jwt.create({
    id: existingUser.id,
    googleId: existingUser.googleId,
    email: existingUser.email,
    role: grants.find(grant => grant.type == 'ROLE' || null),
    permissions: grants.filter(grant => grant.type == 'PERMISSION'),
  })

  return res.json({ sessionToken })
})

module.exports = router
