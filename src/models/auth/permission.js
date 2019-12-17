module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    name: DataTypes.STRING,
    scope: DataTypes.STRING,
    preAssignedTo: DataTypes.STRING,
  })

  Permission.associate = (models) => {
    models.Permission.belongsTo(models.User)
  }

  return Permission
}
