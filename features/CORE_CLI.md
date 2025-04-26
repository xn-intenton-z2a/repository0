# CORE CLI Feature Update

## Overview
This update expands the existing CLI commands by officially integrating the update command. In addition to the current commands (version, diagnostics, help), users can now invoke the update command which will output "No update available". This enhancement not only ensures that the CLI remains consistent and informative but also fulfills the repository template’s mission to provide handy CLI utilities in a single source file.

## Source Code Changes
- Modify src/lib/main.js to add a new condition: if the first argument is update, the program should output "No update available" and exit. The structure should mirror the existing conditions for version and diagnostics.

## Testing
- Enhance tests in tests/unit/main.test.js by adding a new test case for the update command. The test should invoke main(["update"]) and verify that the output is exactly "No update available". This ensures the new command is functional and behaves as expected.

## Documentation
- Update the README.md and docs/USAGE.md files to document the new update command. Include usage examples such as:
  - Running via npm script: npm run check-update
  - Running from command line: node src/lib/main.js update
- Mention that the expected output is "No update available" to guide the user.

## Dependencies and Scripts
- Confirm that package.json includes the check-update script mapping to "node src/lib/main.js update". No dependency updates are required since this is a CLI functionality enhancement.

## Summary
This update consolidates the CLI functionality by integrating the update command. It addresses a clear user need to verify update status and maintains consistency with the repository’s design philosophy of providing a simple, effective CLI interface. All changes are contained within the permitted files: the source file, the test file, the README, and the dependencies file.