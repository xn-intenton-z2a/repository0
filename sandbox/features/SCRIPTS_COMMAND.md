# Script List Command

## Overview
Add a --scripts flag to the CLI that lists all npm scripts defined in package.json. This enables users to quickly inspect available automation tasks and shortcuts without opening the package file.

## Behavior
- Detect a scripts boolean option in CLI arguments after handling other flags.
- Read package.json from the repository root and parse the scripts field.
- If the scripts object has entries:
  - For each script name and its command, print a line in the format:
    scriptName: scriptCommand
  - Exit with code 0.
- If the scripts field is missing or empty:
  - Print "No npm scripts defined." to standard output.
  - Exit with code 0.
- On file read or JSON parse failure:
  - Print an error message to standard error beginning with "Error reading scripts from package.json:" followed by the error message.
  - Exit with code 1.

## Implementation Details
- In sandbox/source/main.js, extend minimist options to include scripts as a boolean flag.
- After existing branches (help, version, mission, license), add an else if (scripts) branch that:
  - Uses fs.readFileSync with utf8 encoding to load package.json.
  - Parses the JSON to extract the scripts object.
  - Implements the behavior described above.
  - Wraps file operations and parsing in try/catch for error handling.

## Tests
- Create sandbox/tests/scripts.test.js with scenarios:
  - **With Scripts Defined:** Mock fs.readFileSync to return JSON with a scripts object containing multiple entries. Invoke main(["--scripts"]) and assert console.log is called once per script with the correct "name: command" format and process.exit(0).
  - **No Scripts Defined:** Mock fs.readFileSync to return JSON without a scripts field or empty object. Invoke main(["--scripts"]) and assert console.log is called with "No npm scripts defined." and process.exit(0).
  - **Read/Parse Failure:** Mock fs.readFileSync to throw an error. Assert console.error is called with a message starting "Error reading scripts from package.json:" and process.exit(1).

## Documentation
- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include a section for the --scripts flag:
  - Show usage example:
    npm run start -- --scripts
  - Describe example outputs for both defined and missing scripts cases.