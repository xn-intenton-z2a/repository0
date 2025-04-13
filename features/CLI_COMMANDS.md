# CLI_COMMANDS Feature Specification

This feature enhances the CLI tool by implementing a basic command routing mechanism. The changes will add functionality to process multiple CLI commands beyond the built-in help, including diagnostics, version, and update commands. This is in line with the repository mission of offering handy CLI utilities in Node.js, while ensuring that all changes are confined to the source file, test file, README, and package.json.

## Overview

The CLI_COMMANDS feature provides a simple command dispatcher in the main CLI entry point. The feature will check the first argument passed to the CLI and execute the corresponding command logic. Specifically:

- When the argument is "diagnostics", the CLI will output a diagnostics message.
- When the argument is "version", the CLI will output the current version of the repository.
- When the argument is "update", the CLI will simulate an update check and provide appropriate feedback.
- For all other inputs, the default behaviour or help command (if integrated with CLI_HELP) can be invoked.

This feature ensures that the scripts in package.json (e.g., diagnostics, version, check-update) work as expected.

## Implementation Details

### Source File (src/lib/main.js):

- Update the main function to inspect the first argument (if provided).
- Implement a simple command dispatcher that routes the following commands:
  - **diagnostics**: Print a diagnostics message (e.g., "Diagnostics: System operational").
  - **version**: Read the version from package.json or hard-code the version (e.g., "Version: 1.4.1-13") and display it.
  - **update**: Simulate an update check by printing a corresponding message (e.g., "Checking for updates... No updates available").
- If no recognized command is detected, fall back to the default behaviour (e.g., output arguments as done currently or integrate with the CLI_HELP feature).

### Test File (tests/unit/main.test.js):

- Add new test cases that simulate running the CLI with the "diagnostics", "version", and "update" commands.
- Assert that the outputs match the expected strings for each command.
- Ensure that tests remain isolated and do not interfere with the existing CLI_HELP functionality tests.

### README File (README.md):

- Update the README to include sections that document the new commands available in the CLI tool.
- Provide usage examples such as:
  - `node src/lib/main.js diagnostics`
  - `node src/lib/main.js version`
  - `node src/lib/main.js update`
- Describe the purpose of each command and its benefits, aligned with the mission to provide useful CLI utilities.

### Dependencies (package.json):

- Confirm that no additional dependencies are needed for this feature. All implementation relies on standard Node.js APIs.
- Optionally, update any scripts or documentation if necessary to better reflect the new CLI command functionalities.

## Benefits

- Improves user interaction by providing clear and dedicated responses to core CLI commands.
- Ensures that intended commands in package.json scripts (diagnostics, version, and update) execute meaningful logic, enhancing the overall usability and robustness of the CLI tool.
- Maintains consistency with the repository’s mission, providing a lightweight yet functional CLI utility in Node.js.
