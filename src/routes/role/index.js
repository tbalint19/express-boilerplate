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
  validate(body('email').isEmail()),
  findTargetUser(),
  assignRole(),
])

module.exports = router
