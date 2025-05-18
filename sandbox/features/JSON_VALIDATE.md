# JSON Validation

## CLI Behavior

Introduce a new top-level command validate to verify the syntax of a JSON file and optionally validate it against a JSON schema.

Usage:

npm run start -- validate <jsonFile> [--schema <schemaFile>] [--output <file>]

- `<jsonFile>`: Path to the JSON file to check.
- `--schema <schemaFile>`: Optional path to a JSON schema file (Draft 07) to use for validation.
- `--output <file>`: Optional path to write the formatted output or error report; defaults to stdout.

Behavior:
- Read and parse the JSON file; on parse error print a descriptive message and exit code 1.
- If a schema file is provided, read and parse the schema, then use AJV to validate the JSON data.
- If validation fails, print each error with the data path and message, then exit with code 1.
- If validation succeeds or if only syntax checking, print a success message or write it to the output file.

## Implementation

- **sandbox/source/main.js**: import Ajv from ajv, add a case "validate" in the CLI switch to call async function doValidateCommand(argv).
- Implement async function doValidateCommand(argv):
  - Validate presence of argv._[1]; on missing file exit with code 1.
  - Read the JSON file and JSON.parse it inside try/catch.
  - If argv.schema is provided, read and JSON.parse the schema, instantiate Ajv, compile and validate the data.
  - Collect errors if any and format them as one per line with data path and error message.
  - Handle `--output` by writing the report or success message to a file or console.
  - On I/O or JSON errors, print descriptive message and exit with code 1.

## Testing

- **sandbox/tests/validate.test.js**:
  - Test syntax alone: valid JSON returns success, invalid JSON returns parse error and exit 1.
  - Test schema validation: valid data passes, invalid data fails with detailed error messages.
  - Test missing file path prints usage error and exit code 1.
  - Test `--output` writes report to specified file.

## Documentation

- **README.md** and **sandbox/docs/CLI_USAGE.md**: add a section for the validate command, document usage, flags, and examples.