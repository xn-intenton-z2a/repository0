# CLI Interface

## Overview

Enhance the command-line interface to provide practical Hamming distance calculations directly from the terminal. Allow users to compute distances interactively or via command-line arguments for scripting and automation.

## Implementation Requirements

Extend the existing CLI functionality in src/lib/main.js to support Hamming distance calculations. Add command-line argument parsing for both string and bits distance calculations. Support interactive mode for user input and batch processing mode for multiple calculations. Include help documentation and error handling.

## Acceptance Criteria

- CLI supports string Hamming distance: `node src/lib/main.js string "karolin" "kathrin"`
- CLI supports bits Hamming distance: `node src/lib/main.js bits 1 4`
- Interactive mode prompts for inputs: `node src/lib/main.js interactive`
- Help command displays usage information: `node src/lib/main.js --help`
- Error handling provides clear messages for invalid inputs
- Support for piped input and batch processing
- Exit codes indicate success (0) or error (non-zero)
- JSON output mode for scripting: `--format json`

## Testing Strategy

Unit tests should verify CLI argument parsing, command execution, output formatting, and error handling. Test both interactive and batch modes. Verify proper exit codes and error messages.

## Web Interface Integration

The web interface should include a CLI documentation section showing command examples and usage patterns. Consider adding a terminal emulator widget for demonstrating CLI functionality directly in the browser.