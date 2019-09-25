var express = require('express')
require('express-async-errors')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')

var errorHandler = require('./middleware/errorHandler')
var authMiddleware = require('./middleware/authMiddleware')
// require middleware

var login = require('./routes/login')
// require routes

var app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(logger('combined'))
app.use(cors())

app.use(authMiddleware)
// use middleware

app.use('/api/login', login)
// use routes

app.use(errorHandler(app))

module.exports = app
