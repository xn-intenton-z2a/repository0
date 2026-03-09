# FIZZBUZZ_CLI

Summary

Add a small command-line interface for the library that allows users to run FizzBuzz from the command line. The CLI is a thin wrapper around the core library functions and is intended for demonstration and quick manual verification.

Rationale

A CLI makes it easier to manually verify the library and to include a simple example in README and scripts. This improves discoverability and fits within a single repository source file.

Scope

- Provide a CLI entrypoint via node src/lib/main.js (already referenced by start:cli script).
- Accept a single positional integer argument n and print the fizzBuzz results to stdout, one per line.
- On invalid input, print a helpful message to stderr and exit with non-zero status.
- Implement minimal unit tests that exercise the CLI code path by invoking the main function directly where possible.

Behavior and Options

- When invoked with a positive integer n, print the sequence for 1..n, each entry on its own line, and exit 0.
- When invoked with 0, print nothing and exit 0.
- When invoked with invalid input (non-integer or negative), print an error message to stderr and exit with code 2.

Tests

- Unit tests should invoke the exported CLI function (or main) in-process and assert output for n=3, n=5, n=15 and that invalid inputs raise appropriate errors or return non-zero codes.
- Tests should not require spawning child processes; prefer calling the exported function so tests run quickly.

Acceptance Criteria

- The CLI prints correct lines for n=15, ending with FizzBuzz.
- The CLI returns non-zero/throws or reports errors for invalid arguments.
- README includes an example showing how to run node src/lib/main.js 15 and the expected minimal output.

Implementation Notes

- The CLI must be a thin wrapper that reuses fizzBuzz and fizzBuzzSingle.
- Do not add a heavy CLI dependency; only minimal argument parsing is required.
