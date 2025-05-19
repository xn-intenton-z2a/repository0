# CLI_COMMANDS

# Description
Add a comprehensive command line interface to the existing main script that interprets named flags and positional arguments to deliver help, version, mission, and argument echo behavior.

# Implementation
- Update src/lib/main.js (and sandbox/source/main.js) to import minimist for flag parsing.
- Recognize the following flags:
  * help or h: displays usage instructions.
  * version or v: reads the version field from package.json and prints it.
  * mission: reads the mission statement from MISSION.md and prints it.
- For unrecognized or no flags, echo the provided positional arguments as JSON.
- Use Node fs module for synchronous reads of package.json and MISSION.md.
- Ensure exit codes: zero for normal outputs, non-zero for invalid flag combinations.

# Testing
- Add sandbox/tests/cli_commands.test.js with unit tests for each mode:
  * help output includes list of commands.
  * version output matches package.json version.
  * mission output contains mission statement heading.
  * echo output returns JSON representation of positional args.
- Ensure existing tests still pass and new tests are invoked by npm test.

# Documentation
- Update README.md to include usage examples for each flag.
- Document the CLI commands under a new section titled CLI Usage.