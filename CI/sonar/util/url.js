const config = require('../config.json')

const bugUrl = (config) => {
  const url = config["sonar.host.url"]
  const org = config["sonar.organization"]
  const key = config["sonar.projectKey"]
  return `${url}/api/issues/search?organization=${org}&componentKeys=${key}&pageSize=-1&p=1&resolved=false`
}

const duplicationsUrl = (config) => {
  const url = config["sonar.host.url"]
  const key = config["sonar.projectKey"]
  return `${url}/api/measures/component_tree?baseComponentKey=${key}&metricKeys=duplicated_lines&pageSize=500&p=1`
}

module.exports = {
  bugUrl: bugUrl(config),
  duplicationsUrl: duplicationsUrl(config)
}
