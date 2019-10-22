const newDb = async () => {
  const db = require('../../src/models')
  models = Object.entries(db).filter(entry => entry[0] !== 'sequelize' && entry[0] !== 'Sequelize')
  await Promise.all(models.map(model => model[1].destroy({ truncate: true })))
  return db
}

module.exports = {
  newDb
}
