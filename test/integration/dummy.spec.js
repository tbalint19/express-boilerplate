'use strict'

var app = require('../../src/app')
var expect = require('expect.js')
var request = require('supertest')

describe('User creation tests', function() {
  before(function() {
    return require('../../src/models').sequelize.sync()
  })

  beforeEach(function() {
    this.models = require('../../src/models')

    return Promise.all([
      this.models.Permission.destroy({ truncate: true }),
      this.models.Role.destroy({ truncate: true }),
      this.models.User.destroy({ truncate: true }),
    ])
  })

  it('should login', async function() {
    // given
    let newUser = { username: 'bela' }

    // when
    await request(app)
      .post('/api/bela')
      .send(newUser)
      .expect(404)

    // then
    const users = await this.models.User.findAll()
    expect(users).to.have.length(0)
  })

  it('should not be able to create admin', async function() {
    // given
    let newUser = { username: 'bela' }

    // when
    await request(app)
      .post('/api/role/admin')
      .send(newUser)
      .expect(403)

    // then
    const users = await this.models.User.findAll()
    expect(users).to.have.length(0)
  })
})
