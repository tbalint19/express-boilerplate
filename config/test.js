var pg = require('pg')

module.exports = {

  'db': {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false
  },

  'google': {
    client_ID: "dummy",
    client_secret: "dummy",
    redirect_uri: "http://localhost:8080/dummy"
  },

  'jwt': {
    secret: "secret-key",
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
