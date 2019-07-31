var models = require('../models')
var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  models.User.findAll({
    include: [models.Task],
  }).then((users) => {
    res.json({ users })
  })
})

router.post('/', (req, res) => {
  models.User.create({
    username: req.body.username,
  }).then((user) => {
    res.json(user)
  })
})

router.delete('/:user_id', (req, res) => {
  models.User.destroy({
    where: {
      id: req.params.user_id,
    },
  }).then(() => {
    res.status(201).end()
  })
})

router.post('/:user_id/task', (req, res) => {
  models.Task.create({
    title: req.body.title,
    UserId: req.params.user_id,
  }).then((task) => {
    res.json(taskDto(task))
  })
})

router.delete('/:user_id/task/:task_id', (req, res) => {
  models.Task.destroy({
    where: {
      id: req.params.task_id,
    },
  }).then(() => {
    res.status(201).end()
  })
})

module.exports = router
