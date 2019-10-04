const path = require('path');

module.exports = function(config) {
  config.set({
    mutate: [ "src/utils/*.js" ],
    files: [
      'bin/*',
      'migrations/*',
      '.sequelizerc',
      'src/**/*.js',
      'test/**/*.js',
      'config.js'
    ],
    mutator: "javascript",
    packageManager: "npm",
    testRunner: "mocha",
    transpilers: [],
    testFramework: "mocha",
    mochaOptions: {
      files: ['test/unit/*.js']
    },
    reporters: ["progress", "clear-text", "html", "dots"],
    coverageAnalysis: "perTest"
  });
};
