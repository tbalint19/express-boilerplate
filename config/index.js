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
var appConfig = config[env]

if (!appConfig) throw `
No config exists for NODE_ENV: '${env}' !
Are you sure config/${env}.js file exists?

Fix:
 - Copy config/test.js as config/${env}.js
 - update the values (process.env.** -> custom local values)
 - relaunch the app

(${env}.js will be gitignored)
`

module.exports = { ...appConfig, ...appConfig['db'] }
