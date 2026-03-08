# FEATURE_CLI

Overview

Provide a tiny CLI wrapper around the library to demonstrate usage and enable manual verification. The CLI will be a single-file enhancement that uses the exported fizzBuzz and fizzBuzzSingle functions and prints results to stdout.

Goals

- Offer a discoverable command-line entrypoint for examples and manual testing.
- Keep the CLI behaviour deterministic and easy to test.

Specification

- Implement a CLI script at src/lib/main.js that when invoked with node src/lib/main.js accepts either:
  - A single integer argument to print the fizzBuzzSingle result
  - The flag --range N (or a second numeric argument) to print the fizzBuzz array from 1 to N, one item per line
- CLI exit codes:
  - 0 on success
  - non-zero (1) on invalid input; CLI prints validation error to stderr using the same error messages as the API (TypeError or RangeError)
- The CLI must not alter library exports; it should detect if the file is run as a script and run only then.

Examples

- node src/lib/main.js 7 -> prints the single-line output for 7
- node src/lib/main.js --range 5 -> prints lines: 1,2,Fizz,4,Buzz

Acceptance criteria

- AC1: The CLI prints correct fizzBuzzSingle output for an integer argument
- AC2: The CLI prints the correct fizzBuzz list when run with --range N
- AC3: Invalid inputs produce the same error messages as library validations and exit with code 1
- AC4: The CLI path is demonstrable in README examples and does not change named exports

Testing notes

- Unit tests should focus on library behaviour; a small integration test may invoke node src/lib/main.js as a child process to assert printed output and exit codes.
- Keep the CLI implementation small and internally delegating to the exported functions to avoid duplication.
