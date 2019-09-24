'use strict'
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    googleId: DataTypes.STRING,
    email: DataTypes.STRING,
  })

  User.associate = (models) => {
    models.User.hasMany(models.Grant)
  }

  return User
}
