const axios = require('axios')
const querystring = require('querystring')
const GOOGLE_CONFIG = require('../../google.json')

class GoogleAPI {
  constructor() {
    this.http = axios.create({
      baseURL: 'https://www.googleapis.com',
    })
  }

  getIdToken(authorizationCode) {
    const formData = {
      code: authorizationCode,
      redirect_uri: GOOGLE_CONFIG.redirect_uri,
      client_id: GOOGLE_CONFIG.client_ID,
      client_secret: GOOGLE_CONFIG.client_secret,
      scope: "openid email profile",
      grant_type: "authorization_code",
    }
    return this.http.post('/oauth2/v4/token', querystring.stringify(formData))
  }
}

const googleApi = new GoogleAPI()

module.exports = googleApi
