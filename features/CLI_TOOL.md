# CLI_TOOL

Summary

Add a small, well-documented CLI mode to src/lib/main.js so the library can be exercised from the command line for manual verification and demos.

Specification

- The CLI accepts a single positional argument that is parsed as an integer.
- On valid input, the CLI prints the sequence 1..n with substitutions line by line to stdout and exits with code 0.
- On invalid input, the CLI prints a concise error message to stderr and exits with a non-zero code.
- The CLI behaviour must reuse the same library functions (import fizzBuzz/fizzBuzzSingle) so tests and CLI share logic.

Acceptance Criteria

- Running node src/lib/main.js 5 prints five lines: 1, 2, Fizz, 4, Buzz and exits 0.
- Running node src/lib/main.js foo prints an error to stderr and exits non-zero.
- CLI code is covered by unit tests where practical (for example by invoking the module programmatically) and documented in the README.

Implementation Notes

- Keep the CLI minimal and rely on process.argv parsing and process.exit codes. Reuse library functions rather than duplicating logic.
