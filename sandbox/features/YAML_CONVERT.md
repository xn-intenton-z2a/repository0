# YAML Conversion

## CLI Behavior

The new command yaml accepts an input file path and converts data between YAML and JSON formats. By default it converts YAML to JSON. Use the --to-yaml flag to convert JSON to YAML instead. The command writes the result to stdout or to a file when an --output flag is provided.

Usage:
 npm run start -- yaml <inputFile> [--to-yaml] [--output <outputFile>]

## File Modifications

- sandbox/source/main.js: import js-yaml and add a yaml case in the CLI switch. Read the input file with fs/promises, detect conversion direction using the --to-yaml flag, parse the content with js-yaml when converting to JSON or with JSON.parse when converting to YAML, perform the conversion, and handle the --output flag to write the result to disk when provided.
- sandbox/tests/yaml.test.js: add a feature-level test that creates temporary YAML and JSON files, invokes node sandbox/source/main.js yaml for both conversion directions, and asserts that the output matches the expected JSON or YAML content. Also verify that the --output option creates the file with correct contents.
- README.md: update the CLI Usage section to document the yaml command with examples for both conversion directions and the --output flag.
- package.json: verify that js-yaml is listed as a dependency (no change required if already present).

## Testing

Add tests to verify:

- Converting a YAML file produces valid JSON with matching data structures.
- Converting a JSON file with --to-yaml produces valid YAML syntax reflecting the original data.
- The --output option writes the converted result to the specified file path.