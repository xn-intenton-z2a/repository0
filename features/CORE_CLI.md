# CORE CLI Feature Update

## Overview
This feature updates the CLI functionality by adding a new command, update, to the core command set. When the user invokes the CLI with the update command, the program will immediately output "No update available" and exit. This change ensures that all intended CLI commands are available and that the repository meets its mission of providing handy CLI utilities.

## Source Code Changes
- In the source file (src/lib/main.js), add a new condition in the main function. When the command is "update", log "No update available" and exit without further processing.

## Testing
- Update the tests in tests/unit/main.test.js to include a new test case for the update command. The test should invoke the update command and verify that the exact output is "No update available".

## Documentation
- Update the CLI commands documentation in README.md and docs/USAGE.md to include the update command. The documentation should show the usage (e.g. via npm script check-update or node src/lib/main.js update) and the expected output.

## Dependencies and Scripts
- In package.json, ensure that the script check-update remains mapped to "node src/lib/main.js update" so that users can conveniently invoke the update command.

This update consolidates the CLI by ensuring that all commands (version, diagnostics, help, and update) are properly implemented and tested, in line with the repository mission and contributor guidelines.