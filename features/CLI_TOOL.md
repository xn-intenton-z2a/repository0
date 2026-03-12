# CLI_TOOL

Summary

Add a small, well-documented command-line interface entrypoint to src/lib/main.js so the library can be invoked from the terminal for interactive or scripted uses.

Motivation

A CLI makes it easy to demonstrate and manual-test the library locally and in CI without starting the website.

Specification

- Entrypoint behaviour
  - Running node src/lib/main.js single <n>
    - Prints the fizzBuzzSingle result for n to stdout followed by a newline
    - Exit code 0 on success
    - Non-integer or out-of-range arguments write an error to stderr and exit with code 2
  - Running node src/lib/main.js range <n>
    - Prints the JSON array returned by fizzBuzz(n) to stdout
    - Use compact JSON with JSON.stringify(result)
    - Exit code 0 on success
  - Running node src/lib/main.js --help or no args
    - Print a short usage summary and exit code 0

- Behavior and validation
  - Use the same TypeError/RangeError semantics as the library functions
  - Errors must be user-friendly and suitable for use in shell scripts

Tests and Acceptance Criteria

- Running the CLI as single 3 prints Fizz and exits 0
- Running the CLI as range 15 prints a JSON array whose last element is "FizzBuzz"
- CLI respects error semantics and returns non-zero exit codes for invalid input

Notes

- Keep the CLI lightweight (no new dependencies). Use process.argv and named exports so the same functions are used by tests and website demos.

