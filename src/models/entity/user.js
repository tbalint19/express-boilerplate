'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING
  })

  User.associate = (models) => {
    models.User.hasMany(models.Task);
  }

  return User;
};
