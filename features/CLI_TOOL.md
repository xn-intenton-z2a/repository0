# CLI_TOOL

Specification

Provide a simple command line interface to exercise the library without requiring consumers to write code. The CLI is a thin wrapper around the exported functions in src/lib/main.js and must be reachable via the existing npm script start:cli which runs node src/lib/main.js.

CLI behavior

- The CLI supports two modes:
  - string mode: node src/lib/main.js string <left> <right>
    - Prints the Hamming distance between left and right measured as Unicode code points.
    - Exits with code 0 on success.
  - bits mode: node src/lib/main.js bits <x> <y>
    - Prints the Hamming distance between integers x and y (non-negative integers).
    - Exits with code 0 on success.
- Validation and error handling:
  - Print user-friendly error messages to stderr for invalid input and exit with a non-zero code (2 for usage/validation errors).
  - Follow the same TypeError and RangeError semantics as the library functions; CLI should map thrown errors to human-friendly messages.

Tests and examples

- Add unit or small integration tests that spawn the CLI (via node) and assert stdout and exit codes for success and failure cases.
- Add examples to the examples/ directory showing how to call the CLI and capturing expected output.

Acceptance Criteria

- Running node src/lib/main.js string karolin kathrin prints 3 and exits 0
- Running node src/lib/main.js bits 1 4 prints 2 and exits 0
- Invalid invocations print helpful usage text and exit with code 2
- README contains a CLI section with usage examples and suggested scripts
