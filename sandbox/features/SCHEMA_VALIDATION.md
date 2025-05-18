# Schema Validation

## Purpose
Provide a command-line option to validate JSON or YAML data files against a JSON Schema, helping users ensure configuration or data files conform to expected structure.

## CLI Option
--validate <schemaPath> <dataPath>

- Accepts two positional arguments:
  1. schemaPath: Path to a JSON Schema file (.json).
  2. dataPath: Path to a JSON or YAML data file to be validated.
- Outputs "Validation succeeded" when data conforms to the schema.
- On validation errors, prints an array of error objects to stderr and exits with code 1.

## Source Changes
In sandbox/source/main.js:
- Import Ajv from "ajv" and, if desired, type definitions from "zod" (optional).
- Detect args.validate in minimist configuration.
- Resolve schemaPath and dataPath via path.resolve.
- Read schema file and parse JSON.
- Read data file and parse JSON or YAML based on extension.
- Create Ajv instance, compile the schema, and validate the data.
- If validation passes, console.log("Validation succeeded"); otherwise, console.error(errors) and process.exit(1).

## Tests
- Add sandbox/tests/validate.test.js covering:
  - Success case: validate a simple schema against valid data.
  - Failure case: validate the same schema against invalid data and assert process.exit(1) and appropriate error output.
- Use a fixture folder sandbox/tests/fixtures/schema.json, valid.json, invalid.json and invalid.yaml.

## Documentation
- Update sandbox/docs/README.md and top-level README.md to document the new --validate option with example usage:
  npm run start -- --validate fixtures/schema.json fixtures/data.yaml
- Show example output on success and on failure.

## Dependencies
- Ensure "ajv" remains listed under dependencies in package.json (it is already present).
- No additional dependencies required.
