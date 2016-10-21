var _ = require('./lib/lodash.custom');
var jsyaml = require('js-yaml');

function get (YAML, path) {
  if (typeof YAML !== 'string' || typeof path !== 'string') {
    throw new Error('function takes two string args. The yaml string and a path string.')
  }
  return _.get(jsyaml.load(YAML), path);
};

function edit (YAML, path, newValue) {
  var currentValue = get(YAML, path);
  if (!currentValue) {
    throw new Error(
      'The requested path can\'t be edited because it does not have an existing value.');
  }

  var pathArr = _.castPath(path);
  var finalProp = pathArr[pathArr.length - 1];

  var matchToken = 'matchToken' + Math.random().toString(36);
  var matchIndex = 0;

  var reMatchAllKeyValuePairs = new RegExp(finalProp + ' *: *' + currentValue, 'g');
  var reMatchAllKeyTokenPairs = new RegExp(finalProp + ' *: *' + matchToken + '\\d+', 'gm');

  var targetIsArrayMember = Array.isArray(_.get(jsyaml.load(YAML), pathArr.slice(0, -1)));

  if (targetIsArrayMember) {
    // TODO: Deal with multiple duplicate values.
    return YAML.replace(new RegExp('- *' + currentValue),  '- ' + newValue);
  }

  tokenisedYAML = YAML.replace(reMatchAllKeyValuePairs, function () {
    return finalProp + ': ' + matchToken + matchIndex++;
  });

  var reMatchTargetKeyToken = new RegExp(finalProp + ' *: *' + get(tokenisedYAML, path));

  return tokenisedYAML
    // Switch matching token to the new value
    .replace(reMatchTargetKeyToken, finalProp + ': ' + newValue)
    // Switch all remaining matchTokens back to their original values
    .replace(reMatchAllKeyTokenPairs, finalProp + ': ' + currentValue);
}

module.exports = {
  get: get,
  edit: edit
};
