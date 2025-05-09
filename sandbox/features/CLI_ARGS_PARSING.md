# Overview

Implement advanced command-line argument parsing for the main CLI tool using the existing minimist dependency. This feature will allow users to supply flags and positional arguments to control behavior, such as requesting help text, printing version information, or computing simple operations on numeric inputs.

# Usage

Users can invoke the CLI with:

  npm run start -- --help
  npm run start -- --version
  npm run start -- --sum 1 2 3 4
  npm run start -- greet Alice

# Behavior

- --help: Print usage instructions and list available flags and commands. Exit without error.
- --version: Read the version value from package.json and print it. Exit without error.
- --sum: Treat subsequent positional arguments as numbers, compute their sum, and print the result. If any value is non-numeric, print an error and exit with non-zero code.
- greet <name>: If first argument is the word greet, treat the next positional argument as a name and print a greeting message.
- Default: If no flags or commands are provided, fall back to the existing behavior of printing the raw argument array.

# Implementation

- Update src/lib/main.js to import minimist and parse process.argv.
- Add helper functions for each command and flag in the same file.
- Update package.json start script if necessary to forward CLI flags.

# Tests

- Add unit tests in tests/unit/main.test.js for each command and flag:
  - Help output contains the flags and commands.
  - Version output matches package.json version.
  - Sum operation on valid numbers returns correct total.
  - Sum operation with invalid input fails.
  - Greeting command prints correct message.

Ensure all new behavior is covered by tests and documented in the README under a new "CLI Usage" section.