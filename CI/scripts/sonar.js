var sonarqubeScanner = require('sonarqube-scanner');
var request = require('request');

var config = require('../config.json')
var packageJson = require('../../package.json')

var projectName = process.env.npm_config_branch
var serverUrl = config.sonar.url
var bugUrl = serverUrl + "/api/issues/search?componentRoots=" + projectName + "&pageSize=-1&p=1"
// http://sonarqube.vodafone.hu:9000/api/issues/search?componentRoots=projectKey&pageSize=500&p=1
var duplicationsUrl = serverUrl + "/api/measures/component_tree?baseComponentKey=" + projectName + "&metricKeys=duplicated_lines&pageSize=500&p=1"
// http://sonarqube.vodafone.hu:9000/api/measures/component_tree?baseComponentKey=projectKey&metricKeys=duplicated_lines&p=1
// as projects grow, p=2, p=3... might be neeeded (page=2, page=3, if 1000, 1500 files are examined)

console.log("---------------------------------")
console.log("Sonar project: ", projectName)
console.log("---------------------------------")

var maxIssues = config.sonar.maxIssues
var maxDuplications = config.sonar.maxDuplications

var sonarJob = function(callback) {
  sonarqubeScanner({
    serverUrl,
    options: {
      'sonar.sources': 'src',
      'sonar.scm.forceReloadAll': 'true',
      'sonar.scm.exclusions.disabled': 'false',
      'sonar.projectName': projectName,
      'sonar.projectKey': projectName
    }
  }, callback);
}

var bugAnalysis = function() {
  request(bugUrl, function (error, response, body) {
    if (error) {
      console.log('error:', error)
      console.log('statusCode:', response && response.statusCode)
      console.log('body:', body)
    }

    var issues = JSON.parse(body)["issues"]
    var relevantIssues = issues.filter(issue => issue.component.startsWith(projectName))
    var openRelevantIssues = relevantIssues
      .filter(issue => ((issue.resolution != 'FIXED') || (issue.status != 'CLOSED')))
      .map(issue => { return { file: issue.component.split(projectName)[1], message: issue.message }})

    console.log("\n------------ Issues -------------------")
    console.log("Fetched: ", bugUrl)
    console.log("Project: ", projectName)
    console.log("Issues: ", openRelevantIssues.length)
    console.log(openRelevantIssues)
    console.log("---------------------------------------\n")

    if (openRelevantIssues.length > maxIssues)
      throw "Sonar found " + openRelevantIssues.length + " issues (only " + maxIssues + " is acceptable)"
  })
}

var duplicationAnalysis = function() {
  request(duplicationsUrl, function (error, response, body) {
    if (error) {
      console.log('error:', error)
      console.log('statusCode:', response && response.statusCode)
      console.log('body:', body)
    }

    var response = JSON.parse(body)
    var filesWithDuplications = response["components"]
      .map(c => { return { file: c.name, duplicatedLines: c.measures[0].value } })
      .filter(res => res.duplicatedLines > 0)

    console.log("\n-------- Duplications -----------------")
    console.log("Fetched: ", duplicationsUrl)
    console.log("Project: ", projectName)
    console.log("Duplications: ", filesWithDuplications.length);
    filesWithDuplications.forEach(f => console.log(f))
    console.log("---------------------------------------\n")

    if (filesWithDuplications.length > 0)
      throw "Sonar found duplications in " + filesWithDuplications.length + " files (only " + maxDuplications + " is acceptable)"
  })
}

var sonarAnalysis = function() {
  bugAnalysis()
  duplicationAnalysis()
}

sonarJob(() => sonarJob(sonarAnalysis))
