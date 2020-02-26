var pg = require('pg')
delete pg.native

module.exports = {

  'db': {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
    dialectModule: pg,
    native: false,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },

  'google': {
    client_ID: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI
  },

  'jwt': {
    secret: process.env.JWT_SECRET,
    lifeTime: "8h"
  },

  'prometheus': {
    accuracies: ['ms', 's'],
    metricTypes: [
      'httpRequestsTotal',
      'httpRequestsSummary',
      'httpRequestsHistogram',
      'httpRequestDurationSeconds',
      'httpRequestDurationPerPercentileSeconds'
    ]
  }

}
