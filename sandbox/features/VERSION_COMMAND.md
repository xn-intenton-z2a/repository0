# Version Command

## Overview
When invoked with the `--version` flag, the CLI prints the package version from `package.json` and exits with code 0. This enables users to quickly identify the installed tool version.

## Behavior
- Detect the `--version` flag in the CLI arguments.
- Read `package.json` at the repository root.
- Parse the `version` field from its JSON content.
- Print the version string to standard output.
- Exit the process with code 0 on success.
- If reading or parsing fails, print an error message to standard error and exit with code 1.

## Implementation Details
- In `sandbox/source/main.js`, after handling `--help`, check for `--version`.
- Use `fs.readFileSync` with `utf8` encoding to load `package.json`.
- Use `JSON.parse` to parse the JSON content and extract the `version` property.
- Wrap file operations and parsing in a `try/catch` block to catch and handle errors.
- On success, call `console.log` with the version string and `process.exit(0)`.
- On failure, call `console.error` with a descriptive message and `process.exit(1)`.

## Tests
- Create `sandbox/tests/version.test.js` with tests that:
  - Mock `fs.readFileSync` to return valid JSON containing a known version, invoke `main` with `["--version"]`, and assert that `console.log` is called with that version and `process.exit(0)`.
  - Mock `fs.readFileSync` to throw an error or return invalid JSON, invoke `main` with `["--version"]`, and assert that `console.error` is called with an appropriate message and `process.exit(1)`.

## Documentation
- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md` to include a section for the `--version` flag.
- Provide a usage example:
  - `npm run start -- --version`
  - Show example output of a version string.

## Compatibility
- Follows existing CLI structure in `sandbox/source/main.js`.
- No new dependencies are required.
