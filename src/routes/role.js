const models = require('../models')
const express = require('express')
const router = express.Router()
const googleApi = require('../api/google.js')
const { authorize } = require('../utils/authorize')

router.post('/admin', async (req, res) => {
  authorize(req.user.is('ROOT'))

  const { email } = req.body
  const target = await models.User.findOne({ where: { email } })

  if (target) {
    const currentRole = await target.getRole()
    authorize(currentRole != 'ROOT')
    await models.Role.update(
      { name: 'ADMIN' },
      { where: { UserId: target.id } }
    )
  } else
    await models.Role.create({
      name: 'ADMIN',
      scope: null,
      preAssignedTo: email,
    })

  res.sendStatus(201)
})

module.exports = router
