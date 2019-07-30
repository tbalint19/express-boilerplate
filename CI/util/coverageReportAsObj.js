var fs = require('fs')

module.exports = (fileWithPath) => {
  var report = fs.readFileSync(fileWithPath, 'utf8').toString()

  var lines = report.split('\n')

  var coverageData = {}

  var keywords = ['Statements', 'Branches', 'Functions', 'Lines']
  for (var line of lines) {
    for (var keyword of keywords) {

      if (!line.includes(keyword)) continue

      var start = line.indexOf(':')
      var end = line.indexOf('%')

      var result = parseFloat(line.substring(start, end).substring(1).trim())

      coverageData[keyword.toLowerCase()] = result
    }
  }

  return coverageData
}
