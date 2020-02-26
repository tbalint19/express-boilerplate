class AnonymousUser {
  constructor() {
    this.id = null
    this.username = null
    this.role = null
    this.permissions = []
  }

  isAuthenticated() {
    return false
  }
}

module.exports = AnonymousUser
