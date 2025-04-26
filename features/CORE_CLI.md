# CORE CLI Feature Update

## Overview
This update expands the CLI functionality by integrating an update command. In addition to the existing commands - version, diagnostics, and help - users can now invoke the update command. When executed, the command outputs a message stating "No update available." This change enhances core CLI capabilities and aligns with the repository template mission to provide handy, self-contained CLI utilities.

## Source Code Changes
- Modify src/lib/main.js to add a new condition: if the first argument is update, the program should output "No update available" and exit. The new condition should mirror the structure of the existing commands while ensuring consistency in output formatting.

## Testing
- Enhance tests in tests/unit/main.test.js by adding a new test case for the update command. The test should call main(["update"]) and verify that the output is exactly "No update available". This ensures that the new command is functional and meets the expected behavior.

## Documentation
- Update the README.md file and any related usage documentation (such as docs/USAGE.md) to include information about the update command. The documentation should explain:
  - Usage via the npm script: npm run check-update
  - Usage via the CLI: node src/lib/main.js update
  - The expected output: "No update available"

## Dependencies and Scripts
- Confirm that the package.json file includes the check-update script mapping to "node src/lib/main.js update". No dependency changes are required.

## Summary
This update consolidates the CLI functionality by adding support for an update command. It directly addresses a user need for verifying update status and keeps the CLI interface simple, effective, and consistent with the repository template's core mission.