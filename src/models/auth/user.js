module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    googleId: DataTypes.STRING,
    email: DataTypes.STRING,
    isBlacklisted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  })

  User.associate = (models) => {
    models.User.hasMany(models.Permission)
    models.User.hasMany(models.Role)
  }

  return User
}
