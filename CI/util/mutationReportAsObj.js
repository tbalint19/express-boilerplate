var fs = require('fs')

module.exports = () => {
  var data = fs.readFileSync('./reports/mutation/html/bind-mutation-test-report.js', 'utf8').toString()
  var toCut = "document.querySelector('mutation-test-report-app').report = "
  var serialized = data.substring(toCut.length, data.length-1)
  return JSON.parse(serialized)
}
