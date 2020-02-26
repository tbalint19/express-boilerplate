class SessionUser {
  constructor(jwtPayload) {
    this.id = jwtPayload.id
    this.username = jwtPayload.username
    this.role = jwtPayload.role
    this.permissions = jwtPayload.permissions
    this.groups = jwtPayload.groups
  }

  isAuthenticated() {
    return true
  }
}

module.exports = SessionUser
