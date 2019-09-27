var models = require('../src/models')

const resetDb = async () => {
  try {
    await models.sequelize.sync({ force: true })
    console.log("Sync completed")
  } catch (error) {
    console.log("Error occured")
    console.log(error)
  } finally {
    await models.sequelize.close()
    console.log("Connection closed")
  }
}

resetDb()
