'use strict';

var app = require('../../src/app')
var expect = require('expect.js');
var request = require('supertest');

describe('User creation tests', function () {
  before(function () {
    return require('../../src/models').sequelize.sync()
  })

  beforeEach(function () {
    this.models = require('../../src/models');

    return Promise.all([
      this.models.Task.destroy({ truncate: true }),
      this.models.User.destroy({ truncate: true })
    ])
  })

  it('should save user', async function() {
    // given
    let newUser = { username: 'bela' }

    // when
    await request(app)
      .post('/api/user')
      .send(newUser)
      .expect(200)

    // then
    await Promise.all([
      this.models.User.findAll().then(users => expect(users).to.have.length(1)),
      this.models.Task.findAll().then(tasks => expect(tasks).to.have.length(0)),
    ])
  })

  it('should save user again to clear db', async function() {
    // given
    let newUser = { username: 'bela' }

    // when
    await request(app)
      .post('/api/user')
      .send(newUser)
      .expect(200)

    // then
    await Promise.all([
      this.models.User.findAll().then(users => expect(users).to.have.length(1)),
      this.models.Task.findAll().then(tasks => expect(tasks).to.have.length(0)),
    ])
  })
})
