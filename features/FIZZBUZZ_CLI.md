# FIZZBUZZ_CLI

## Summary

Add a minimal command-line interface for the FizzBuzz library so end users can run fizzBuzz and fizzBuzzSingle from the terminal. The CLI is small, low-risk, and complements the existing library API feature by making the functions demonstrable without writing JavaScript code.

## Motivation

The mission is a JavaScript library exporting FizzBuzz functions. A tiny CLI increases the library's accessibility for humans exploring the behaviour and supports the existing start:cli npm script. It also provides a simple integration point for examples and a deterministic output format suitable for unit tests and CI.

## Specification

1. Feature name
   - FIZZBUZZ_CLI

2. Scope
   - Implement a CLI entrypoint in src/lib/main.js that can be invoked with node src/lib/main.js or via npm run start:cli.
   - The CLI must not remove or alter the existing named exports fizzBuzz and fizzBuzzSingle; it only adds a small CLI invocation path when the module is executed directly.

3. Behaviour
   - When run with no arguments, print a short usage help describing the commands and exit with status 0.
   - Supported commands:
     - single <n>
       - Print the fizzBuzzSingle result for integer n to standard output followed by a newline.
     - list <n>
       - Print the fizzBuzz array for 1..n, one element per line, to standard output.
   - Input validation mirrors the library API:
     - Non-integer arguments cause the CLI to print a TypeError-like message to stderr and exit with status 2.
     - Non-positive numbers for single cause a RangeError-like message to stderr and exit with status 3.
     - For list 0, the CLI prints nothing and exits with status 0.
   - Exit codes:
     - 0 for successful execution or when printing usage
     - 2 for TypeError input
     - 3 for RangeError input
     - 1 for unexpected internal errors

4. Tests
   - Unit tests added to tests/unit/ should import the library functions directly to validate API behaviour; separate small tests should simulate command invocation by running node on src/lib/main.js with child_process.spawnSync or an equivalent test helper to verify:
     - Running node src/lib/main.js single 3 prints Fizz and exits 0
     - Running node src/lib/main.js list 5 prints five lines and includes Buzz and Fizz appropriately, exits 0
     - Running node src/lib/main.js single 2 prints 2 and exits 0
     - Running node src/lib/main.js single foo exits with code 2 and prints a TypeError-like message to stderr
     - Running node src/lib/main.js single 0 exits with code 3 and prints a RangeError-like message to stderr
   - Tests must avoid flakiness by using synchronous child process invocation and asserting exact stdout/stderr strings where appropriate.

5. Documentation
   - Update README.md examples section to show CLI usage examples for both single and list commands and explain exit codes.
   - Keep examples small and copy-paste ready.

## Acceptance Criteria

- The repository exposes a documented CLI flow in README.md and a feature file describing the expectations.
- Tests verify CLI behaviour for successful runs and input validation failure modes.
- The CLI does not change the existing API; named exports fizzBuzz and fizzBuzzSingle remain available for programmatic use.

## Notes

- Implementation changes are limited to src/lib/main.js (add a small guard if (import.meta.url === process.argv[1] or similar) or Node's recommended check) and unit tests and README examples.
- Keep the CLI behaviour deterministic and minimal to ease testing and review.