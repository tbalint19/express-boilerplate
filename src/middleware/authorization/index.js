const middleware = (...authorizations) => {
  return (req, res, next) => {
    for (let authorization of authorizations) {
      authorization.evaluate(req, res)

      if (authorization.errorStatus) {
        const user = res.locals.user
        const { condition, errorStatus, ...grant } = authorization
        res.status(authorization.errorStatus)
        return res.json({ user, grant })
      }
    }

    next()
  }
}

module.exports = middleware
