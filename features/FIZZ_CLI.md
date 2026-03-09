# FIZZ_CLI

## Summary

Add a small, well-scoped CLI feature that exposes the library's fizzBuzzSingle and fizzBuzz functionality from the command line for quick manual verification and demos. The CLI is optional for automated pipelines but provides a convenient developer experience and website demo wiring.

## Goals

- Provide a command-line entrypoint that can be invoked with node and accepts a numeric argument:
  - node src/lib/main.js fizz-single 7  should print the fizzBuzzSingle output for 7 to stdout.
  - node src/lib/main.js fizz 15 should print the full fizzBuzz(15) sequence as one-per-line to stdout.
- Accept flags:
  - --json to emit JSON array for fizz command
  - --help to print usage and exit 0
- Exit codes:
  - 0 on success
  - 2 for input validation errors (non-number / non-integer)
  - 3 for range errors (negative numbers)
- Keep CLI logic minimal and delegate core behaviour to the exported functions in src/lib/main.js so unit tests can import the library directly.

## Acceptance criteria

1. CLI supports commands fizz and fizz-single and respects the rules and validations defined in FIZZ_BUZZ.
2. CLI prints expected outputs to stdout and returns documented exit codes for error cases.
3. Unit tests cover parsing and exit-code behaviour by invoking the module programmatically (no heavy integration required).
4. README includes a short CLI usage example.

## Implementation notes

- Implement CLI by adding a small argument-parsing block to src/lib/main.js (or a thin wrapper) that runs only when the file is executed as a script (if (import.meta.main) style or checking process.argv).
- Keep parsing logic simple; prefer explicit checks over external libraries.
- Tests for the CLI should be lightweight and exercise the mapping from argv to function calls and expected outputs/exit codes.

## Files to change

- src/lib/main.js — add a minimal, testable CLI entrypoint that reuses exported functions.
- tests/unit/cli.test.js — small unit tests for argument parsing and exit-code decisions.
- README.md — append a single-line CLI usage example.

## Notes for reviewers

- Ensure the CLI is thin and delegates to the library functions; CLI behaviour must not duplicate core logic.
- Prefer readability and predictable exit codes; do not introduce additional dependencies for argument parsing.
