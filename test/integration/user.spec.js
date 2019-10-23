'use strict'

var app = require('../../src/app.js')
var expect = require('expect.js')
var request = require('supertest')
var { parse } = require('../../src/utils/jwt.js')

var { googleResponse } = require('../util/googleResponse.js')
var { GoogleMock } = require('../util/googleMock.js')
var { newDb, clearDb } = require('../util/db.js')

describe('User endpoint tests', function() {

  before(async function() {
    this.models = await newDb()
  })

  beforeEach(async function() {
    await clearDb()
  })

  it('should login as user without preassigned role', async function() {
    // given

    // when
    const sessionToken = await login({ googleId: "1", email: "randomUser@company.hu" })

    // then
    const sessionData = parse(sessionToken)
    expect(sessionData.googleId).to.be("1")
    expect(sessionData.email).to.be("randomUser@company.hu")
    expect(sessionData.role.name).to.be("USER")

    const users = await this.models.User.findAll()
    expect(users).to.have.length(1)
  })

  it('should login as root with programatically preassigned root role', async function() {
    // given
    await programaticallyPreassingRoot("rootUser@company.hu")

    // when
    const sessionToken = await login({ googleId: "1", email: "rootUser@company.hu" })

    // then
    const sessionData = parse(sessionToken)
    expect(sessionData.googleId).to.be("1")
    expect(sessionData.email).to.be("rootUser@company.hu")
    expect(sessionData.role.name).to.be("ROOT")
  })

  it('should blacklist user as root', async function() {
    // given
    await programaticallyPreassingRoot("rootUser@company.hu")
    await login({ googleId: "2", email: "randomUser@company.hu" })
    const sessionToken = await login({ googleId: "1", email: "rootUser@company.hu" })

    // when
    const response = await blacklistUser({ as: sessionToken, email: "randomUser@company.hu" })

    // then
    const users = await this.models.User.findAll()
    expect(users).to.have.length(2)

    const blacklistedUser = await this.models.User.findOne({ where: { email: "randomUser@company.hu" } })
    expect(blacklistedUser.isBlacklisted).to.be(true)
  })

  it('should whitelist user as root', async function() {
    // given
    await programaticallyPreassingRoot("rootUser@company.hu")
    await login({ googleId: "2", email: "randomUser@company.hu" })
    const sessionToken = await login({ googleId: "1", email: "rootUser@company.hu" })
    await blacklistUser({ as: sessionToken, email: "randomUser@company.hu" })

    // when
    const response = await whitelistUser({ as: sessionToken, email: "randomUser@company.hu" })

    // then
    const users = await this.models.User.findAll()
    expect(users).to.have.length(2)

    const blacklistedUser = await this.models.User.findOne({ where: { email: "randomUser@company.hu" } })
    expect(blacklistedUser.isBlacklisted).to.be(false)
  })

  it('should blacklist admin as root')

  it('should whitelist admin as root')

})

const login = async ({ googleId, email }) => {
  const googleApi = GoogleMock()
  const userData = await googleResponse({ googleId, email })
  googleApi
    .onPost("/oauth2/v4/token")
    .reply(200, userData)

  const response = await request(app)
    .post('/api/user/login')
    .send({ authorizationCode: "789xyz"})
    .expect(200)

  googleApi.restore()

  const sessionToken = response.body.sessionToken
  return sessionToken
}

const programaticallyPreassingRoot = async (email) => {
  const models = require('../../src/models')
  await models.Role.create({
    name: 'ROOT',
    scope: null,
    preAssignedTo: email,
  })
}

const toggleUser = async ({ as, email, to }) => {
  const response = await request(app)
    .post('/api/user/blacklist')
    .set('Authorization', as)
    .send({ email, to })
    .expect(200)
  return response
}

const blacklistUser = async ({ as, email }) => {
  return await toggleUser({ as, email, to: true })
}

const whitelistUser = async ({ as, email }) => {
  return await toggleUser({ as, email, to: false })
}

module.exports = {
  programaticallyPreassingRoot,
  login,
  blacklistUser,
  whitelistUser,
}
