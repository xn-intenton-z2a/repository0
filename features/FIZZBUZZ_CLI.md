# FIZZBUZZ_CLI

Summary

Define a command-line interface for the FizzBuzz library that demonstrates library usage, enables simple integration testing, and provides a user-friendly way to run the routine from the terminal.

Behaviour

- The CLI accepts a single positional argument n (positive integer) and prints the fizz buzz output for numbers 1 through n as one item per line in order.
- Input validation: If n is zero, print nothing and exit with code 0. If n is negative, print a clear error message to stderr and exit with a non-zero code (RangeError semantics). If n is not an integer, print a clear error message to stderr and exit with a non-zero code (TypeError semantics).
- The CLI must import and use the named exports fizzBuzz and/or fizzBuzzSingle from src/lib/main.js rather than reimplementing the logic.
- The CLI should avoid extraneous logging; only results and necessary error messages appear on stdout/stderr.

Integration and tests

- Provide a simple unit test that spawns node src/lib/main.js 15 and asserts stdout contains 15 newline-separated items with FizzBuzz as the final line.
- Provide tests for invalid inputs asserting non-zero exit codes and appropriate error messages on stderr.

Acceptance criteria

- Running node src/lib/main.js 15 prints 15 lines and the last line is FizzBuzz.
- Running node src/lib/main.js 0 prints nothing and exits with code 0.
- Running node src/lib/main.js -1 prints a RangeError-style message to stderr and exits with a non-zero exit code.
- Running node src/lib/main.js 3.5 prints a TypeError-style message to stderr and exits with a non-zero exit code.
- The CLI imports and uses fizzBuzz or fizzBuzzSingle from src/lib/main.js; there is no duplicated fizz buzz logic in the CLI.
- Tests verifying the above are added under tests/unit or equivalent and pass when run with npm test.
