FIZZBUZZ_CLI

Purpose

Describe an optional CLI feature that demonstrates the library and enables users to run the FizzBuzz generator from the command line.

Description

Add a small CLI entrypoint using the existing start:cli script (node src/lib/main.js) that:

- Accepts a single numeric argument n from process.argv and prints the fizzBuzz output as a comma-separated line.
- Validates the argument using the same rules as the library and exits with a non-zero code on error while printing a helpful message to stderr.
- Defaults to printing fizzBuzz(15) when no argument is provided.

Acceptance criteria

1. CLI behaviour: running node src/lib/main.js 15 prints the 15-item fizzBuzz sequence to stdout.
2. Validation: non-integer or negative input prints an error to stderr and exits with a non-zero status.
3. Default: running node src/lib/main.js with no arguments prints fizzBuzz(15).
4. Demonstration: README includes a short example showing how to run the CLI and sample output.

Notes

This feature is small and optional but helps users interactively verify the library without running tests. Keep CLI logic thin and delegate to the library functions for correctness.