# Overview

Extend the core CLI to provide built-in commands for help, version, mission, and argument echo. Users can invoke standardized commands rather than only raw argument echoes.

# Commands

- help: Display usage instructions and list available commands.
- version: Print the current package version from package.json.
- mission: Read and output the contents of MISSION.md.
- echo: Default behavior: echo back provided arguments as JSON.

# Implementation

Replace the main function in sandbox/source/main.js to:

1. Parse arguments using minimist.
2. If --help or help subcommand is present, print usage and exit.
3. If --version or version subcommand is present, read package.json and print version.
4. If mission subcommand is present, read MISSION.md file and output its content.
5. Otherwise, echo all leftover arguments as a JSON string.

Ensure synchronous file reads for simplicity and that errors are handled gracefully with user-friendly messages.

# Tests

Add new unit tests in sandbox/tests/cli-commands.test.js covering:

- help command prints usage and exits without error.
- version command prints matching package.json version.
- mission command prints mission content beginning with the mission heading.
- default invocation echoes args correctly.

Use vitest and mock filesystem reads and console.log calls.

# Documentation

Update README.md:

- Document each command with usage examples.
- Show sample outputs for help, version, mission, and echo.
- Link to MISSION.md in the mission example.

Update package.json if necessary to include any required dependencies.
