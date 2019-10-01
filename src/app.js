var express = require('express')
require('express-async-errors')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')
var { createMiddleware } = require('@promster/express');
var config = require(__dirname + '/../config.js')
var fs = require('fs');
var path = require('path');
var rfs = require('rotating-file-stream')

var errorHandler = require('./middleware/errorHandler')
var authMiddleware = require('./middleware/authMiddleware')
// require middleware

var user = require('./routes/user')
var role = require('./routes/role')
var prometheus = require('./routes/actuator/prometheus')
// require routes

var app = express()

app.use(createMiddleware({ app, options: config['prometheus'] }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(logger('combined', {
    stream: rfs('access.log', {
    interval: '1m',
    path: path.join(__dirname, '../log')
  })
}))
app.use(logger('dev'))
app.use(cors())

app.use(authMiddleware)
// use middleware

app.use('/api/user', user)
app.use('/api/role', role)
app.use('/actuator', prometheus)
// use routes

app.use(errorHandler(app))

module.exports = app
