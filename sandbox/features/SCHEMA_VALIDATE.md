# Schema Validate Command

This feature introduces a new CLI command to validate JSON or YAML data files against a JSON Schema and report validation results.

## Overview

The CLI will support a `--validate <schemaPath> <dataPath>` option (alias `-v`) that:

1. Reads a JSON Schema file (JSON or YAML).
2. Reads a data file (JSON or YAML).
3. Uses Ajv to compile the schema and validate the data.
4. Prints “Validation successful” and exits with status 0 when data conforms to schema.
5. Prints validation errors (one per line) and exits with status 1 when data does not conform.

## Implementation Details

- Extend `minimist` setup to recognize `validate` (string array) and alias `v`.
- In `main()`, after other commands, detect `args.validate` and call a new `validateSchema` handler.
- `validateSchema(schemaPath, dataPath)` should:
  - Read both files with `fs.promises.readFile`.
  - Parse content as JSON if extension `.json`, or YAML otherwise using `js-yaml`.
  - Initialize Ajv from the `ajv` dependency to compile the schema.
  - Validate the data; on success, log “Validation successful” and exit(0).
  - On failure, for each `error` in `ajv.errors`, log `${error.instancePath}: ${error.message}` and exit(1).

## Testing

- Create tests in `sandbox/tests/validate.test.js` covering:
  - Valid JSON data against JSON schema.
  - Invalid JSON data against schema with missing required fields.
  - YAML schema and data inputs.
  - Exit codes and console output.

## Documentation

- Update `sandbox/docs/README.md` to include the new command:
  - `--validate <schema> <data>`  Validate data file against JSON Schema.
  - `-v <schema> <data>` alias.
  - Examples with JSON and YAML files.

