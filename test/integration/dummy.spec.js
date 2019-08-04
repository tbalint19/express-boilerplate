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
      this.models.Task.destroy({ truncate: true }),
      this.models.User.destroy({ truncate: true }),
    ])
  })

  it('should save user', async function() {
    // given
    let newUser = { username: 'bela' }

    // when
    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(200)

    // then
    await Promise.all([
      this.models.User.findAll().then((users) =>
        expect(users).to.have.length(1)
      ),
      this.models.Task.findAll().then((tasks) =>
        expect(tasks).to.have.length(0)
      ),
    ])
  })

  it('should query the saved user', async function() {
    // given
    let newUser = { username: 'bela' }
    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(200)

    // when
    let response = await request(app)
      .get('/api/users/')
      .expect(200)

    expect(response.body.users[0].username).to.have.be('bela')
  })

  it('should save user again to clear db', async function() {
    // given
    let newUser = { username: 'bela' }

    // when
    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(200)

    // then
    await Promise.all([
      this.models.User.findAll().then((users) =>
        expect(users).to.have.length(1)
      ),
      this.models.Task.findAll().then((tasks) =>
        expect(tasks).to.have.length(0)
      ),
    ])
  })

  it('should recieve updated user', async function() {
    // given
    let newUser = { username: 'bela' }
    let userCreateResponse = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(200)

    // when
    let userUpdateResponse = await request(app)
      .put('/api/users/' + userCreateResponse.body.id)
      .send(newUser)
      .expect(200)

    // then
    expect(userUpdateResponse.body[0]).to.be(1)
    await Promise.all([
      this.models.User.findAll().then((users) =>
        expect(users).to.have.length(1)
      ),
      this.models.Task.findAll().then((tasks) =>
        expect(tasks).to.have.length(0)
      ),
    ])
  })
})
