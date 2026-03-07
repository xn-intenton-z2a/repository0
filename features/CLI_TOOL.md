# CLI_TOOL

Feature name: CLI_TOOL

Summary

A minimal command-line interface exposing the library's string and bit Hamming distance APIs. The CLI is a thin synchronous wrapper around the named exports in src/lib/main.js and is invoked via the existing npm script start:cli (node src/lib/main.js).

Behavior

- Modes
  - string: node src/lib/main.js string <left> <right>
    - Compare left and right as Unicode code point sequences and print the integer Hamming distance to stdout.
    - Exit 0 on success.
  - bits: node src/lib/main.js bits <x> <y>
    - Interpret x and y as non-negative integers (Number or BigInt literal). Print the integer bitwise Hamming distance to stdout.
    - Exit 0 on success.

- Validation and error handling
  - Validate arguments and map library TypeError and RangeError to user-friendly messages on stderr.
  - Exit with code 2 for usage or validation errors; non-zero for unexpected failures.
  - Do not print stack traces for normal validation errors; include the error name and a short explanation.

Tests and examples

- Provide small integration tests that spawn node src/lib/main.js and assert stdout and exit codes for canonical and error cases.
- Add examples/cli-output.md entries showing the exact expected stdout for canonical invocations.

Acceptance Criteria

- node src/lib/main.js string karolin kathrin prints 3 and exits 0
- node src/lib/main.js string "" "" prints 0 and exits 0
- node src/lib/main.js bits 1 4 prints 2 and exits 0
- Invalid invocations (wrong arg count or bad numeric input) print a helpful usage message on stderr and exit 2
- README contains a CLI section with usage examples and a pointer to examples/cli-output.md
