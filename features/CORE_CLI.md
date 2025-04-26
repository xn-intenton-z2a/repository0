# CORE CLI Feature Update

## Overview
This update enhances the core CLI functionality by officially integrating the update command into the CLI command set. In addition to the existing commands (version, diagnostics, help), users can now invoke the update command to receive a definitive message. This change aligns with the repository mission to provide handy CLI utilities in a single source file.

## Source Code Changes
- Update src/lib/main.js to add a new condition: when the command is update, the program should log "No update available" and exit without performing any further actions. This update should be structured similarly to the existing version and diagnostics commands.

## Testing
- Enhance tests in tests/unit/main.test.js by adding a new test case. The test will invoke the update command and verify that the exact output is "No update available". This ensures that the update command is functional and behaves as expected.

## Documentation
- Update README.md and docs/USAGE.md to include the new update command. The documentation should detail that users can now run the update command (for instance, via npm script check-update or by running node src/lib/main.js update) and that the expected output is "No update available".

## Dependencies and Scripts
- Confirm that package.json maintains the script mapping for check-update to "node src/lib/main.js update". This ensures users have an easy way to test the new command.

## Summary
This update consolidates the CLI commands by adding the update command while preserving the existing functionality. It demonstrates a targeted improvement addressing a clear user need, without adding excessive complexity. All changes are made within the permitted files including the source file, test file, README, and dependencies file.