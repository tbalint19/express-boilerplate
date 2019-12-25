const logError = (error, response, body) => {
  console.log('error:', error)
  console.log('statusCode:', response && response.statusCode)
  console.log('body:', body)
}

const logProject = (config) => {
  console.log("---------------------------------")
  console.log("Sonar project: ", config["sonar.projectKey"])
  console.log("---------------------------------")
}

const logBugs = (url, body) => {
  console.log("\n------------ Issues -------------------")
  console.log("Fetched: ", bugUrl)
  console.log("Project: ", projectName)
  console.log("Issues: ", openRelevantIssues.length)
  console.log(openRelevantIssues)
  console.log("---------------------------------------\n")
}

const logDuplications = () => {
  console.log("\n-------- Duplications -----------------")
  console.log("Fetched: ", duplicationsUrl)
  console.log("Project: ", projectName)
  console.log("Duplications: ", filesWithDuplications.length);
  filesWithDuplications.forEach(f => console.log(f))
  console.log("---------------------------------------\n")
}

module.exports = {
  logError, logProject
}
