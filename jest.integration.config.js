module.exports = {
  verbose: true,
  collectCoverage:true,
  collectCoverageFrom: [
    "src/routes/*.js",
    "!src/routes/actuator/*.js",
    "!**/node_modules/**"
  ],
  coverageThreshold: {
    global: {
      "branches": 100,
      "functions": 100,
      "lines": 80,
      "statements": 80
    }
  }
}
