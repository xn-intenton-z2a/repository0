# Deps Command

## Overview
When invoked with the --deps flag, the CLI prints the project dependencies and devDependencies defined in package.json as a formatted JSON object. This enables users to quickly review all installed modules and their versions without opening package.json manually.

## Behavior

- Detect the --deps flag in the CLI arguments after handling --help, --version, --mission, --env, --scripts, and --info flags.
- Read package.json at the repository root using fs.readFileSync with utf8 encoding.
- Parse the JSON content to extract the "dependencies" and "devDependencies" properties.
- Construct an object with keys "dependencies" and "devDependencies", each mapping to their respective objects (or empty object if undefined).
- Print the JSON representation of this object to standard output with two-space indentation.
- Exit the process with code 0 on success.
- If reading or parsing fails, print a descriptive error message to standard error and exit with code 1.

## Implementation Details

- In sandbox/source/main.js, extend the minimist boolean options to include "deps".
- After existing branches for help, version, mission, env, scripts, and info, insert a new conditional branch for --deps.
- Use fs.readFileSync to load package.json and JSON.parse to extract the desired fields.
- Wrap file operations and parsing in a try/catch block to handle errors gracefully.
- On success, call console.log with JSON.stringify(depsObject, null, 2) and process.exit(0).
- On failure, call console.error with a descriptive message and process.exit(1).

## Tests

- Create sandbox/tests/deps.test.js with tests that:
  - Mock fs.readFileSync to return valid package.json content containing known dependencies and devDependencies. Invoke main with ["--deps"] and assert that console.log is called with the expected formatted JSON and process.exit(0).
  - Mock fs.readFileSync to throw an error or return invalid JSON. Invoke main with ["--deps"] and assert that console.error is called with an appropriate message and process.exit(1).

## Documentation

- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include a section for the --deps flag.
- Provide example usage:
  npm run start -- --deps
- Show sample JSON output listing dependencies and devDependencies.

## Compatibility

- No new dependencies required.
- Follows the existing CLI structure in sandbox/source/main.js.
- Aligns with the mission of providing introspection commands for the repository.