const models = require('../../models')
const googleApi = require('../../api/google')
const jwt = require('../../utils/jwt')

const exchangeTokenForUserData = (opts) => async (req, res, next) => {
  const authorizationCode = req.body.authorizationCode

  let userData
  try {
    const tokenResponse = await googleApi.getIdToken(authorizationCode)
    userData = jwt.parse(tokenResponse.data.id_token)
  } catch (e) {
    return res.sendStatus(401)
  }

  res.locals.googleData = {
    googleId: userData.sub,
    email: userData.email,
    picture: userData.picture,
    firstName: userData.given_name,
    lastName: userData.family_name,
  }

  next()
}

const createUserIfNeeded = (opts) => async (req, res, next) => {
  const {
    googleId,
    email,
    lastName,
    firstName,
    picture,
  } = res.locals.googleData

  let existingUser = await models.User.findOne({ where: { googleId } })

  if (!existingUser) {
    await models.sequelize.transaction(async (transaction) => {
      existingUser = await models.User.create(
        { googleId, email, lastName, firstName, picture },
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

  res.locals.existingUser = existingUser
  next()
}

const updateUser = (opts) => async (req, res, next) => {
  const {
    googleId,
    email,
    lastName,
    firstName,
    picture,
  } = res.locals.googleData

  await models.User.update(
    { googleId, email, lastName, firstName, picture },
    { where: { googleId } }
  )

  next()
}

const createSessionToken = (opts) => async (req, res, next) => {
  const existingUser = await res.locals.existingUser.reload()
  if (existingUser.isBlacklisted) return res.sendStatus(401)

  const allRoles = await existingUser.getRoles()
  const role = { name: allRoles.find((entry) => !entry.scope).name }
  const allPermissions = await existingUser.getPermissions()
  const permissions = allPermissions
    .filter((permission) => !permission.scope)
    .map(({ name }) => ({ name }))

  let groups = {}

  const sessionToken = await jwt.create({
    id: existingUser.id,
    googleId: existingUser.googleId,
    email: existingUser.email,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    picture: existingUser.picture,
    role,
    permissions,
    groups,
  })

  res.json({ sessionToken })
}

const findTargetUser = (opts) => async (req, res, next) => {
  const { email } = req.body
  const user = await models.User.findOne({ where: { email } })
  if (!user)
    return res.status(404).json({
      error: `Target user not found with email (${email})`,
    })
  const userRoles = await user.getRoles({ where: { scope: null } })
  res.locals.userRole = userRoles[0]
  next()
}

const toggleTargetUser = (opts) => async (req, res, next) => {
  const { email, to } = req.body
  await models.User.update({ isBlacklisted: to }, { where: { email } })
  res.sendStatus(204)
}

module.exports = {
  exchangeTokenForUserData,
  createUserIfNeeded,
  updateUser,
  createSessionToken,
  findTargetUser,
  toggleTargetUser,
}
