const jwt = require('jsonwebtoken')
const secretKey = 'secret-key'

const create = (payload) => new Promise((resolve, reject) => jwt.sign(
 payload,
 secretKey,
 { expiresIn: '8h' },
 function(err, token) {
   if (err)
    return reject(err)
   else
    return resolve(token)
 }
))

const verify = (token)  => new Promise((resolve, reject) => jwt.verify(
  token,
  secretKey,
  function(err, payload) {
    if (err)
     return reject(err)
    else
     return resolve(token)
  }
))

const parse = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  } catch (e) {
    return null
  }
}


module.exports = {
  create, verify, parse
}
