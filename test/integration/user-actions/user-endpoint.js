const app = require('../../../src/app.js')
const request = require('supertest')

const { googleResponse } = require('../util/googleResponse.js')
const { GoogleMock } = require('../util/googleMock.js')

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

const loginWithoutAuthentication = async () => {
  const googleApi = GoogleMock()
  googleApi.onPost('/oauth2/v4/token').reply(401)

  const response = await request(app)
    .post('/api/user/login')
    .send({ authorizationCode: '789xyz' })

  googleApi.restore()

  return response
}

const loginWithoutAuthCode = async () => {
  const response = await request(app)
    .post('/api/user/login')
    .send({})
  return response
}

const programaticallyPreassingRoot = async (email) => {
  const models = require('../../../src/models')
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
  loginWithoutAuthentication,
  loginWithoutAuthCode,
  blacklistUser,
  whitelistUser,
}
