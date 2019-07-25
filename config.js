module.exports = {
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
};
