module.exports = {

  'database': {
    development: {
      username: "balint",
      password: "Fuzzwktrka88bcykjypt",
      database: "initial",
      dialect: 'postgres',
      host: '0.0.0.0',
      port: 5432,
    },
    test: {
      dialect: "sqlite",
      storage: ":memory:"
    },
    production: {
      username: "postgres",
      password: "postgres",
      database: "postgres",
      dialect: 'postgres',
      host: '0.0.0.0',
      port: 5433,
    }
  },

  'google': {
    client_ID: "968568259147-ngdsr8igkjdbkmko73gg2ifv8so4h08m.apps.googleusercontent.com",
    client_secret: "v9uvjy0lxeiMDnpLP_VKM4sc",
    redirect_uri: "http://localhost:8080/login"
  },

  'jwt': {
    secret: "secret-key",
    lifeTime: "8h"
  }

}
