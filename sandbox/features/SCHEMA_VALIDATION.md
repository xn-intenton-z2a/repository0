# SCHEMA_VALIDATION

## Overview
This feature adds a CLI option to validate JSON or YAML data files against a JSON Schema definition using AJV. It enables users to ensure data correctness before processing or rendering.

## Specification

### New CLI Option
Introduce a CLI option `--validate` (alias `-V`) that accepts two positional arguments: `dataPath` and `schemaPath`.

### Data Loading
- Read and parse the data file at `dataPath`. If the filename ends with `.json`, parse as JSON. If it ends with `.yaml` or `.yml`, parse using `js-yaml`. Otherwise attempt JSON parsing.
- Read and parse the schema file at `schemaPath` as JSON.

### Validation Process
- Use AJV to compile the JSON Schema and validate the parsed data.

### Output
- If validation succeeds, print "Validation successful" to stdout and exit with code 0.
- If validation fails, print a JSON-formatted list of validation errors to stderr and exit with code 1.

### Error Handling
- If required arguments are missing, print an error message indicating usage and exit with code 1.
- If data or schema files cannot be read or parsed, print the error message and exit with code 1.

### Tests
- Add `sandbox/tests/validate.test.js` covering:
  - Successful validation of valid JSON data against schema.
  - Validation failures with invalid data reporting correct errors.
  - Validation of YAML data input.
  - Alias `-V` works identically to `--validate`.
