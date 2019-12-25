const request = require('request')
const config = require('../config.json')

const {
  bugUrl,
  duplicationsUrl
} = require('./url.js')

const {
  logError,
} = require('./logger.js')

const projectName = config["sonar.projectKey"]

const processBugReport = () => {
  request(bugUrl, (error, response, body) => {
    if (error)
      return logError(error, response, body)

    const issues = JSON.parse(body)["issues"]
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

    if (openRelevantIssues.length > 0)
      throw "Sonar found " + openRelevantIssues.length + " issues (only " + 0 + " is acceptable)"
  })
}

const processDuplicationsReport = () => {
  request(duplicationsUrl, (error, response, body) => {
    if (error)
      return logError(error, response, body)

    var response = JSON.parse(body)
    var filesWithDuplications = response["components"]
      .filter(c => c.qualifier == "FIL")
      .map(c => { return { file: c.path, numberOfDuplicatedLines: c.measures[0].value } })
      .filter(res => res.numberOfDuplicatedLines > 0)

    console.log("\n-------- Duplications -----------------")
    console.log("Fetched: ", duplicationsUrl)
    console.log("Project: ", projectName)
    console.log("Duplications: ", filesWithDuplications.length);
    filesWithDuplications.forEach(f => console.log(f))
    console.log("---------------------------------------\n")

    if (filesWithDuplications.length > 0)
      throw "Sonar found duplications in " + filesWithDuplications.length + " files (only " + 0 + " is acceptable)"
  })
}

module.exports = {
  processBugReport,
  processDuplicationsReport
}
