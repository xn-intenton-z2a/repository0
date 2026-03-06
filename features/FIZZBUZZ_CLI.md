# FIZZBUZZ_CLI

Summary

A small companion feature that adds a command-line interface to the FizzBuzz library in a single-file implementation. The CLI is optional but provides a useful developer and demo UX for running fizzbuzz from the terminal and for simple end-to-end tests.

Goals

- Provide a minimal CLI entrypoint in src/lib/main.js or a thin wrapper that:
  - When invoked with a single integer argument prints the fizzbuzzSingle result for that integer.
  - When invoked with --range N or two positional arguments (start end) prints the fizzBuzz range or values from 1..N.
  - Exit codes: 0 on success, non-zero for invalid input.
- Add light e2e tests that exercise the CLI via node invocation (tests may spawn the node process and assert stdout).
- Document CLI usage in README examples and examples/ directory.

Usage

- Run: node src/lib/main.js 15 -> prints the fizzBuzz array or one-per-line output depending on the flag.
- Run: node src/lib/main.js --single 3 -> prints Fizz
- Run: node src/lib/main.js --range 15 -> prints 1..15 with replacements, one-per-line

Edge cases and validation

- CLI should validate inputs the same as the library: negative numbers cause a non-zero exit and an explanatory message on stderr, non-integers cause a non-zero exit and explanatory message.
- For zero range, print nothing and exit 0.

Testing and Acceptance Criteria

- Tests include CLI e2e tests under tests/unit or tests/e2e that assert:
  - node src/lib/main.js --single 3 prints Fizz and exits 0
  - node src/lib/main.js --range 15 prints 15 lines and last line is FizzBuzz
  - Invalid inputs print an error to stderr and exit with non-zero status

- Acceptance checklist:
  - CLI prints expected results for single and range modes
  - CLI exits with appropriate exit codes for invalid input
  - README contains brief CLI examples

Implementation notes

- Implement CLI argument parsing without adding external dependencies (use process.argv and simple parsing).
- Keep CLI logic thin: delegate core logic to fizzBuzz and fizzBuzzSingle exports.
- E2E tests may use child_process.spawnSync or spawn to execute node and capture stdout/stderr for assertions.

Compatibility

This feature sits on top of FIZZBUZZ_CORE and does not change the core API. It is achievable in a single source file and aligns with the mission to provide a minimal working FizzBuzz library and developer UX.