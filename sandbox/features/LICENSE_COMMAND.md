# License Command

## Overview
When invoked with the --license flag, the CLI prints the repository's license information as defined in package.json, allowing users to quickly identify the licensing without inspecting the file manually.

## Behavior

- Detect the --license flag in the CLI arguments after handling help, version, mission, env, scripts, info, and deps flags.
- Read package.json at the repository root using fs.readFileSync with utf8 encoding.
- Parse the JSON content to extract the "license" property.
- Print the license string to standard output.
- Exit the process with code 0 on success.
- If reading or parsing fails or the license field is missing, print a descriptive error message to standard error and exit with code 1.

## Implementation Details

- In sandbox/source/main.js, extend minimist boolean options to include "license".
- After the existing conditional branches for deps, insert a new branch for the --license flag.
- Use fs.readFileSync to load package.json and JSON.parse to extract the license field.
- Wrap file operations and parsing in a try/catch block to handle errors gracefully.
- On success, call console.log with the license string and process.exit(0).
- On failure or missing license field, call console.error with a descriptive message and process.exit(1).

## Tests

- Create sandbox/tests/license.test.js with tests that:
  - Mock fs.readFileSync to return valid package.json content containing a known license. Invoke main with ["--license"] and assert that console.log is called with the license string and process.exit(0).
  - Mock fs.readFileSync to throw an error or return JSON without a license property. Invoke main with ["--license"] and assert that console.error is called with a descriptive message and process.exit(1).

## Documentation

- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include a section for the --license flag.
- Provide example usage:
  npm run start -- --license
- Show sample output of the license string.

## Compatibility

- No new dependencies are required.
- Aligns with the existing CLI structure in sandbox/source/main.js and uses minimist for flag parsing.