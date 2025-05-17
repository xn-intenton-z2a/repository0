# CLI Commands

## Overview
The CLI entrypoint supports core commands that showcase agentic workflow capabilities and provide basic utility functions directly from the terminal.

## Commands

### help
Displays usage instructions and a summary of available commands.

### mission
Reads and prints the mission statement from MISSION.md to highlight the repository intent.

### version
Reads and prints the version field from package.json to show the current package version.

### echo
Prints any additional arguments passed after the echo command, demonstrating argument handling.

## Implementation Details

- Modify sandbox/source/main.js to:
  - Parse process.argv using minimist.
  - Implement a dispatch function that maps commands to handlers.
  - Use fs/promises to read MISSION.md and package.json for mission and version commands.
  - Default to help output when an unknown command is provided.

- Update package.json scripts:
  - Ensure "start" script accepts command arguments.

## Testing

- Create or update sandbox/tests/cli.test.js to cover:
  - help: asserts help text contains list of commands.
  - mission: mocks fs reading to return a dummy mission and asserts output.
  - version: mocks package.json data and asserts correct version is printed.
  - echo: asserts that provided arguments are concatenated and printed.
  - unknown command: asserts that help text is printed.

## Documentation

- Update README.md:
  - Add a "Commands" section under Usage that lists help, mission, version, and echo with examples.
  - Include examples for running each command via npm run start.

- No additional dependencies are required beyond minimist and built-in fs.