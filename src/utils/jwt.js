const jwt = require('jsonwebtoken')
const jwtConfig = require('../../config')['jwt']

const create = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      jwtConfig.secret,
      { expiresIn: jwtConfig.lifeTime },
      function(err, token) {
        if (err) return reject(err)
        else return resolve(token)
      }
    )
  )

const verify = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, jwtConfig.secret, function(err, payload) {
      if (err) return reject(err)
      else return resolve(payload)
    })
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
