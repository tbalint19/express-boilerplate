const jwt = require('jsonwebtoken')
const jwtConfig = require('../../config')['jwt']

const create = (payload, secret=jwtConfig.secret) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      secret,
      { expiresIn: jwtConfig.lifeTime },
      (err, token) => (err ? reject(err) : resolve(token))
    )
  )

const verify = (token, secret=jwtConfig.secret) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, payload) =>
      err ? reject(err) : resolve(payload)
    )
  )

const parse = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  } catch (e) {
    return null
  }
}

module.exports = {
  create,
  verify,
  parse,
}
