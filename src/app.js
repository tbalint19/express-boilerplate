var express = require('express')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var errorHandler = require('./middleware/errorHandler')
var authMiddleware = require('./middleware/authMiddleware')
// require middleware

var users = require('./routes/users')
// require routes

var app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(logger('combined'))

app.use(authMiddleware)
// use middleware

app.use('/api/users', users)
// use routes

app.use(errorHandler(app))

module.exports = app
