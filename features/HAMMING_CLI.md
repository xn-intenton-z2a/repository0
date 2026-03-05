# HAMMING_CLI

## Overview

Add a small, single-file command-line interface that invokes the hammingDistance and hammingDistanceBits functions exported by src/lib/main.js. The CLI should be implemented in the same source file used by the library (src/lib/main.js) or call those named exports, accept command-line arguments, and return human-readable output and proper exit codes so it can be used in scripts and examples.

## Motivation

Many users want a quick way to compute Hamming distances from the terminal or within shell scripts. A tiny CLI unlocks scripting, examples, and manual verification without adding a separate package or complex infrastructure.

## Behavior

- CLI command: node src/lib/main.js cli string a b
  - Computes hammingDistance(a, b) and prints the numeric result followed by a newline.
  - Returns exit code 0 on success.
  - Prints a descriptive error message to stderr and returns a non-zero exit code on validation errors.

- CLI command: node src/lib/main.js cli bits x y
  - Computes hammingDistanceBits(x, y) and prints the numeric result followed by a newline.
  - x and y parsed as base-10 integers; validation follows library rules (integers, non-negative).

- Help: node src/lib/main.js --help or node src/lib/main.js help
  - Prints short usage examples and descriptions for both subcommands.

## Input validation and errors

- Errors from library functions must be forwarded as user-friendly messages on stderr.
- Exit code 2 for usage/validation errors, exit code 1 for unexpected runtime errors.

## Tests and Acceptance Criteria

- Running node src/lib/main.js cli string karolin kathrin writes "3\n" to stdout and exits with code 0.
- Running node src/lib/main.js cli string "" "" writes "0\n" to stdout and exits with code 0.
- Running node src/lib/main.js cli string a bb writes an error to stderr and exits with code 2.
- Running node src/lib/main.js cli bits 1 4 writes "2\n" to stdout and exits with code 0.
- Running node src/lib/main.js --help prints usage content to stdout and exits with code 0.

## Implementation notes

- Keep the CLI parsing minimal and dependency-free: use process.argv parsing.
- Reuse the exported functions from src/lib/main.js rather than reimplementing logic.
- Ensure stdout uses console.log and stderr uses console.error.
- Add simple integration tests under tests/unit that spawn node and assert stdout/stderr and exit code.

## Files to modify

- src/lib/main.js: add a minimal CLI entrypoint when invoked with matching argv values.
- tests/unit/main.test.js: add CLI integration tests (spawn/child_process assertions).
- README.md: add CLI usage examples and show expected outputs.

## Acceptance criteria (formal)

1. CLI subcommands are available as specified and documented in README.
2. Integration tests for the CLI described above are present and pass.
3. CLI forwards validation errors and returns the specified exit codes.