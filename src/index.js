var _ = require('./lib/lodash.custom');
var jsyaml = require('js-yaml');

function get (YAML, path) {
  if (typeof YAML !== 'string' || typeof path !== 'string') {
    throw new Error('get() takes two string args. The yaml string and a path string.')
  }
  return _.get(jsyaml.load(YAML), path);
};

function edit (YAML, path, newValue) {
  if (typeof YAML !== 'string' || typeof path !== 'string') {
    throw new Error('edit() takes two string args. The yaml string and a path string.')
  }

  var currentValue = get(YAML, path);
  if (!currentValue) {
    throw new Error(
      'The requested path can\'t be edited because it does not have an existing value.');
  }

  var pathArr = _.castPath(path);
  var finalProp = pathArr[pathArr.length - 1];

  // If finalProp is a number, then check if it was an index
  if (!isNaN(finalProp)) {
    var l = finalProp.length + 2;
    var finalPropIsArrayIndex = (path.slice(-l) === '[' + finalProp + ']');
  }

  var re;

  if (finalPropIsArrayIndex) {
    re = new RegExp('- *' + currentValue);
    return YAML.replace(re,  '- ' + newValue);
  }

  re = new RegExp(finalProp + ' *: *' + currentValue, 'g');

  var matchToken = 'matchToken' + Math.random().toString(36);
  var matchCount = 0;

  tokenisedYAML = YAML.replace(re, function (match, p1, offset) {
    return finalProp + ': ' + matchToken + matchCount++;
  });

  // Find token that matches original path.
  var tokenisedValue = get(tokenisedYAML, path);

  // Update tokenisedValue to the newValue
  re = new RegExp(finalProp + ' *: *' + tokenisedValue);
  tokenisedYAML = tokenisedYAML.replace(re, finalProp + ': ' + newValue);

  // Switch all remaining matchTokens back to their original values.
  re = new RegExp(finalProp + ' *: *' + matchToken + '\\d+', 'gm')
  var finalYAML = tokenisedYAML.replace(re, finalProp + ': ' + currentValue);

  return finalYAML;

}

module.exports = {
  get: get,
  edit: edit
};
