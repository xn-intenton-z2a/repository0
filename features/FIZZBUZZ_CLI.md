FIZZBUZZ_CLI

Purpose

Provide a minimal command-line interface that demonstrates and exercises the library functions so users can run FizzBuzz from a terminal.

Description

Add a small CLI entrypoint using the existing start:cli script (node src/lib/main.js) that:

- Accepts a single numeric argument n from process.argv and prints the fizzBuzz output as a comma-separated single line to stdout.
- Validates the argument using the same rules as the library and prints a concise error to stderr with a non-zero exit code on invalid input.
- Defaults to printing fizzBuzz(15) when no argument is provided.
- Delegates all FizzBuzz logic to the library exports (do not reimplement rules in the CLI).

Acceptance criteria

1. CLI behaviour: running node src/lib/main.js 15 prints the 15-item fizzBuzz sequence to stdout as a single comma-separated line and exits with status 0.
2. Validation: running node src/lib/main.js -3 or node src/lib/main.js 3.5 prints a human-readable error message to stderr and exits with a non-zero status.
3. Default: running node src/lib/main.js with no arguments prints fizzBuzz(15) to stdout and exits with status 0.
4. Documentation: README includes a short example demonstrating the CLI usage and sample output.

Notes

Keep the CLI surface minimal: parse arguments, call library functions, and handle process exit codes and messages. Unit tests may stub process.argv and inspect stdout/stderr where applicable.