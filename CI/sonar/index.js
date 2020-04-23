const {
  sonarAnalysis
} = require('./util/analysis.js')

const {
  processBugReport,
  processDuplicationsReport
} = require('./util/process.js')

const processReports = () => {
  // An instant request for the report returns the "old" result
  setTimeout(processBugReport, 5000)
  setTimeout(processDuplicationsReport, 5000)
}

sonarAnalysis(processReports)
