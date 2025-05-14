# Scripts Command

## Overview
Add a --scripts flag to the CLI that lists all npm script entries defined in package.json. This helps users discover available automation tasks without inspecting package.json manually.

## Behavior
- Detect a scripts boolean option in CLI arguments after handling help, version, mission, and info flags.
- Resolve the path to package.json in the repository root and load its content.
- Parse the JSON content and extract the scripts section as an object mapping names to commands.
- If the scripts object has entries:
  - For each script name and its command, print a line formatted as scriptName: scriptCommand to standard output.
  - Exit the process with code 0.
- If the scripts object is empty or missing:
  - Print "No scripts defined in package.json." to standard output.
  - Exit with code 0.
- On file read failure or invalid JSON parse:
  - Print a descriptive error message to standard error.
  - Exit with code 1.

## Implementation Details
- In sandbox/source/main.js, extend the minimist options to include scripts as a boolean flag.
- After existing branches for run, audit, outdated, and before the default echo behavior, add an else if block for scripts:
  - Use fs.readFileSync with utf8 encoding to load package.json.
  - Call JSON.parse to extract the scripts object.
  - Iterate over Object.entries(scripts) and call console.log for each entry.
  - If scripts is empty or not an object, console.log the no scripts message.
  - Wrap file read and parse in a try catch to handle errors and call console.error and process.exit(1).

## Tests
- Create sandbox/tests/scripts.test.js with scenarios:
  - Valid scripts: Mock fs.readFileSync to return a JSON string containing a scripts object with multiple entries. Invoke main with ["--scripts"], assert console.log is called once per entry with correct formatting and process.exit(0) is invoked.
  - No scripts defined: Mock fs.readFileSync to return JSON with scripts as an empty object or missing. Invoke main with ["--scripts"], assert console.log is called with the no scripts message and process.exit(0).
  - Read failure: Mock fs.readFileSync to throw an error. Invoke main with ["--scripts"], assert console.error is called with an error message and process.exit(1).
  - Invalid JSON: Mock fs.readFileSync to return invalid JSON. Invoke main with ["--scripts"], assert console.error and process.exit(1).
- Use Vitest spies for fs.readFileSync, console.log, console.error, and process.exit.

## Documentation
- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include a section for the --scripts flag:
  - Show usage example: npm run start -- --scripts
  - Include sample output listing scriptName: scriptCommand or the no scripts message.