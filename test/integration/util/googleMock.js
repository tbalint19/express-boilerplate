var MockAdapter = require('axios-mock-adapter')
const googleApi = require('../../../src/api/google.js')

const GoogleMock = () => {
  const mock = new MockAdapter(googleApi.http)
  return mock
}

module.exports = {
  GoogleMock,
}
