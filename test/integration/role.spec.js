'use strict'

var app = require('../../src/app.js')
var expect = require('expect.js')
var request = require('supertest')

var { newDb, clearDb } = require('../util/db.js')
var {
  programaticallyPreassingRoot,
  login,
} = require('./user.spec.js')

describe('User endpoint tests', function() {

  before(async function() {
    this.models = await newDb()
  })

  beforeEach(async function() {
    await clearDb()
  })

  it('should preassign admin role as root', async function() {
    // given
    await programaticallyPreassingRoot("rootUser@company.hu")
    const sessionToken = await login({ googleId: "1", email: "rootUser@company.hu" })

    // when
    const response = await assignAdminRole({ as: sessionToken, to: "randomUser@company.hu",  })

    // then
    const users = await this.models.User.findAll()
    expect(users).to.have.length(1)

    const roles = await this.models.Role.findAll()
    expect(roles).to.have.length(2)
  })

  it('should not preassign admin role unauthenticated')

  it('should not change root role to admin')

})

const assignAdminRole = async ({ as, to }) => {
  const response = await request(app)
    .post('/api/role/admin')
    .set('Authorization', as)
    .send({ email: to })
    .expect(201)
  return response
}
