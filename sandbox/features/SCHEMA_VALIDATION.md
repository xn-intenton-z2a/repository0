# Schema Validation

## Overview
Add a new CLI command to validate JSON or YAML data files against a JSON Schema. This feature leverages the existing AJV dependency to provide a robust, standards-based validation flow. It solves a common real-world problem of ensuring data conforms to an expected structure before processing.

## CLI Command
When the user runs the CLI with the `--validate <schemaPath> <dataPath>` option:
- Read and parse the schema file from `<schemaPath>`. Support both JSON and YAML schema files.
- Read and parse the data file from `<dataPath>`. Support both JSON and YAML formats.
- Use AJV to compile the schema and validate the data.
- If the data is valid, print “Validation succeeded” and exit with code 0.
- If the data is invalid, print the validation errors in a human-readable format and exit with code 1.

## Implementation Details
- In `sandbox/source/main.js`, extend the minimist configuration to recognize a `validate` flag that expects two positional arguments.
- Use `fs.readFile` to load files, `JSON.parse` for `.json` inputs, `yaml.load` for `.yaml` or `.yml` inputs.
- Instantiate AJV, compile the schema, and run validation.
- Format and output errors if validation fails.

## Testing
- Add a new test file `sandbox/tests/validation.test.js`.
- Include cases for valid JSON data against a matching schema, valid YAML data against a matching schema, and invalid inputs demonstrating error reporting.
- Mock file reads where appropriate, and verify exit codes via a spawnSync integration test.

## Documentation
- Update `sandbox/docs/README.md` and the root `README.md` to document the new `--validate` command, usage examples, and expected outputs.
