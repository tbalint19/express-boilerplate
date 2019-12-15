const { create } = require('../../../src/utils/jwt.js')

const userDefaults = {
  iss: 'https://accounts.google.com',
  azp:
    '968568259147-ngdsr8igkjdbkmko73gg2ifv8so4h08m.apps.googleusercontent.com',
  aud:
    '968568259147-ngdsr8igkjdbkmko73gg2ifv8so4h08m.apps.googleusercontent.com',
  sub: null,
  email: null,
  email_verified: true,
  at_hash: 'ESzJXqBhR9gtLHl_Xo0MiA',
  name: 'Bálint Tóth',
  picture:
    'https://lh4.googleusercontent.com/-tYSIU9y8Nj8/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfW5Gn4GYhO7TAByct84Mp_yKuE7Q/s96-c/photo.jpg',
  given_name: 'Bálint',
  family_name: 'Tóth',
  locale: 'en-GB',
  iat: 1571653281,
}

const responseDefaults = {
  access_token:
    'ya29.Il-iByviSEPm6GfAQg40lLwCgs6swenjK8K8P-eF2QbZ5gp-cU4_8MlHnciEFiJ--UcMmjqXo7hDUxTXC2BfE_HH4WFdcGt1xJErTwptJOhmyOU62_vxN_NUxOEoG5ThUQ',
  expires_in: 3600,
  scope:
    'https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email',
  token_type: 'Bearer',
  id_token: null,
}

const copy = (data) => JSON.parse(JSON.stringify(data))

const googleResponse = async ({ googleId, email }) => {
  const user = copy(userDefaults)
  user.sub = googleId
  user.email = email
  const idToken = await create(user)
  const response = copy(responseDefaults)
  response.id_token = idToken
  return response
}

module.exports = {
  googleResponse,
}
