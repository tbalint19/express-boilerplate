var asJson = require('../util/coverageReportAsObj.js')
var config = require('../config.json')

var coverage = config.coverage

var checkTresholds = function(report, name) {
  for (var key in report) {
    if (report[key] < coverage[name][key])
      throw "" + coverage[name][key] + "% not passed for " + key + " at " + name + " tests! (" + report[key] + "%)"
    else
      console.log("" + name + "/" + key + " - passed (" + report[key] + "%)");
  }
}

var unitReport = asJson('./unit-coverage.txt')
var integrationReport = asJson('./integration-coverage.txt')

checkTresholds(unitReport, "unit")
checkTresholds(integrationReport, "integration")
