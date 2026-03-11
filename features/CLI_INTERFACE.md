# Command Line Interface

## Overview

Extend the main.js file to support command line usage for Hamming distance calculations, enabling users to calculate distances directly from the terminal without writing JavaScript code.

## Functionality

The CLI interface supports both string and bit Hamming distance calculations through command line arguments. Users can pass strings or integers as arguments and receive calculated distances as output.

## Command Structure

The CLI supports multiple command patterns:
- `node src/lib/main.js hamming-string "word1" "word2"` - calculate string distance
- `node src/lib/main.js hamming-bits 5 9` - calculate bit distance
- `node src/lib/main.js --help` - display usage information
- Existing `--version` and `--identity` flags remain functional

## Input Processing

The CLI validates command line arguments and converts them to appropriate types. String arguments are passed directly to hammingDistance, while numeric arguments are parsed as integers for hammingDistanceBits.

## Output Format

Results are displayed in human-readable format with clear labeling. Error messages are informative and guide users toward correct usage patterns. Exit codes indicate success (0) or failure (1).

## Error Handling

The CLI catches and displays library function errors in user-friendly format. Invalid command syntax shows help text. Missing or malformed arguments display specific error messages.

## Help System

The help system documents all available commands with examples and describes expected input formats. Help text explains both string and bit distance concepts briefly.

## Testing Requirements

Unit tests verify CLI argument parsing, command execution, output formatting, and error handling. Tests validate that CLI functions use the actual library functions correctly.

## Integration

The CLI interface builds on the existing main function structure while adding new command handling. It maintains backward compatibility with existing --version and --identity flags.

## Acceptance Criteria

- [ ] `node src/lib/main.js hamming-string "karolin" "kathrin"` outputs distance 3
- [ ] `node src/lib/main.js hamming-bits 1 4` outputs distance 2
- [ ] `node src/lib/main.js --help` displays comprehensive usage information
- [ ] Error cases display helpful messages and exit with code 1
- [ ] Existing --version and --identity flags continue to work
- [ ] CLI uses the actual hammingDistance and hammingDistanceBits library functions
- [ ] Unit tests verify CLI functionality and output formats
- [ ] CLI handles edge cases like empty strings and zero integers correctly