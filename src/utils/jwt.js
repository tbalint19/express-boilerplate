const jwt = require('jsonwebtoken')
const jwtConfig = require('../../config')['jwt']

const create = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      jwtConfig.secret,
      { expiresIn: jwtConfig.lifeTime },(err, token) => (err ? resolve(null) : resolve(token))
    )
  )

const verify = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, jwtConfig.secret, (err, payload) =>
      err ? resolve(null) : resolve(payload)
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
