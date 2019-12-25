const {
  sonarAnalysis
} = require('./util/analysis.js')

const {
  processBugReport,
  processDuplicationsReport
} = require('./util/process.js')

const processReports = () => {
  // An instant request for the report returns the "old" result
  setTimeout(processBugReport, 1000)
  setTimeout(processDuplicationsReport, 1000)
}

sonarAnalysis(processReports)
