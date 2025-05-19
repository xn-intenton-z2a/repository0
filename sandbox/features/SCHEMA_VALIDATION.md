# Schema Validation Feature

## Overview
Provide a new CLI command to validate JSON or YAML data files against a user-supplied JSON Schema. This helps users catch errors in configuration or data inputs before they are used in rendering or further processing.

## CLI Usage
- `--validate <dataPath> <schemaPath>`
  - `dataPath`: Path to a JSON or YAML file containing the data to validate.
  - `schemaPath`: Path to a JSON Schema file (typically with a .json or .schema.json extension).

## Behavior
1. Parse and normalize file paths from command-line arguments.
2. Read and parse the data file:
   - If the file ends with .json, parse with `JSON.parse`.
   - If the file ends with .yaml or .yml, parse with `js-yaml`.
3. Read and parse the schema file with `JSON.parse`.
4. Use AJV to compile the schema and validate the data.
5. On successful validation:
   - Print `Validation successful` to stdout.
   - Exit with code 0.
6. On validation errors:
   - Print each error message to stderr.
   - Exit with code 1.

## Implementation
- Update `sandbox/source/main.js`:
  - Add a new boolean option `validate` in the minimist configuration.
  - In the main switch, handle `args.validate` before other commands.
  - Import and configure AJV.
  - Implement file reading, parsing, validation logic, and exit codes.

## Tests
- Create `sandbox/tests/validate.test.js`:
  - Test valid JSON data against a simple schema (expect stdout and exit code 0).
  - Test invalid JSON data (missing required property) and verify errors and exit code 1.
  - Test YAML input with the same schema.
  - Test missing arguments or parse errors (exit code and error messages).

## Documentation
- Update `sandbox/docs/README.md`:
  - Document the new `--validate` command under the Commands section.
  - Provide usage examples with both JSON and YAML data files.
  - Show sample schema and corresponding output for success and failure cases.

## Compatibility
- Reuses existing dependencies (`ajv`, `js-yaml`).
- Adheres to ESM module style and Node 20 compatibility.
- Follows existing CLI patterns (minimist, exit codes).
