# HAMMING_CLI

Purpose
Provide a small, well-tested command-line interface for computing Hamming distances so users can compute distances without writing code.

Scope
- Add a CLI subcommand to src/lib/main.js (or a thin wrapper) that supports two subcommands: string and bits.
- string mode: node src/lib/main.js string <left> <right>
  - Compares two Unicode strings by code points and prints the numeric Hamming distance to stdout.
- bits mode: node src/lib/main.js bits <a> <b>
  - Accepts non-negative integers (decimal or BigInt literal with trailing n when supported) and prints the numeric bit-level distance.
- Flags: --help prints usage; --version remains supported.

Behavior and validation
- The CLI must validate inputs and exit with non-zero code on invalid input, printing a concise error to stderr.
- For string mode, unequal code point lengths must cause a non-zero exit and descriptive message.
- For bits mode, negative integers or non-integer numbers must cause a non-zero exit.

Testing
- Add unit tests that call main(args) with argument arrays to verify stdout and stderr output and return value/exit behaviour.
- Tests should verify example cases: string karolin kathrin => prints 3; bits 1 4 => prints 2.

Acceptance Criteria
- Running node src/lib/main.js string karolin kathrin prints "3" to stdout and exits successfully.
- Running node src/lib/main.js bits 1 4 prints "2" to stdout and exits successfully.
- Invalid usage prints an error to stderr and results in a non-zero exit/return in tests.
