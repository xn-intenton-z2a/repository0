# CLI_HELP Feature Specification

This feature adds a dedicated help command to the CLI tool, providing users with clear usage instructions and a summary of available commands. The implementation will modify the existing source file (src/lib/main.js), update the test file (tests/unit/main.test.js) to verify the help command functionality, update the README for documentation, and ensure that package.json dependencies and scripts are consistent with the feature.

## Overview

The CLI_HELP feature enhances user experience by displaying a comprehensive help message when the user invokes the CLI tool with the "help" argument (e.g., `node src/lib/main.js help`). This message outlines the various commands available in the tool (such as export, import, diagnostics, version, etc.) along with brief usage instructions.

## Implementation Details

- **Source File (src/lib/main.js):**
  - Update the main function to detect if the first CLI argument equals "help".
  - If detected, output a formatted help text listing all available commands and example usages.
  - Ensure that help output is presented in a user-friendly manner.

- **Test File (tests/unit/main.test.js):**
  - Add test cases to simulate running `node src/lib/main.js help` and verify that the output contains key help instructions.
  - Ensure that the help command exits without error.

- **README.md:**
  - Update the documentation to include a section on using the help command. This should present examples and describe the expected output of the CLI_HELP feature.

- **Dependencies (package.json):**
  - No new dependencies are required; the implementation will leverage existing libraries and CLI conventions.

## CLI Integration & Testing

- Modify the CLI logic to branch on the "help" command.
- Validate the new functionality using unit tests that check for the correct help output.
- Update all related documentation to include usage examples and demonstrate the benefit of having a built-in help command.

This feature delivers immediate, achievable value by improving usability and providing clearer guidance to end users, in line with the repository's mission to offer handy CLI utilities in Node.js.
