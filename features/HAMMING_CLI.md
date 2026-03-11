# HAMMING_CLI

## Summary

Provide a small, well-documented command-line interface that exposes the library's hammingDistance and hammingDistanceBits functions for quick local use and examples. The CLI is an optional thin wrapper inside src/lib/main.js that parses arguments, validates inputs using the same rules as the library functions, prints results to stdout, and returns appropriate exit codes.

## Motivation

A CLI makes the library immediately usable from the terminal for ad-hoc checks, examples in README, and behaviour tests. It helps users understand the library without writing JS and allows simple integration in scripts and CI checks.

## Specification

1. CLI entry point
   - When node src/lib/main.js is executed as a script, detect process.argv and run in CLI mode.
   - Support two modes: string mode and bits mode selected by a flag --mode or -m with values "string" or "bits". Default mode is "string" when two positional arguments look like strings and not numeric-only values.

2. CLI usage and arguments
   - For string mode, accept two positional arguments representing the two strings to compare. Example: node src/lib/main.js --mode string firstString secondString
   - For bits mode, accept two positional arguments representing non-negative integers. Accept decimal integers or BigInt literal suffix n. Example: node src/lib/main.js --mode bits 13 7
   - Add flags: --help or -h to print usage and exit 0; --version or -v to print package version and exit 0.

3. Validation and output
   - Reuse the same validation rules as the library: TypeError for bad types, RangeError for unequal string lengths or negative integers, and non-integer numbers are rejected.
   - For successful runs, print a single integer to stdout followed by a newline and exit with code 0.
   - For validation errors, print a single-line error message to stderr and exit with a non-zero code (1).

4. Tests and examples
   - Add unit tests that invoke the CLI via Node's child process spawn or a lightweight wrapper and assert stdout, stderr, and exit codes for success and failure cases.
   - Add a small example in README that shows CLI usage for both modes and demonstrates acceptance examples.

## Acceptance Criteria

- Running node src/lib/main.js --mode string karolin kathrin prints 3 to stdout and exits 0
- Running node src/lib/main.js --mode string "" "" prints 0 and exits 0
- Running node src/lib/main.js --mode string a bb prints an error to stderr and exits non-zero
- Running node src/lib/main.js --mode bits 1 4 prints 2 and exits 0
- Running node src/lib/main.js --mode bits 0 0 prints 0 and exits 0
- --help prints usage information and exits 0

## Files to change

- src/lib/main.js: add a small CLI argument parser that delegates to exported functions and prints results according to the rules above
- tests/unit/: add CLI unit tests (for example main.cli.test.js) that check stdout/stderr and exit codes
- README.md: add a CLI usage section demonstrating common commands

## Implementation notes

- Keep CLI logic small and dependency-free; use process.argv, console.log, and console.error only
- Reuse the exported functions to keep behaviour consistent and avoid duplication of validation logic
- Use Node's built-in BigInt parsing when input ends with n or falls outside safe integer range

## Security and behaviour

- Do not execute or evaluate user input in any way beyond numeric parsing and string handling
- Make sure the CLI cannot accidentally read or write files or network resources

