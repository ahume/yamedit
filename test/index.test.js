var assert = require('assert');
var fs = require('fs');
var path = require('path');

var ym = require('../src/index.js');

function getFixture(name) {
  return fs.readFileSync(path.join(__dirname, '../test/fixtures/' + name)).toString();
}

function getExpectedResult(name) {
  return fs.readFileSync(path.join(__dirname, '../test/fixtures/expected/' + name)).toString();
}

describe('yaml-edit', () => {
  describe('get', () => {
    it('returns value at path', () => {
      var yaml = getFixture('test.yaml');
      assert.equal(ym.get(yaml, 'test.yaml.structure'), 'value');
    });

    it('returns value from array', () => {
      var yaml = getFixture('test-array.yaml');
      assert.equal(ym.get(yaml, 'test.yaml[1]'), 'value');
    });

    it('returns value from deeper in array', () => {
      var yaml = getFixture('test-array.yaml');
      assert.equal(ym.get(yaml, 'test.yaml[2].structure'), 'value');
    });
  });

  describe('edit', () => {
    it('modifies value at path', () => {
      var yaml = getFixture('test.yaml');
      var expected = getExpectedResult('test.yaml');
      assert.equal(ym.edit(yaml, 'test.other.structure', 'value2'), expected);
    });

    it('modifies value in array', () => {
      var yaml = getFixture('test-array.yaml');
      var expected = getExpectedResult('test-array.yaml');
      assert.equal(ym.edit(yaml, 'test.another[1]', 'value2'), expected);
    });

    it('modifies value from deeper in array', () => {
      var yaml = getFixture('test-array.yaml');
      var expected = getExpectedResult('test-deeper-array.yaml');
      assert.equal(ym.edit(yaml, 'test.yaml[2].other.structure', 'value2'), expected);
    });

    it('edits value with duplicate key:value pairing', () => {
      var yaml = getFixture('test.yaml');
      var expected = getExpectedResult('test-dupe.yaml');
      var newYAML = ym.edit(yaml, 'test.yaml.structure', 'value2');
      newYAML = ym.edit(newYAML, 'test.other.structure', 'value3');
    });
  });
});
