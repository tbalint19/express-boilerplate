const newDb = async () => {
  const models = require('../../src/models')
  await models.sequelize.sync()
  return models
}

const clearDb = async () => {
  const { sequelize, Sequelize, ...modelEntries } = require('../../src/models')
  const models = Object.values(modelEntries)
  await Promise.all(models.map(model => model.destroy({ truncate: true })))
  return models
}

module.exports = {
  newDb,
  clearDb,
}
