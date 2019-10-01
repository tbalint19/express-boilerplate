var express = require('express')
require('express-async-errors')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')
var { createMiddleware } = require('@promster/express');
var prometheusOptions = require(__dirname + '/../config.js')['prometheus']
var fs = require('fs');

var errorHandler = require('./middleware/errorHandler')
var authMiddleware = require('./middleware/authMiddleware')
// require middleware

var user = require('./routes/user')
var role = require('./routes/role')
var prometheus = require('./routes/actuator/prometheus')
// require routes

var app = express()

app.use(createMiddleware({ app, options: prometheusOptions }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(logger('common', {
  stream: fs.createWriteStream('./access.log', {flags: 'a'})
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
