var models = require('../models')
var express = require('express')
var router = express.Router()

router.get('/', getAllUsers)
router.post('/', createUser)
router.delete('/:user_id', deleteUser)
router.post('/:user_id/task', createTask)
router.delete('/:user_id/task/:task_id', deleteTask)

const getAllUsers = async function(req, res) {
  let users = await models.User.findAll()
  res.json({ users })
}

const createUser = async function(req, res) {
  let newUser = {
    username: req.body.username,
  }
  let savedUser = await models.User.create(newUser)
  res.json(user)
}

const deleteUser = async function(req, res) {
  let criteria = {
    where: {
      id: req.params.user_id,
    },
  }
  await models.User.destroy(criteria)
  res.status(201).end()
}

const createTask = async function(req, res) {
  let newTask = {
    title: req.body.title,
    UserId: req.params.user_id,
  }
  let savedTask = await models.Task.create(newTask)
  res.json(taskDto(savedTask))
}

const deleteTask = async function(req, res) {
  let criteria = {
    where: {
      id: req.params.task_id,
    },
  }
  await models.Task.destroy(criteria)
  res.status(201).end()
}

module.exports = router
