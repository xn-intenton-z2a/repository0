# REPOSITORY_TEMPLATE Enhancement: CLI Help Utility

This update introduces an integrated CLI help functionality to the repository's main command-line interface. When the user supplies the 'help' argument at runtime, the program will display a detailed usage message outlining available commands, options, and links to documentation.

## Overview

The enhancement enriches the core CLI experience by:
- Detecting a 'help' argument passed via command line.
- Displaying a formatted help message that documents available commands (e.g., diagnostics, version, update) as well as instructions on how to run tests and check updates.
- Updating the source file, test file, README documentation, and dependencies script accordingly.

## Implementation Details

### Source File (src/lib/main.js)
- Add a check for the 'help' argument. For instance, if `args` contains `help`, the utility prints a multi-line help message and exits.
- Ensure that this functionality does not interfere with the existing execution flow for commands like `diagnostics`, `version`, and `update`.

### Test File (tests/unit/main.test.js)
- Add a new unit test to simulate running the script with the 'help' argument and verify that the printed output contains the expected usage information.

### README Update
- Enhance the README with a new section explaining the CLI help feature. Include usage examples (e.g., `npm run start help`) and a link to further documentation in CONTRIBUTING.md and MISSION.md.

### Dependencies (package.json)
- (Optional) Add or update a script if necessary to explicitly support the help command if a shortcut is desired (e.g., "help": "node src/lib/main.js help").

## Testing and Validation

Ensure that:
- Running `node src/lib/main.js help` outputs the detailed usage instructions.
- All existing commands continue to work normally when no help argument is present.
- Unit tests validate the expected output from the help functionality.

With this enhancement, the repository reinforces its role as a project template with an accessible and well-documented CLI interface.
