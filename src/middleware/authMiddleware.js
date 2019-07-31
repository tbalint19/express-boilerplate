var parse = require('../utils/jwt.js')

var authMiddleware = (req, res, next) => {
  var jwt = req.get('Authorization')
  if (!jwt) return next()
  req.user = parse(jwt)
  next()
}

module.exports = authMiddleware
