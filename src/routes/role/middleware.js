const models = require('../../models')

const findTargetUser = (opts) => async (req, res, next) => {
  const { email } = req.body
  res.locals.target = await models.User.findOne({ where: { email } })
  if (res.locals.target) {
    const userRoles = await user.getRoles({ where: { scope: null } })
    res.locals.targetIsRoot = userRoles[0].name == 'ROOT'
  } else res.locals.targetIsRoot = false
  next()
}

const assignRole = (opts) => async (req, res) => {
  const { email } = req.body
  const { target } = res.locals
  if (target) {
    await models.Role.update(
      { name: 'ADMIN' },
      { where: { UserId: target.id } }
    )
  } else {
    await models.Role.create({
      name: 'ADMIN',
      scope: null,
      preAssignedTo: email,
    })
  }

  res.sendStatus(204)
}

module.exports = {
  findTargetUser,
  assignRole,
}
