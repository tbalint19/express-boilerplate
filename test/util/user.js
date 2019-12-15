var app = require('../../src/app.js')
var request = require('supertest')

class User {
  constructor() {
    this.client = null
  }

  setClient(jwt) {
    this.client = jwt
      ? request(app).set('Authorization', `${jwt}`)
      : request(app)
  }
}
