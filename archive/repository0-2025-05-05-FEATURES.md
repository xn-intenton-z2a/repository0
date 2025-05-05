sandbox/features/ARG_PARSER.md
# sandbox/features/ARG_PARSER.md
# ARG_PARSER Feature Specification

## Overview
This feature enhances the main command line interface by introducing basic argument parsing. A new command line option (--help) will display usage information for the tool. The changes will be limited to the source file (src/lib/main.js), test files (tests/unit/main.test.js), and the README.md. This feature aligns with the repository's mission by showcasing improved usability and clarity in the CLI interactions.

## Implementation Details
- Update the src/lib/main.js to check if the passed arguments contain '--help'.
- If '--help' is detected, output a clear, concise help message describing the available options and usage.
- Otherwise, proceed with the existing behavior of printing provided arguments.

## Testing
- Extend tests/unit/main.test.js by adding a test case to simulate running the program with the '--help' flag.
- Verify that the output contains the expected help/usage information.

## Documentation
- Update the README.md to include a section under 'Getting Started' and 'Usage' that describes the new '--help' command line option.
- Provide instructions on how to invoke the help command to see usage examples.
