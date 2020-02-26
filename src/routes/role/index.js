const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const validate = require('../../middleware/validator')
const authorize = require('../../middleware/authorization')
const {
  is,
  can,
  isAuthenticated,
} = require('../../middleware/authorization/chain')
const { findTargetUser, assignRole } = require('./middleware')

router.post('/admin', [
  authorize(is('ROOT')),
  validate(
    body('email')
      .exists()
      .bail()
      .isEmail()
  ),
  findTargetUser(),
  authorize(
    is('ROOT').when(
      (req, res) => res.locals.userRole && res.locals.userRole.name == 'ROOT'
    )
  ),
  assignRole(),
])

module.exports = router
