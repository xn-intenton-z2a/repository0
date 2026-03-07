# FIZZBUZZ_CLI

Overview

Add a minimal command-line interface entrypoint that uses the existing library functions to print FizzBuzz sequences. The CLI improves discoverability and makes it easy to run examples locally using npm run start:cli.

Specification

- Implement CLI behaviour inside src/lib/main.js when invoked as a script (node src/lib/main.js).
- CLI accepts a single positional integer argument n and prints one line per value from 1..n using fizzBuzzSingle for each line.
- If no argument is provided, CLI prints usage help and exits with code 1.
- CLI validates input and prints a human-friendly error message on invalid input, exiting with code 2 for validation errors.

Testing

- Add or update tests to exercise the CLI by invoking node src/lib/main.js with child process tests or by factoring CLI logic into an exported function that the tests can call.
- Tests should cover: valid n, n=0, missing argument, non-integer argument, negative argument.

Acceptance Criteria

- Running node src/lib/main.js 5 prints 1, 2, Fizz, 4, Buzz on separate lines.
- Running without args prints usage and exits non-zero.
- Invalid input produces an error message and a non-zero exit code.
- Tests covering CLI logic pass.

Implementation Notes

- Keep CLI implementation minimal and optional: library behaviour must still be available via named exports.
- Prefer factoring parsing and printing into a small helper so unit tests can run without spawning child processes.
- Do not add new dependencies unless strictly necessary.
