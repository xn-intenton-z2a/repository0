# Scripts Command

## Overview
When invoked with the --scripts flag, the CLI reads the list of npm scripts defined in package.json and prints them in a formatted JSON object. This enables users to quickly discover available commands without opening package.json manually.

## Behavior
- Detect the --scripts flag in the CLI arguments after handling --help, --mission, and --version flags.
- Read package.json at the repository root using fs.readFileSync with utf8 encoding.
- Parse the JSON content to extract the "scripts" property (an object mapping script names to commands).
- If the "scripts" field exists, print its JSON representation to standard output with two-space indentation.
- Exit the process with code 0 on success.
- If reading or parsing fails or if the scripts field is missing, print a descriptive error message to standard error and exit with code 1.

## Implementation Details
- In sandbox/source/main.js, extend the minimist boolean options to include "scripts".
- After existing branches for help, version, and mission, insert a new conditional branch for scripts.
- Use fs.readFileSync to load package.json and JSON.parse to extract scripts.
- Wrap file operations and parsing in a try/catch block to handle errors gracefully.
- On success, call console.log with JSON.stringify(scriptsObject, null, 2) and process.exit(0).
- On failure, call console.error with an error description and process.exit(1).

## Tests
- Create sandbox/tests/scripts.test.js with tests that:
  - Mock fs.readFileSync to return valid package.json content with a known scripts object; invoke main with ["--scripts"]; assert console.log is called with the expected formatted JSON string and process.exit(0).
  - Mock fs.readFileSync to throw an error or return JSON without a scripts field; invoke main with ["--scripts"]; assert console.error is called with a descriptive message and process.exit(1).

## Documentation
- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include a section for the --scripts flag.
- Provide an example usage: npm run start -- --scripts and sample JSON output showing script names and commands.

## Compatibility
- Follows the existing CLI structure in sandbox/source/main.js.
- No new dependencies required.