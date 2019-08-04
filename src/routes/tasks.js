var models = require('../models')
var express = require('express')
var router = express.Router()

router.post('/tasks', async (req, res) => {
  let newTask = {
    title: req.body.title,
    UserId: req.query.user_id,
  }
  let savedTask = await models.Task.create(newTask)
  res.json(taskDto(savedTask))
})

router.delete('tasks/:task_id', async (req, res) => {
  let criteria = {
    where: {
      id: req.params.task_id,
    },
  }
  await models.Task.destroy(criteria)
  res.status(201).end()
})

module.exports = router
