'use strict'
module.exports = (sequelize, DataTypes) => {
  var Role = sequelize.define('Role', {
    name: DataTypes.STRING,
    scope: DataTypes.STRING,
    preAssignedTo: DataTypes.STRING,
  })

  Role.associate = (models) => {
    models.Role.belongsTo(models.User)
  }

  return Role
}
