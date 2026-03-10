# CLI_INTERFACE

## Overview

Provide a minimal, testable command line interface to exercise the core FizzBuzz library from the shell and allow precise spawn-based tests in CI.

## Specification

- Behaviour
  - When src/lib/main.js is executed directly (node src/lib/main.js), it detects CLI mode and parses arguments from process.argv.
  - Supported flags:
    - --single <n> or -s <n>: print the single fizzBuzzSingle(n) output to stdout followed by a single newline.
    - --range <n> or -r <n>: print the fizzBuzz(n) output, one entry per line, to stdout. If n is 0, print nothing and exit 0.
    - --help or -h: print a short usage message to stdout and exit 0.
  - Validation and exit codes
    - On success (valid input): write expected output to stdout and exit with code 0.
    - On invalid input: write an error message to stderr and exit with a non-zero code.
    - Error message text MUST match core validation messages exactly (see FIZZBUZZ_CORE):
      - Input must be a number
      - Input must be an integer
      - Input must be >= 1 (for --single)
      - Input must be >= 0 (for --range)

## Acceptance criteria

- node src/lib/main.js --single 3 prints exactly Fizz followed by a newline and exits with code 0.
- node src/lib/main.js --range 5 prints five lines and the third line equals Fizz and exit code 0.
- node src/lib/main.js --range 0 produces no stdout and exits 0.
- node src/lib/main.js --single -1 writes the exact message Input must be >= 1 to stderr and exits with non-zero code.
- node src/lib/main.js --single 3.5 writes the exact message Input must be an integer to stderr and exits non-zero.
- node src/lib/main.js --range foo writes the exact message Input must be a number to stderr and exits non-zero.
- A unit/integration test file tests/unit/cli.test.js exists and spawns node to assert stdout, stderr and numeric exit codes exactly.

## Implementation notes

- Reuse exports from src/lib/main.js (import { fizzBuzz, fizzBuzzSingle }) rather than reimplementing logic.
- Do not add runtime dependencies; parse process.argv manually and keep branching minimal for testability.
- Tests should avoid shell quoting differences by spawning Node directly with arguments array and asserting exact bytes on stdout/stderr and exit code.
