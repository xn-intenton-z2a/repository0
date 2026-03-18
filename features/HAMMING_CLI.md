# HAMMING_CLI

Status: PARTIALLY_IMPLEMENTED

Purpose
Provide a small, well-tested command-line interface for computing Hamming distances so users can compute distances without writing code. Current implementation supports --version and --identity flags and prints name@version by default; planned enhancements include string and bits subcommands.

Scope
- Current runtime: node src/lib/main.js supports:
  - --version prints version
  - --identity prints JSON identity object (name, version, description)
  - default prints name@version
- Planned features (future):
  - string mode: node src/lib/main.js string <left> <right> outputs Hamming distance by code points
  - bits mode: node src/lib/main.js bits <a> <b> outputs bit-level Hamming distance and exits with non-zero code on invalid input

Behavior and validation
- The CLI must validate inputs and exit with non-zero code on invalid input, printing a concise error to stderr.
- For string mode, unequal code point lengths must cause a non-zero exit and descriptive message.
- For bits mode, negative integers or non-integer numbers must cause a non-zero exit.

Testing
- Add unit tests that call main(args) with argument arrays to verify stdout and stderr output and return value/exit behaviour.
- Tests should verify example cases: string karolin kathrin => prints 3; bits 1 4 => prints 2.

Acceptance Criteria
- Running node src/lib/main.js --version prints the package version to stdout.
- Running node src/lib/main.js --identity prints a JSON object containing name, version, and description.
- Planned (not required yet): node src/lib/main.js string karolin kathrin prints "3" and node src/lib/main.js bits 1 4 prints "2" to stdout and exits successfully.
- Invalid usage prints an error to stderr and results in a non-zero exit/return in tests (for implemented subcommands).
