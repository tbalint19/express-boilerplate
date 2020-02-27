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
const {
  exchangeTokenForUserData,
  createUserIfNeeded,
  updateUser,
  createSessionToken,
  findTargetUser,
  toggleTargetUser,
} = require('./middleware')

router.post('/login', [
  validate(body('authorizationCode').exists()),
  exchangeTokenForUserData(),
  createUserIfNeeded(),
  updateUser(),
  createSessionToken(),
])

router.post('/blacklist', [
  authorize(isAuthenticated()),
  validate(body('email').isEmail(), body('to').isBoolean()),
  findTargetUser(),
  authorize(
    is('ROOT').when((req, res) => res.locals.userRole.name == 'ADMIN'),
    is('ROOT', 'ADMIN').when((req, res) => res.locals.userRole.name == 'USER')
  ),
  toggleTargetUser(),
])

module.exports = router
