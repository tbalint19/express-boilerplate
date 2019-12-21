const models = require('../models')
const express = require('express')
const router = express.Router()
const googleApi = require('../api/google.js')
const jwt = require('../utils/jwt')
const { authorize } = require('../utils/authorize')

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
    await models.sequelize.transaction(async (transaction) => {
      existingUser = await models.User.create(
        { googleId, email },
        { transaction }
      )
      const [affectedRows] = await models.Role.update(
        { UserId: existingUser.id },
        { where: { preAssignedTo: email } },
        { transaction }
      )
      if (!affectedRows)
        await models.Role.create(
          { UserId: existingUser.id, name: 'USER', scope: null },
          { transaction }
        )
    })
  }

  if (existingUser.email != email)
    await models.User.update({ email }, { where: { googleId } })

  if (existingUser.isBlacklisted) return res.sendStatus(401)

  existingUser = await existingUser.reload()
  const role = await existingUser.getRole({ attributes: ['name', 'scope'] })
  const permissions = await existingUser.getPermissions({
    attributes: ['name', 'scope'],
  })

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
  const { email, to } = req.body
  const user = await models.User.findOne({ where: { email } })
  const userRole = await user.getRole()

  authorize(
    (userRole.name == 'ADMIN' && req.user.is('ROOT')) ||
      (userRole.name == 'USER' && (req.user.is('ROOT') || req.user.is('ADMIN')))
  )

  await models.User.update({ isBlacklisted: to }, { where: { email } })

  res.sendStatus(200)
})

module.exports = router
