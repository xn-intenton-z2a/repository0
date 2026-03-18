# HAMMING_CLI

Status: PARTIALLY_IMPLEMENTED — core flags work; subcommands string and bits are specified and must be implemented and tested.

Purpose
Provide a small, well-specified command-line interface so users can compute Hamming distances without writing code. The CLI must be scriptable (machine-friendly outputs) and validate inputs with clear exit codes and stderr messages.

Scope
- Exposed entrypoint: node src/lib/main.js (kept simple so tests can spawn the process or call an exported main function with argv).
- Supported modes and flags:
  - --version: print the package version and exit 0.
  - --identity: print a JSON object with keys name, version, description and exit 0.
  - string <left> <right>: compute Hamming distance by Unicode code points between two equal-length strings and print the integer result to stdout and exit 0 on success.
  - bits <a> <b>: compute integer Hamming distance (Number or BigInt) and print the integer result to stdout and exit 0 on success. Mixing Number and BigInt is allowed.

Behavior and validation
- All normal outputs are written to stdout as plain integers or JSON; errors are written to stderr with a short human message.
- Exit codes: 0 for success, non-zero for any error. Tests may assert non-zero but should not rely on a specific error code value.
- For string mode: if either argument is not provided, or the code-point lengths differ, print an error to stderr and exit non-zero.
- For bits mode: if values are negative, non-integer, or otherwise invalid, print an error to stderr and exit non-zero.

Examples (machine-friendly assertions)
- Running node src/lib/main.js --version prints the version string to stdout (for example: 0.1.0) and exits 0.
- Running node src/lib/main.js --identity prints a single-line JSON object with keys name, version, and description to stdout and exits 0.
- Running node src/lib/main.js string karolin kathrin prints 3 to stdout (followed by newline) and exits 0.
- Running node src/lib/main.js bits 1 4 prints 2 to stdout and exits 0.
- Running node src/lib/main.js string a bc prints an error to stderr and exits non-zero.
- Running node src/lib/main.js bits -1 2 prints an error to stderr and exits non-zero.

Testing
- Add tests in tests/unit/cli.test.js (or augment existing main tests) that spawn node src/lib/main.js with argv arrays and assert stdout, stderr, and exit behaviour for the examples above.
- Tests should not depend on specific platform line endings; assert integer contents and JSON object keys where appropriate.

Acceptance Criteria
- --version prints the package version to stdout and exits 0.
- --identity prints a JSON object containing name, version, and description to stdout and exits 0.
- string subcommand with inputs karolin and kathrin prints 3 to stdout and exits 0.
- bits subcommand with inputs 1 and 4 prints 2 to stdout and exits 0.
- Invalid usages for both subcommands print an error to stderr and exit non-zero and are covered by unit tests.

Notes
- Keep the CLI surface minimal and easy to test; preferred test approach is spawning the Node process and checking outputs rather than complex integration harnesses.
