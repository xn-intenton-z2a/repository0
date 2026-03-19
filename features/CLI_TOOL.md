# CLI_TOOL

## Summary
A small CLI wrapper around the library to run FizzBuzz from the command line for quick manual checks and demos.

## Behavior
- Executable: node src/lib/main.js invoked directly or via npm run start:cli.
- Accept a single positional integer argument n. If omitted, read from stdin or display usage.
- Option --json outputs the full array as JSON to stdout. Default prints one result per line.
- Invalid input prints an error to stderr and exits with non-zero code.

## Acceptance criteria
- Running node src/lib/main.js 15 prints 15 lines corresponding to fizzBuzz(15) to stdout and exits with code 0.
- Running node src/lib/main.js 15 --json prints a JSON array to stdout matching fizzBuzz(15).
- Running node src/lib/main.js -1 prints a concise error message to stderr and exits with non-zero code.
