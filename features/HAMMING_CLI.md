# HAMMING_CLI

Status: PARTIALLY_IMPLEMENTED

Purpose
Provide a concise, scriptable command-line interface that exposes the library functionality so users can compute Hamming distances without writing code. CLI output must be machine-friendly for tests and scripts.

Scope
- Entrypoint: node src/lib/main.js or a small wrapper that calls exported functions with argv.
- Supported flags and subcommands:
  - --version: print the package version and exit 0
  - --identity: print a single-line JSON object with keys name, version, description and exit 0
  - string <left> <right>: compute Unicode-aware Hamming distance between two equal-length strings and print integer result to stdout
  - bits <a> <b>: compute integer Hamming distance (Number or BigInt) and print integer result to stdout

Behavior and validation
- Normal outputs are written to stdout; errors are written to stderr with short human messages.
- Exit codes: 0 for success, non-zero for errors.
- For string mode: missing arguments or differing code-point lengths write an error to stderr and exit non-zero.
- For bits mode: negative or non-integer values write an error to stderr and exit non-zero.

Testing
- Add or expand unit tests that spawn node src/lib/main.js with argument arrays and assert stdout content and exit status.

Acceptance Criteria
- --version prints the package version to stdout and exits 0
- --identity prints a single-line JSON object with keys name, version, description and exits 0
- string subcommand with inputs karolin and kathrin prints 3 to stdout and exits 0
- bits subcommand with inputs 1 and 4 prints 2 to stdout and exits 0
- Invalid usages for both subcommands print an error to stderr and exit non-zero and are covered by unit tests

Notes
- Keep the CLI surface minimal and easy to test; tests should not depend on exact platform line endings and should parse outputs by content.
