const database = require('../../../src/models')

const newDb = async () => {
  await database.sequelize.sync()
}

const clearDb = async () => {
  const { sequelize, Sequelize, ...modelEntries } = database
  const models = Object.values(modelEntries)
  await Promise.all(models.map((model) => model.destroy({ truncate: true })))
}

module.exports = {
  newDb,
  models: database,
  clearDb,
}
