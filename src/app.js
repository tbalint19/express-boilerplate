var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var errorHandler = require('./middleware/errorHandler')

var users  = require('./routes/users');
// require more routes

var app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('combined'))

app.use('/api/user', users);
// use more routes

app.use(errorHandler(app));

module.exports = app;
