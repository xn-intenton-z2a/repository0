# License Command

## Overview
Add a --license flag to the CLI that reads the license field from package.json and prints it. This enables users to quickly identify the software license.

## Behavior
- Detect a license boolean option in CLI arguments.
- Read package.json from the repository root and parse its license field.
- If a license string is found:
  - Print the license string to standard output.
  - Exit with code 0.
- If the license field is missing or empty:
  - Print "No license specified in package.json." to standard output.
  - Exit with code 1.
- On file read or JSON parse failure:
  - Print a descriptive error message to standard error.
  - Exit with code 1.

## Implementation Details
- In sandbox/source/main.js, extend minimist options to include license as a boolean flag.
- After existing branches for help, version, mission, and info, add an else if (license) branch that:
  - Uses fs.readFileSync with utf8 encoding to load package.json.
  - Parses JSON to extract the license property.
  - Implements the behavior as specified above.
  - Wraps file operations and parsing in try/catch to handle errors.

## Tests
- Create sandbox/tests/license.test.js with scenarios:
  - Valid License: Mock fs.readFileSync to return JSON with a known license. Invoke main(["--license"]) and assert console.log is called with the license and process.exit(0).
  - Missing License: Mock fs.readFileSync to return JSON without a license field or an empty string. Invoke main(["--license"]) and assert console.log is called with "No license specified in package.json." and process.exit(1).
  - Read Failure: Mock fs.readFileSync to throw an error. Assert console.error with an error message and process.exit(1).

## Documentation
- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include a section for the --license flag:
  - Show usage example:
    npm run start -- --license
  - Describe expected output for both license present and missing cases.

## Compatibility
- No new dependencies required; uses built-in fs module.
- Follows existing CLI structure in sandbox/source/main.js.