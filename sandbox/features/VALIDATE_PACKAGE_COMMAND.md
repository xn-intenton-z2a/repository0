# Validate Package Command

## Overview

Introduce a new `--validate-package` flag to the CLI to verify that the project's package.json meets a minimal schema. This ensures that critical metadata fields are present and correctly typed, preventing invalid or incomplete package definitions.

## Behavior

- Detect the `--validate-package` flag in CLI arguments after handling `--help`, `--version`, and `--mission`.
- Read `package.json` at the repository root using fs.readFileSync with utf8 encoding.
- Parse the JSON content into an object.
- Define a zod schema requiring:
  - `name`: non-empty string
  - `version`: valid semver string
  - `license`: non-empty string
- Use the schema to parse and validate the object.
- On successful validation, print "package.json is valid" to standard output and exit with code 0.
- On validation failure or file read/parse error, print detailed error messages to standard error and exit with code 1.

## Implementation Details

- In `sandbox/source/main.js`, extend minimist boolean options to include `validatePackage`.
- After existing branches for `--help`, `--version`, and `--mission`, add a new conditional branch for `--validate-package`.
- Import `z` from the zod library.
- In the branch, wrap operations in a try/catch:
  - Load and parse `package.json`.
  - Construct a zod schema:
    - z.object({ name: z.string().min(1), version: z.string().regex(/^[0-9]+\.[0-9]+\.[0-9]+(-.*)?$/), license: z.string().min(1) })
  - Call schema.parse(parsedJson).
  - On success, call console.log with a success message and process.exit(0).
  - On failure, catch ZodError, console.error each issue, and process.exit(1).

## Tests

- Create `sandbox/tests/validate-package.test.js` with tests that:
  - Mock fs.readFileSync to return valid JSON meeting the schema, invoke main with `["--validate-package"]`, and assert that console.log is called with "package.json is valid" and process.exit(0).
  - Mock fs.readFileSync to return JSON missing or invalid fields, invoke main with the flag, and assert that console.error is called with schema errors and process.exit(1).
  - Mock fs.readFileSync to throw an error, invoke main with the flag, and assert console.error and exit with code 1.

## Documentation

- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md` to include a section for the `--validate-package` flag with usage examples and expected outcomes.
- Example:
  npm run start -- --validate-package
  # package.json is valid

## Compatibility

- No new dependencies are required (zod is already included).
- Follows existing CLI structure and flag parsing in `sandbox/source/main.js`.
