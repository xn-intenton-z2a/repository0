# CLI_TOOL

Summary

Add a minimal command-line interface to src/lib/main.js so users can run node src/lib/main.js <n> to print the fizzBuzz output for a given n.

Specification

- When invoked with a single integer argument n the CLI prints the fizzBuzz(n) result to stdout in JSON format and exits with code 0.
- When invoked with invalid input the CLI prints an error message to stderr and exits with a non-zero code.
- The package.json already contains a start:cli script; ensure the implementation honours that script.

Acceptance Criteria

- [ ] node src/lib/main.js 15 prints the JSON array equivalent to fizzBuzz(15) and exits 0.
- [ ] node src/lib/main.js 0 prints [] and exits 0.
- [ ] node src/lib/main.js -1 prints an error to stderr and exits with non-zero status.
- [ ] CLI behaviour is documented in README.md under CLI usage.
