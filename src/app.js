var express = require('express')
require('express-async-errors')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')
var { createMiddleware } = require('@promster/express');
var config = require(__dirname + '/../config.js')

var errorHandler = require('./middleware/errorHandler')
var authMiddleware = require('./middleware/authMiddleware')
var jsonLoggerMiddleware = require('./middleware/jsonLoggerMiddleware')
// require middleware

var user = require('./routes/user')
var role = require('./routes/role')
var prometheus = require('./routes/actuator/prometheus')
// require routes

var app = express()

app.use(createMiddleware({ app, options: config['prometheus'] }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(jsonLoggerMiddleware({ persist: true }))
app.use(jsonLoggerMiddleware({ persist: false }))
app.use(cors())

app.use(authMiddleware)
// use middleware

app.use('/api/user', user)
app.use('/api/role', role)
app.use('/actuator', prometheus)
// use routes

app.use(errorHandler(app))

module.exports = app
