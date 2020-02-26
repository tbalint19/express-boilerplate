const jwt = require('../../utils/jwt.js')
const SessionUser = require('./sessionUser')
const AnonymousUser = require('./anonymousUser')

const middleware = async (req, res, next) => {
  try {
    const sessionToken = req.get('Authorization')
    const payload = await jwt.verify(sessionToken)
    res.locals.user = new SessionUser(payload)
  } catch (e) {
    res.locals.user = new AnonymousUser()
  }
  return next()
}

module.exports = middleware
