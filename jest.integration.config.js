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
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
