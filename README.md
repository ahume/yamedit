# yamedit

`yamedit` tries to solve the problem of modifying human maintained YAML files in a clean and safe way. It preserves the structure/layout of the existing YAML string, as well as any comments in the file.

It is not a fully-fledged YAML parser/writer, and only deals with updating values for *existing* fields in a YAML file. It cannot add new fields or new sub-trees to the data structure.

## Example

```
const fs = require('fs');
const yamedit = require('yamedit');

const yaml = fs.readFileSync('config.yaml');

const newYAML = yamedit.edit(yaml, 'path.to[3].field', 'newValue');

fs.writeFileSync('config.yaml');
```
