var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/user', (req, res) => {
  models.User.findAll({
    include: [ models.Task ]
  }).then((users) => {
    res.json({ users })
  })
})

router.post('/user', (req, res) => {
  models.User.create({
    username: req.body.username
  }).then((user) => {
    res.json(user);
  })
})

router.delete('/user/:user_id', function(req, res) {
  models.User.destroy({
    where: {
      id: req.params.user_id
    }
  }).then(() => {
    res.json({ done: true })
  });
});

router.post('/user/:user_id/task', function (req, res) {
  models.Task.create({
    title: req.body.title,
    UserId: req.params.user_id
  }).then(function() {
    res.redirect('/');
  });
});

router.delete('/user/:user_id/task/:task_id', function (req, res) {
  models.Task.destroy({
    where: {
      id: req.params.task_id
    }
  }).then(function() {
    res.redirect('/');
  });
});


module.exports = router;
