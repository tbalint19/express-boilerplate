var yaml = require('js-yaml')
var fs = require('fs')

var loadDtos = () => {
  var dtos = {}

  var doc = yaml.safeLoad(fs.readFileSync('./static/swagger/swagger.yaml'));
  var basePath = doc["basePath"]
  var paths = doc['paths']

  for (var path in paths) {
    var expPath = path.replace(new RegExp("{", 'g'), ":");
    expPath = expPath.replace(new RegExp("}", 'g'), "");
    expPath = basePath + expPath
    dtos[expPath] = {}
    for (var method in paths[path]) {
      var bodyParam = paths[path][method].parameters.find(parameter => parameter.in == "body")
      if (bodyParam) {
        var ref = bodyParam.schema.$ref
        if (ref)
          dtos[expPath][method] = ref.split('/')[ref.split('/').length - 1]
        else dtos[expPath][method] = null
      }
      else {
        dtos[expPath][method] = null
      }
    }
  }


  return dtos
}

module.exports = loadDtos
