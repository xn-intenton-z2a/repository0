# CLI Interface

## Overview

Create a command-line interface that allows users to calculate Hamming distances from the terminal, supporting both string and integer inputs with proper argument parsing and help documentation.

## Implementation Requirements

The CLI should accept command-line arguments for both comparison modes, provide help text and usage examples, handle input validation with clear error messages, and support common CLI conventions like help flags and version information.

## Acceptance Criteria

- Command accepts string arguments for string Hamming distance calculation
- Command accepts integer arguments for bits Hamming distance calculation
- Help flag displays usage instructions and examples
- Version flag displays library version information
- Input validation provides clear error messages
- Exit codes follow standard conventions
- Support for both interactive and scripted usage
- Output format is consistent and parseable

## Testing Strategy

CLI testing should verify argument parsing, help text display, error handling, output format consistency, and proper exit codes. Tests should cover both valid usage and error scenarios.

## Web Interface Integration

The CLI provides an alternative interface to the same core library functions used by the web interface. Consider adding a CLI demo section to the web interface showing equivalent command-line usage.