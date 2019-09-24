'use strict'
module.exports = (sequelize, DataTypes) => {
  var Grant = sequelize.define('Grant', {
    name: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM,
      values: [
        'ROLE',
        'PERMISSION'
      ]
    },
    scope: DataTypes.STRING,
  })

  Grant.associate = (models) => {
    models.Grant.belongsTo(models.User)
  }

  return Grant
}
