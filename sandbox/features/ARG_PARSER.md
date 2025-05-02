# ARG_PARSER

## Overview
This feature enhances the main script by adding command line argument parsing. By supporting flags like --help and potential demo options, the repository provides a user-friendly interface to control the demonstration of core functionality. The changes will be implemented in the main source file, tests, and README documentation.

## Implementation
- Update src/lib/main.js to parse command line arguments. If the --help flag is passed, print a usage guide describing available options and demo functionalities. For any other flags, echo or perform corresponding actions.
- Ensure that non-help arguments are handled gracefully and logged to the console.
- The parser logic will be kept lightweight and maintain compliance with existing coding standards.

## Testing
- Modify tests/unit/main.test.js to include cases for verifying that the help text is correctly displayed when --help is provided.
- Confirm that invoking the script with a variety of arguments produces the expected console output without errors.

## Documentation
- Update README.md with a clear usage section that introduces the new command line interface. Include examples of how to run the script with --help and any other flags.
- Ensure that the updated documentation aligns with the repository mission and CONTRIBUTING guidelines.
