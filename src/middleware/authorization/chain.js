class Authorization {
  constructor() {
    this.possibleRoles = null
    this.possiblePermissions = null
    this.requiredScope = null
    this.condition = null
    this.errorStatus = null
  }

  at(requiredScope) {
    this.requiredScope = requiredScope
    return this
  }

  when(cb) {
    this.condition = cb
    return this
  }

  evaluate(req, res) {
    if (this.condition && !this.condition(req, res)) return
    if (this.requiredScope) {
      if (this.possiblePermissions) this.evaluateScopedPermission(res)
      else this.evaluateScopedRole(res)
    } else {
      if (this.possiblePermissions) this.evaluatePermission(res)
      else if (this.possibleRoles) this.evaluateRole(res)
      else this.evaluateUser(res)
    }
  }

  evaluateScopedPermission(res) {
    const grantExists =
      this.isAuthenticatedUser(res) &&
      res.locals.user.groups[this.requiredScope] &&
      res.locals.user.groups[this.requiredScope].permissions &&
      res.locals.user.groups[this.requiredScope].permissions.some((p) =>
        this.possiblePermissions.includes(p.name)
      )
    if (!grantExists) this.errorStatus = 403
  }

  evaluateScopedRole(res) {
    const grantExists =
      this.isAuthenticatedUser(res) &&
      res.locals.user.groups[this.requiredScope] &&
      this.possibleRoles.some(
        (r) => res.locals.user.groups[this.requiredScope].role.name
      )
    if (!grantExists) this.errorStatus = 403
  }

  evaluatePermission(res) {
    const grantExists =
      this.isAuthenticatedUser(res) &&
      res.locals.user.permissions.some((p) =>
        this.possiblePermissions.includes(p.name)
      )
    if (!grantExists) this.errorStatus = 403
  }

  evaluateRole(res) {
    const grantExists =
      this.isAuthenticatedUser(res) &&
      this.possibleRoles.some((r) => res.locals.user.role.name == r)
    if (!grantExists) this.errorStatus = 403
  }

  evaluateUser(res) {
    const grantExists = this.isAuthenticatedUser(res)
    if (!grantExists) this.errorStatus = 401
  }

  isAuthenticatedUser(res) {
    return res.locals && res.locals.user && res.locals.user.isAuthenticated()
  }
}

const is = (...possibleRoles) => {
  const authorization = new Authorization()
  authorization.possibleRoles = possibleRoles
  return authorization
}

const can = (...possiblePermissions) => {
  const authorization = new Authorization()
  authorization.possiblePermissions = possiblePermissions
  return authorization
}

const isAuthenticated = () => {
  const authorization = new Authorization()
  return authorization
}

module.exports = { is, can, isAuthenticated }
