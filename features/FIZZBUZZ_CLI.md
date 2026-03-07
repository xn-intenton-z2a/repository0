# FIZZBUZZ_CLI

Overview

Add a minimal command-line interface entrypoint that uses the existing library functions to print FizzBuzz sequences. The CLI improves discoverability and makes it easy to run examples locally using npm run start:cli.

Specification

- Implement CLI behaviour inside src/lib/main.js when invoked as a script (node src/lib/main.js) or factor CLI logic into an exported helper so tests can call it directly.
- CLI accepts a single positional integer argument n and prints one line per value from 1..n using fizzBuzzSingle for each line.
- If no argument is provided, CLI prints usage help to stderr and exits with code 1.
- CLI validates input and prints a human-friendly error message to stderr on invalid input, exiting with code 2 for validation errors.
- Keep CLI implementation minimal and non-invasive to the library API (library functions remain named exports).

Testing

- Add or update tests to exercise CLI logic by calling the exported parsing/printing helper directly from unit tests; spawning child processes is allowed but not required.
- Tests should cover: valid n, n=0 (prints nothing and exits 0), missing argument (prints usage & non-zero exit), non-integer argument (error & non-zero exit), negative argument (error & non-zero exit).

Acceptance Criteria

- Running node src/lib/main.js 5 prints 1, 2, Fizz, 4, Buzz each on separate lines.
- Running without args prints usage help to stderr and exits with a non-zero code.
- Invalid input produces an error message to stderr and exit code 2.
- Tests covering CLI logic pass.

Implementation Notes

- Factor parsing & output into a small exported helper so tests can call it without spawning child processes.
- Do not add new runtime dependencies for the CLI.
- Use process.exit codes as specified for integration tests when necessary, but prefer returning status codes from helpers for unit tests.
