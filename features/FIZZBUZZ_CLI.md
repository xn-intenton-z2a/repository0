# FIZZBUZZ_CLI

Summary

Specify a small command-line interface mode for the library that demonstrates fizzBuzzSingle and fizzBuzz behaviour when invoked as a Node script. The CLI is optional for interactive use and for behaviour tests that exercise the website build or examples.

Specification

- When src/lib/main.js is executed with node directly (node src/lib/main.js) it should act in CLI mode if an environment variable or process.argv indicates a CLI invocation.
- CLI accepts a single positional integer argument n. When provided, it prints the fizzBuzz sequence from 1..n, one entry per line, to stdout.
- When provided with no argument, CLI prints usage help to stdout and exits with code 0.
- When provided invalid input, CLI prints a concise error message to stderr and exits with a non-zero exit code.
- The CLI must reuse the exported library functions (fizzBuzz / fizzBuzzSingle) rather than duplicating logic.

Testing guidance

- Behaviour tests should run node src/lib/main.js 15 and assert stdout contains the expected 15 lines ending with FizzBuzz and exit code 0.
- Tests for invalid input should assert non-zero exit code and an error message on stderr.

Acceptance criteria

- CLI prints correct output for n=15 with one entry per line and exit code 0
- CLI prints usage when run without args and exits 0
- CLI returns non-zero exit code and prints error message on invalid input

Notes

This feature is intentionally minimal and designed to be implemented by adding a short runtime branch to src/lib/main.js that checks if the module is run as a script and then parses process.argv. The implementation must call the exported functions so unit tests remain the authoritative source of truth.