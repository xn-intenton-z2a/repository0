# CLI_TOOL

Summary
Provide a simple CLI interface so users can run FizzBuzz from the command line.

Implementation
- Make src/lib/main.js executable as a CLI when invoked directly:
  - Accept a single positional integer argument n.
  - On valid input print the fizzBuzz(n) result to stdout as JSON or newline-separated values; document the chosen format in README.md.
  - On invalid input print an error message to stderr and exit with non-zero status.
  - Support --help to print usage information.
- Avoid adding external dependencies; keep the CLI implementation minimal and self-contained.

Acceptance Criteria
- [ ] Running node src/lib/main.js 15 prints the expected 15-item fizzbuzz output and exits with status 0
- [ ] Running node src/lib/main.js invalid prints an error to stderr and exits with non-zero status
- [ ] CLI behaviour is documented in README.md

Notes
- The CLI should be an additive convenience layer; core library functions remain pure and are exercised by unit tests.