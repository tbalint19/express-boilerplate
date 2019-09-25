'use strict'

var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var basename = path.basename(__filename)
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../../config.js')['database'][env]
var db = {}

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

fs.readdirSync(__dirname, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .forEach((dirname) => {
    fs.readdirSync(__dirname + '/' + dirname)
      .filter((file) => {
        return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js'
        )
      })
      .forEach((file) => {
        var model = sequelize['import'](
          path.join(__dirname + '/' + dirname, file)
        )
        db[model.name] = model
      })
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
