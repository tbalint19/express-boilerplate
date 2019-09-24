var jwt = require('../utils/jwt.js')

class SessionUser {
  constructor(jwtPayload) {
    this.id = jwtPayload.id
    this.username = jwtPayload.username
    this.role = jwtPayload.role
    this.permissions = jwtPayload.permissions
  }

  isAuthenticated() {
    return true
  }

  is(role) {
    return this.role == role
  }

  can(permission) {
    return this.permissions.includes(permission)
  }
}

class AnonymusUser {
  constructor() {
    this.id = null
    this.username = null
    this.role = null
    this.permissions = []
  }

  isAuthenticated() {
    return false
  }

  is(role) {
    return false
  }

  can(permission) {
    return false
  }
}

var authMiddleware = async (req, res, next) => {
  try {
    var sessionToken = req.get('Authorization')
    var payload = await jwt.verify(sessionToken)
    req.user = new SessionUser(payload)
  } catch (e) {
    req.user = new AnonymusUser()
  } finally {
    return next()
  }
}

module.exports = authMiddleware
