var models = require('../models')
var express = require('express')
var router = express.Router()
var googleApi = require('../api/google.js')
var jwt = require('../utils/jwt')

router.post('/', async (req, res) => {
  const authorizationCode = req.body.authorizationCode
  if (!authorizationCode)
    return res.sendStatus(401)
  try {
    const tokenResponse = await googleApi.getIdToken(authorizationCode)
    const userData = jwt.parse(tokenResponse.data.id_token)
    const sessionToken = await jwt.create({
      id: userData.sub,
      username: userData.email,
      role: null,
      permissions: [],
    })
    return res.json({ sessionToken })
  } catch (e) {
    console.log(e);
    return res.sendStatus(401)
  }
})

module.exports = router
