# FIZZBUZZ_CLI

## Summary
Add a minimal CLI entrypoint that demonstrates library usage and enables quick manual verification. The CLI must reuse the library exports and be machine-friendly for tests and scripts.

## Behavior
- The CLI is invoked via node src/lib/main.js and accepts a single integer argument n (or reads from stdin if no argument provided).
- The CLI must import fizzBuzz and fizzBuzzSingle from src/lib/main.js and must not reimplement FizzBuzz logic.
- When provided a valid positive integer print the fizzBuzz(n) array as JSON to stdout and exit with code 0.
- When provided 0 print an empty JSON array and exit with code 0.
- When provided invalid input print a concise, user-friendly error message to stderr and exit with non-zero status (exit code 1).
- When invoked with --single <n> print fizzBuzzSingle(n) as a single line string.

## Acceptance Criteria (testable)
- Running node src/lib/main.js 15 prints the JSON array of length 15 to stdout and exits with code 0.
- Running node src/lib/main.js 0 prints [] to stdout and exits 0.
- Running node src/lib/main.js --single 3 prints "Fizz" and exits 0.
- Invalid inputs (non-integer, missing argument when required, negative) print an error to stderr and exit with code 1.
- The CLI imports fizzBuzz and fizzBuzzSingle from src/lib/main.js (no duplicate logic in the CLI file).

## Notes
Prefer JSON output for automated verification. Keep the CLI file minimal and focused on argument parsing and output formatting.