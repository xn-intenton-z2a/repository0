# FIZZBUZZ_CLI

## Summary
Add a minimal CLI entrypoint that demonstrates library usage and helps reviewers run quick manual checks. The CLI is optional for automated tests but valuable for manual verification in the browser demo or docs.

## Behavior
- The CLI is invoked via node src/lib/main.js and accepts a single integer argument n.
- The CLI must import fizzBuzz and fizzBuzzSingle from src/lib/main.js and use those exports rather than reimplementing logic.
- When provided a valid positive integer print the fizzBuzz(n) array as JSON to stdout and exit with code 0.
- When provided 0 print an empty JSON array and exit with code 0.
- When provided invalid input print a concise, user-friendly error message to stderr and exit with non-zero status (exit code 1).

## Acceptance Criteria
- Running node src/lib/main.js 15 prints JSON of the 15-element fizzBuzz result to stdout and exits 0.
- Running node src/lib/main.js 0 prints an empty JSON array to stdout and exits 0.
- Invalid inputs (non-integer, missing argument, negative) print an error message to stderr and exit with code 1.
- The CLI imports fizzBuzz and fizzBuzzSingle from src/lib/main.js (no duplicate logic in the CLI file).

## Notes
Keep the CLI file minimal and testable. Prefer JSON output for easy machine verification.