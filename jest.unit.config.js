module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/utils/*.js",
    "!**/node_modules/**"
  ],
  coverageThreshold: {
    global: {
      "branches": 60,
      "functions": 60,
      "lines": 60,
      "statements": 60
    }
  }
}
