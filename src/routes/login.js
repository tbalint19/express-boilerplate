var models = require('../models')
var express = require('express')
var router = express.Router()
var googleApi = require('../api/google.js')
var parse = require('../utils/jwt')
var jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
  const authorizationCode = req.body.authorizationCode
  if (!authorizationCode)
    return res.sendStatus(401)
  try {
    const tokenResponse = await googleApi.getIdToken(authorizationCode)
    const userData = parse(tokenResponse.data.id_token)
    const sessionToken = jwt.sign(
    {
      id: userData.sub,
      username: userData.email,
      role: null,
      permissions: [],
    },
    'secret-key',
    { expiresIn: '8h' }
  )
    return res.json({ sessionToken })
  } catch (e) {
    console.log(e);
    return res.sendStatus(401)
  }
})

module.exports = router
