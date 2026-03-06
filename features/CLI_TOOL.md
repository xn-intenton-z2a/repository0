# CLI_TOOL

Summary

Add a small command-line interface backed by the library to compute Hamming distances from the terminal. The CLI provides an immediate, high-impact way for users to try the library and is realizable within the existing repository structure by extending src/lib/main.js to accept command-line arguments.

Motivation

A CLI increases discoverability and practical usability during development and debugging, making the library easier to demonstrate and verify without writing additional glue code.

Specification

- Add a CLI mode to src/lib/main.js that recognizes invocation patterns:
  - node src/lib/main.js string a b    => prints the Hamming distance between Unicode strings a and b
  - node src/lib/main.js bits x y      => prints the Hamming distance between integers x and y (accepts decimal or BigInt notation with trailing n)
  - node src/lib/main.js --help        => prints usage and examples
- CLI behavior:
  - Validate inputs and print friendly error messages and non-zero exit codes on validation failures.
  - Output only the numeric distance on success to make the tool scriptable.
  - Support BigInt literal parsing when y or x ends with n (e.g., 123n).

Tests and Examples

- Add examples in examples/ demonstrating CLI usage. (E.g., examples/cli-examples.txt)
- Add unit tests that simulate CLI invocation (run node with args) verifying stdout and exit codes for success and error cases.

Acceptance Criteria

- CLI prints 3 for node src/lib/main.js string karolin kathrin
- CLI prints 2 for node src/lib/main.js bits 1 4
- CLI supports BigInt literals: node src/lib/main.js bits 1n 4n prints 2
- CLI --help prints usage and exits 0

Notes

- Implementation will keep library functions pure and place only argument parsing and process I/O in main script path.
- Update README.md examples to include a short CLI snippet.
