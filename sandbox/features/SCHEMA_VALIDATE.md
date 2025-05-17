# Schema Validation

## CLI Behavior

The new command validate accepts a schema module file and a JSON data file. It dynamically imports the schema from the schema file which must export a Zod schema as default. It reads the JSON file, parses it, and validates against the schema. On successful validation it prints Valid JSON data and if an --output flag is provided writes the validated JSON to the specified file. On validation failure it prints detailed error messages and exits with a non zero status code.

Usage:
  npm run start -- validate <schemaFile> <dataFile> [--output <outputFile>]

Examples:
  npm run start -- validate mySchema.js input.json
  npm run start -- validate mySchema.js input.json --output result.json

## File Modifications

- sandbox/source/main.js: add a validate case in the CLI switch. Use dynamic import to load the schema, read the JSON data file with fs slash promises, call schema dot parse on the parsed object, handle success and error, and process the --output flag to write the result when provided.
- sandbox/tests/validate.test.js: add feature level tests that create a temporary schema file exporting a Zod schema for a simple object, create valid and invalid JSON files, invoke node sandbox slash source slash main.js validate and assert that valid input prints a success message and writes output, and invalid input prints error messages and exits with non zero code.
- README.md: update the CLI Usage section to document the validate command with examples.
- package.json: ensure that zod is listed as a dependency (no change required if already present).

## Testing

Add tests to verify:
- valid JSON input passes validation and prints a success message
- the --output flag writes the validated JSON to the specified file
- invalid JSON input produces a list of error messages and exits with a non zero status code