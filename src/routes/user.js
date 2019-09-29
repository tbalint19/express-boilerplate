var models = require('../models')
var express = require('express')
var router = express.Router()
var googleApi = require('../api/google.js')
var jwt = require('../utils/jwt')
var { authorize } = require('../utils/authorize')

router.post('/login', async (req, res) => {
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
      const [ affectedRows ] = await models.Role.update(
        { UserId: existingUser.id }, { where: { preAssignedTo: email } }, { transaction })
      if (!affectedRows)
        await models.Role.create(
          { UserId: existingUser.id, name: 'USER', scope: null  }, { transaction })
    })
  }
  else if (existingUser.email != email)
    await models.User.update({ email }, { where: { googleId } })
  else if (existingUser.isBlacklisted)
    return res.sendStatus(401)

  existingUser = await existingUser.reload()
  const role = await existingUser.getRole({ attributes: ['name', 'scope'] })
  const permissions = await existingUser.getPermissions({ attributes: ['name', 'scope'] })

  const sessionToken = await jwt.create({
    id: existingUser.id,
    googleId: existingUser.googleId,
    email: existingUser.email,
    role,
    permissions,
  })

  res.json({ sessionToken })
})

router.post('/blacklist', async (req, res) => {
  const { email, to } = req.body.userId
  const user = await models.User.findOne({ where: { email } })
  const userRole = await user.getRole()

  authorize(
    (userRole == 'ADMIN' && req.user.is('ROOT')) ||
    (userRole == 'USER' && (req.user.is('ROOT') || req.user.is('ADMIN')))
  )

  await models.User.update({ isBlacklisted: to }, { where: { id: user.id } })

  res.sendStatus(200)
})

module.exports = router
