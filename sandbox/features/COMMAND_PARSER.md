# COMMAND_PARSER Feature Specification

## Overview
This feature enhances the CLI functionality of the repository by incorporating a simple command parsing mechanism. It enables the application to handle common flags such as --help and -h. When invoked with these flags, the application will print a helpful usage message and exit. Otherwise, the application behaves as before by logging the provided arguments.

## Implementation Details
- Update the main source file in src/lib/main.js to include a check for command line arguments.
- When the argument --help or -h is detected, the CLI will display a concise usage guide explaining available options.
- Maintain backwards compatibility by ensuring that if no help flag is provided, the existing behavior of logging the arguments remains intact.
- Update the package.json start script if necessary to document the new help functionality.

## Testing
- Enhance the tests in tests/unit/main.test.js to include a test verifying that invoking the CLI with --help or -h outputs the correct usage information.
- Ensure that invoking the CLI without special flags continues to function as expected.

## Documentation
- Update the README.md file to include a section on using the new help flag. Document how users can call the CLI with --help to view the usage guide and list any additional command line options available.
