'use strict'

var app = require('../../src/app.js')
var request = require('supertest')
var { parse } = require('../../src/utils/jwt.js')

var { googleResponse } = require('../util/googleResponse.js')
var { GoogleMock } = require('../util/googleMock.js')
var { newDb, database, clearDb } = require('../util/db.js')

describe('User endpoint tests', () => {
  beforeAll(() => newDb())
  beforeEach(() => clearDb())

  it('should login as user without preassigned role', async () => {
    // given

    // when
    const sessionToken = await login({
      googleId: '1',
      email: 'randomUser@company.hu',
    })

    // then
    const sessionData = parse(sessionToken)
    expect(sessionData.googleId).toBe('1')
    expect(sessionData.email).toBe('randomUser@company.hu')
    expect(sessionData.role.name).toBe('USER')

    const users = await database.User.findAll()
    expect(users).toHaveLength(1)
  })

  it('should login as root with programatically preassigned root role', async () => {
    // given
    await programaticallyPreassingRoot('rootUser@company.hu')

    // when
    const sessionToken = await login({
      googleId: '1',
      email: 'rootUser@company.hu',
    })

    // then
    const sessionData = parse(sessionToken)
    expect(sessionData.googleId).toBe('1')
    expect(sessionData.email).toBe('rootUser@company.hu')
    expect(sessionData.role.name).toBe('ROOT')
  })

  it('should blacklist user as root', async () => {
    // given
    await programaticallyPreassingRoot('rootUser@company.hu')
    await login({ googleId: '2', email: 'randomUser@company.hu' })
    const sessionToken = await login({
      googleId: '1',
      email: 'rootUser@company.hu',
    })

    // when
    const response = await blacklistUser({
      as: sessionToken,
      email: 'randomUser@company.hu',
    })

    // then
    const users = await database.User.findAll()
    expect(users).toHaveLength(2)

    const blacklistedUser = await database.User.findOne({
      where: { email: 'randomUser@company.hu' },
    })
    expect(blacklistedUser.isBlacklisted).toBe(true)
  })

  it('should whitelist user as root', async () => {
    // given
    await programaticallyPreassingRoot('rootUser@company.hu')
    await login({ googleId: '2', email: 'randomUser@company.hu' })
    const sessionToken = await login({
      googleId: '1',
      email: 'rootUser@company.hu',
    })
    await blacklistUser({ as: sessionToken, email: 'randomUser@company.hu' })

    // when
    const response = await whitelistUser({
      as: sessionToken,
      email: 'randomUser@company.hu',
    })

    // then
    const users = await database.User.findAll()
    expect(users).toHaveLength(2)

    const blacklistedUser = await database.User.findOne({
      where: { email: 'randomUser@company.hu' },
    })
    expect(blacklistedUser.isBlacklisted).toBe(false)
  })

  test.todo('should blacklist admin as root')

  test.todo('should whitelist admin as root')
})

const login = async ({ googleId, email }) => {
  const googleApi = GoogleMock()
  const userData = await googleResponse({ googleId, email })
  googleApi.onPost('/oauth2/v4/token').reply(200, userData)

  const response = await request(app)
    .post('/api/user/login')
    .send({ authorizationCode: '789xyz' })

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
