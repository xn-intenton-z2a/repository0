# FIZZBUZZ_CLI

## Summary

Provide a small, well-specified command-line interface that wraps the core FizzBuzz library functions to make the library immediately usable from the terminal and to supply an executable example for README and tests.

## Motivation

Consumers and CI maintainers often need a simple way to exercise library behaviour without writing code. A CLI delivers high-impact value: quick verification, examples for README, and an additional integration surface that can be tested in unit/e2e tests.

## Behaviour and API

CLI name: fizzbuzz

Usage:
- fizzbuzz --count N
- fizzbuzz N
- fizzbuzz --single N  (prints single-value output for N)
- fizzbuzz --help

Behavioural rules:
- When invoked with a single integer positional argument N, prints the fizzBuzz(N) array as one item per line to stdout.
- When invoked with --single N (or -s N) prints the single fizzBuzzSingle(N) result to stdout.
- When invoked with --count or positional N equal 0, prints nothing and exits with code 0.
- When N is negative, prints an error message to stderr and exits with non-zero code.
- When N is not an integer, prints an error message to stderr and exits with non-zero code.

Exit codes:
- 0 on success
- 2 on input validation error (non-integer or negative)
- 1 on unexpected runtime error

## Acceptance Criteria

- CLI accepts a positional integer N and prints N lines corresponding to fizzBuzz(N).
- fizzbuzz --single 3 prints Fizz and exits 0.
- fizzbuzz 0 prints nothing and exits 0.
- fizzbuzz -1 prints a descriptive error to stderr and exits with non-zero code.
- Non-integer input (e.g., 2.5 or abc) prints a descriptive error to stderr and exits with non-zero code.
- README documents CLI usage with at least two examples: fizzbuzz 15 and fizzbuzz --single 7.
- Unit or integration tests execute the CLI (or the exported run function) to verify behavior for success and error cases.

## Tests

- Add tests in tests/unit that spawn the CLI script via node and assert stdout, stderr and exit code for cases: 15, 0, --single 3, -1, 2.5.
- Tests should avoid environment side-effects and run cross-platform using Node child_process spawn or exec.

## Implementation Notes

- Implementation should be a thin wrapper that imports named exports fizzBuzz and fizzBuzzSingle from src/lib/main.js and implements argument parsing minimalistically (no new dependencies required).
- Prefer implementing the CLI entry as an exported function (e.g., runCli(argv)) so tests can call it directly; add a small executable stub that calls runCli(process.argv.slice(2)).
- Keep changes limited to a single source file if possible (src/lib/main.js may export runCli) and tests; update README examples accordingly.
- Do not add runtime dependencies; use built-in process and console APIs.

## Related Features

- FIZZBUZZ_CORE: core library behaviour must be preserved and fully supported by the CLI.
