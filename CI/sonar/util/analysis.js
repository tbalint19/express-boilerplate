const sonarqubeScanner = require('sonarqube-scanner')

const { logProject } = require('./logger.js')
const config = require('../config.json')

const sonarHostUrl = config["sonar.host.url"]

const sonarAnalysis = (callback) => {
  logProject(config)

  sonarqubeScanner({
    sonarHostUrl,
    options: config
  }, callback);
}

module.exports = {
  sonarAnalysis
}
