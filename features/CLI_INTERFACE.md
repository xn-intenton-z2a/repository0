# CLI Interface

Provide command-line interface functionality with argument parsing, version information, and diagnostic capabilities for the main library functionality.

## Overview

Transform the basic main.js into a fully functional CLI tool that can handle various command-line arguments, provide version information, and run diagnostic checks. This feature establishes the foundational interface for users to interact with the library.

## Acceptance Criteria

- Parse command-line arguments using built-in Node.js capabilities or a lightweight argument parser
- Support --version flag to display current package version from package.json  
- Support --help flag to display usage information and available commands
- Support --diagnostics flag to run system checks and display environment information
- Maintain backward compatibility with existing main function behavior
- Provide clear error messages for invalid arguments or usage
- Include comprehensive unit tests covering all CLI argument scenarios

## Implementation Notes

The CLI should be lightweight and avoid heavy dependencies. Use Node.js built-in modules where possible. Error handling should be user-friendly with clear messaging about correct usage patterns.

## Success Metrics

- All CLI flags function correctly with appropriate output
- Help documentation is comprehensive and user-friendly  
- Error handling provides clear guidance for users
- Tests achieve comprehensive coverage of CLI functionality