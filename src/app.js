const express = require('express')
require('express-async-errors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const { createMiddleware } = require('@promster/express')
const config = require(__dirname + '/../config')

const errorHandler = require('./middleware/errorHandler')
const sessionUserResolver = require('./middleware/sessionUserResolver')
const logger = require('./middleware/logger')
// require middleware

const user = require('./routes/user')
const role = require('./routes/role')
const prometheus = require('./routes/actuator')
// require routes

const app = express()

app.use(createMiddleware({ app, options: config['prometheus'] }))
app.use(bodyParser.json())
app.use(cookieParser())
//app.use(logger({ persist: true }))
app.use(logger({ persist: false }))
app.use(cors())
app.use(sessionUserResolver)
// use middleware

app.use('/api/user', user)
app.use('/api/role', role)
app.use('/actuator', prometheus)
// use routes

app.use(errorHandler)

module.exports = app
