# HAMMING_CLI

## Summary

Add a lightweight command-line interface that exposes the library's Hamming distance functions for quick interactive use and scripting. The CLI invokes the same library code exported from src/lib/main.js so the API surface remains single-sourced and unit-testable.

## Motivation

Consumers often want a quick way to compute Hamming distances from the terminal or incorporate the tool into shell pipelines. A focused CLI improves discoverability, enables simple automation, and provides an executable example of the library API.

## Scope

Update or implement the library entrypoint to also function as a CLI; update unit tests and README examples. Changes are limited to:
- src/lib/main.js: add minimal CLI argument parsing and a --help output while keeping named exports intact
- tests/unit/main.test.js (or a new tests/unit/cli.test.js): add tests that exercise the CLI by forking child_process.exec or invoking the module programmatically
- README.md: add a short section showing CLI usage
- package.json: reuse the existing start:cli script; no dependency changes expected

## Behaviour specification

- Invocation:
  - node src/lib/main.js string a b  => prints the Hamming distance between a and b (string mode)
  - node src/lib/main.js bits x y   => prints the Hamming distance in bits between integers x and y (bits mode)
  - node src/lib/main.js --help     => prints usage summary and exits 0

- Input validation and exit codes:
  - When invoked with string mode, if either argument is missing or not a string, print an error to stderr and exit 2
  - When string lengths (in Unicode code points) differ, print an error to stderr and exit 3
  - When invoked with bits mode, if arguments are not non-negative integers, print an error to stderr and exit 2
  - On success, print only the integer result to stdout and exit 0

- Implementation notes:
  - Use the exported hammingDistance and hammingDistanceBits functions internally rather than duplicating logic
  - CLI must not alter exports: named exports remain available for programmatic use
  - Keep parsing minimal (no new dependencies); use process.argv slicing and simple integer parsing

## Testing and acceptance criteria

- Running node src/lib/main.js string karolin kathrin prints 3 and exits 0
- Running node src/lib/main.js string "" "" prints 0 and exits 0
- Running node src/lib/main.js string a bb exits with code 3 (unequal lengths) and prints a descriptive error to stderr
- Running node src/lib/main.js bits 1 4 prints 2 and exits 0
- Running node src/lib/main.js --help prints usage information and exits 0
- Unit tests programmatically exercising the CLI must be added or adapted to assert exit codes and stdout/stderr

## Deliverables

- features/HAMMING_CLI.md (this file)
- Implementation guidance for a small CLI in src/lib/main.js, tests and README examples

## Notes

Keep the CLI minimal and dependency-free so it is easy to test and maintain. Use existing package.json start:cli script for manual testing.