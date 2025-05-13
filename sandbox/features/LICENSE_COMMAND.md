# License Command

## Overview
Add a new --license flag to the CLI to print the license field from package.json directly to the terminal.

## Behavior
- Detect the --license flag in the CLI arguments after handling existing flags.
- Read package.json at the repository root and parse the license property.
- Print the license string to standard output and exit with code 0 on success.
- If reading files or parsing fails, or if the license field is missing, print an error message to standard error and exit with code 1.

## Implementation Details
- In sandbox/source/main.js extend minimist boolean options to include "license".
- After existing branches for help, version, mission, env, scripts, info, and deps, insert a new branch for --license.
- Use fs.readFileSync with utf8 encoding to load package.json and JSON.parse to extract license.
- On success call console.log with the license string and process.exit(0).
- On failure catch errors, call console.error with a descriptive message and process.exit(1).

## Tests
- Create sandbox/tests/license.test.js with tests that mock fs.readFileSync to return valid package.json content containing a known license, invoke main with ["--license"], and assert that console.log is called with that license and process.exit(0).
- Mock fs.readFileSync to throw an error or return JSON without a license field; invoke main with ["--license"] and assert that console.error is called with an appropriate message and process.exit(1).

## Documentation
- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include a section for the --license flag.
- Provide example usage:
 npm run start -- --license
- Show example output of the license identifier.

## Compatibility
- No new dependencies required.
- Follows the existing CLI structure in sandbox/source/main.js.