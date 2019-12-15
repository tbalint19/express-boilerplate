// Quite obviously... that is not a real migration
// This is only a help for dev mode, when db is created with models.sync()
// For large scale projects check:
// https://sequelize.org/master/manual/migrations.html

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
