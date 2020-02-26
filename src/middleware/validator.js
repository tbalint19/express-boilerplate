const { validationResult } = require('express-validator')

const middleware = (...validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)
    return errors.isEmpty()
      ? next()
      : res.status(422).json({ errors: errors.array() })
  }
}

module.exports = middleware
