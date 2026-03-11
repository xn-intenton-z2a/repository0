# HAMMING_CLI

# Summary

Provide a small, well-documented command-line interface that exposes the library's hammingDistance and hammingDistanceBits functions for quick local use and examples. The CLI is a thin wrapper inside src/lib/main.js that parses arguments, validates inputs using the same rules as the library functions, prints results to stdout, and returns appropriate exit codes.

# Motivation

A CLI makes the library immediately usable from the terminal for ad-hoc checks, examples in README, and behaviour tests. It lets users compare strings and integers without writing JavaScript and enables simple CI checks and scripts.

# Specification

1. Entry point
   - When node src/lib/main.js is executed as a script, detect process.argv and run in CLI mode.
   - Support two modes selected by --mode or -m with values "string" or "bits". When omitted, auto-detect string mode unless both positional args parse as non-negative integers or BigInt literals.

2. CLI usage and arguments
   - For string mode, accept two positional arguments representing the two strings to compare. Example: node src/lib/main.js --mode string firstString secondString
   - For bits mode, accept two positional arguments representing non-negative integers. Accept decimal integers or BigInt literal suffix n. Example: node src/lib/main.js --mode bits 13 7
   - Add flags: --help or -h to print usage and exit 0; --version or -v to print package version and exit 0.
   - Add optional --normalize flag for string mode with values NFC, NFD, or false; when omitted default to false.

3. Validation and output
   - Reuse the same validation rules as the library: TypeError for bad types, RangeError for unequal string lengths or negative integers, and non-integer numbers are rejected.
   - For successful runs, print a single integer to stdout followed by a newline and exit with code 0.
   - For validation errors, print a single-line error message to stderr and exit with code 1.

4. Testing
   - Add unit tests that invoke the CLI via child_process.spawn or a lightweight wrapper and assert stdout, stderr, and exit codes for success and failure cases.
   - Ensure tests cover the core acceptance examples and normalize flag behaviour.

# Acceptance Criteria

- Running node src/lib/main.js --mode string karolin kathrin prints 3 and exits 0
- Running node src/lib/main.js --mode string "" "" prints 0 and exits 0
- Running node src/lib/main.js --mode string a bb prints a RangeError message to stderr and exits 1
- Running node src/lib/main.js --mode bits 1 4 prints 2 and exits 0
- Running node src/lib/main.js --mode bits 0 0 prints 0 and exits 0
- --help prints usage information and exits 0
