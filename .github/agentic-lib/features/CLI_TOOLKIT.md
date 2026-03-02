# CLI Toolkit

## Overview

Transform the basic main.js into a robust CLI toolkit with argument parsing, help text, version display, and command validation. This feature provides the foundation for making the library immediately useful as an npx-runnable tool.

## User Value

Users can immediately invoke the package with npx and receive helpful feedback, version information, and structured command handling. This transforms a basic script into a professional CLI tool that follows standard conventions.

## Acceptance Criteria

- Parse command line arguments using a simple built-in approach without external dependencies
- Display version information when --version or -v flags are provided  
- Show comprehensive help text when --help or -h flags are provided
- Validate commands and provide helpful error messages for invalid usage
- Support both short and long flag formats
- Maintain backwards compatibility with existing argument handling
- Include usage examples in help output
- Handle edge cases like empty arguments gracefully

## Implementation Notes

- Use process.argv parsing without adding heavy dependencies
- Version should be read from package.json dynamically
- Help text should include examples of common usage patterns
- Error messages should be clear and actionable
- Exit codes should follow standard conventions (0 for success, 1 for errors)

## Testing Requirements

- Unit tests for argument parsing logic
- Tests for version display functionality
- Tests for help text generation
- Tests for error handling with invalid arguments
- Integration tests for CLI invocation scenarios