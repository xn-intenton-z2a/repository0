# ARGUMENT_PROCESSOR

This feature enhances the CLI experience by processing command line arguments to provide helpful usage details and version information. It directly supports the repository's mission of offering handy CLI utilities and aligns with the core purpose of demonstrating automated workflows in a Node.js environment.

## Overview

The feature adds support for common command line options such as --help and --version. When a user runs the application with these options, the program displays a detailed help message or version number respectively. This improves usability and provides end users with clear guidance on how to navigate and use the CLI.

## Implementation Details

1. Update the source file (src/lib/main.js) to include a switch/case or conditional logic that checks for arguments --help and --version.
2. If --help is provided, output a usage message that explains available options and basic usage examples.
3. If --version is provided, display the current version from package.json.
4. Ensure that the default behavior still executes when no recognized CLI options are provided.
5. Update tests in tests/unit/main.test.js to verify the different CLI outputs (such as help text and version output), ensuring that the CLI behaves as expected.

## Test Adjustments

Update the test file to include new tests that simulate passing command line options. These tests should verify that:
- The help message is displayed when --help is used.
- The version information is returned when --version is specified.
- The normal process behavior remains intact for other inputs.

This feature is directly in line with the repository's objective of delivering useful CLI functionality within a single source file and ensuring reproducible and automated development practices.
