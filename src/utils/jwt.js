const jwt = require('jsonwebtoken')
const atob = require('atob')
const jwtConfig = require('../../config')['jwt']

const create = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      jwtConfig.secret,
      { expiresIn: jwtConfig.lifeTime },
      (err, token) => (err ? resolve(null) : resolve(token))
    )
  )

const verify = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, jwtConfig.secret, (err, payload) =>
      err ? resolve(null) : resolve(payload)
    )
  )

const b64DecodeUnicode = (str) => {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map((char) => {
        return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
}

const parse = (token) => {
  try {
    const decoded = b64DecodeUnicode(token.split('.')[1])
    return JSON.parse(decoded)
  } catch (e) {
    console.log(e)
    return null
  }
}

module.exports = {
  create,
  verify,
  parse,
}
