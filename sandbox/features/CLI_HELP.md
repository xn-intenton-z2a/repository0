# CLI_HELP Feature Specification

## Overview
This feature enhances the repository's main script by adding a command-line help option. When a user passes a --help flag, the application will display usage instructions. This upgrade directly improves the user experience by offering guidance on available commands and how to use the tool.

## Implementation
- Modify the source file (src/lib/main.js) to check for the presence of the --help flag in command-line arguments.
- If --help is detected, display a clear usage message outlining how to run the tool and what optional arguments are available. The message should be based on the instructions in the README file.
- Ensure that if no arguments or other arguments are provided, the program behaves as before, logging the provided arguments.

## Testing
- Update the test file (tests/unit/main.test.js) by adding a new test case that executes the main function with the --help argument. The test should verify that the help message is displayed.

## Documentation
- Update the README file to include a usage section that describes the --help option and its intended output.

This feature is designed to directly benefit users by making the CLI more self-explanatory and accessible, aligning with the repository's mission of demonstrating effective CI/CD workflows alongside clear, functional documentation.