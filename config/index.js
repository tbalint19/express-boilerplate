'use strict'

var fs = require('fs')
var path = require('path')
var basename = path.basename(__filename)

var config = {}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    var envConf = require(path.join(__dirname, file))
    config[file.slice(0, -3)] = envConf
  })

var env = process.env.NODE_ENV || 'development'

module.exports = config[env]
