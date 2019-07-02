module.exports = {
  development: {
    username: "balint",
    password: "Fuzzwktrka88bcykjypt",
    database: "initial",
    dialect: 'postgres',
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:"
  },
  production: {
    username: "balint",
    password: "Fuzzwktrka88bcykjypt",
    database: "initial",
    dialect: 'postgres',
  }
};
