# CLI_INTERFACE

## Overview

Add a lightweight CLI wrapper around the existing library so users can run FizzBuzz from the command line and so behaviour is demonstrable in CI via spawn tests.

## Specification

- Behaviour
  - When src/lib/main.js is executed directly (node src/lib/main.js), it detects CLI mode and parses arguments.
  - Supported flags:
    - --single <n> or -s <n>: print fizzBuzzSingle(n) followed by a newline to stdout.
    - --range <n> or -r <n>: print the fizzBuzz(n) output, one entry per line, to stdout. If n is 0, print nothing and exit 0.
    - --help or -h: print a short usage message to stdout and exit 0.
  - Validation and exit codes
    - Valid numeric input: exit code 0.
    - Invalid input (non-number, non-integer, negative for single): print an error message to stderr and exit with a non-zero code.

## Acceptance criteria

- Running node src/lib/main.js --single 3 prints Fizz and exits with code 0.
- Running node src/lib/main.js --range 5 prints five lines and the third line equals Fizz.
- Running node src/lib/main.js --range 0 produces no output and exits 0.
- Running node src/lib/main.js --single -1 writes an error message to stderr and exits non-zero.
- Non-integer and non-number CLI inputs produce stderr output and non-zero exit codes.
- Unit tests or lightweight integration tests are added (tests/unit/cli.test.js) that spawn node and assert stdout/stderr and exit codes.

## Implementation notes

- Implement CLI parsing with minimal dependency on process.argv to avoid adding new packages.
- Use the same validation rules as FIZZBUZZ_CORE; the CLI should reuse the core functions rather than reimplement logic.
- Keep CLI logic small and testable; tests should spawn node as a subprocess and assert exact stdout/stderr and exit code values rather than relying on human-readable formatting differences.
