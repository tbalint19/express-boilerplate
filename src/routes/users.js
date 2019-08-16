var models = require('../models')
var express = require('express')
var router = express.Router()

router.get('/', async (req, res) => {
  let users = await models.User.findAll()
  res.json({ users })
})

router.get('/:user_id', async (req, res) => {
  let criteria = {
    where: {
      id: user_id,
    },
  }
  let user = await models.User.findAll(criteria)
  res.json(user)
})

router.post('/', async (req, res) => {
  let newUser = {
    username: req.body.username,
  }
  let savedUser = await models.User.create(newUser)
  res.json(savedUser)
})

router.put('/:user_id', async (req, res) => {
  let criteria = {
    where: {
      id: req.params.user_id,
    },
  }
  let data = {
    username: req.body.username,
  }
  let savedUser = await models.User.update(data, criteria)
  res.json(savedUser)
})

router.delete('/:user_id', async (req, res) => {
  let criteria = {
    where: {
      id: req.params.user_id,
    },
  }
  await models.User.destroy(criteria)
  res.status(201).end()
})

module.exports = router
