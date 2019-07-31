const path = require('path');

module.exports = function(config) {
  config.set({
    mutate: [ "src/**/*.js" ],
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
    reporters: ["clear-text", "progress"],
    testRunner: "mocha",
    transpilers: [],
    testFramework: "mocha",
    mochaOptions: {
      files: ['test/integration/*.js']
    },
    coverageAnalysis: "perTest"
  });
};
