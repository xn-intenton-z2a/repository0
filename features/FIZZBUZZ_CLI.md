# FIZZBUZZ_CLI

## Summary
Add a minimal CLI entrypoint that demonstrates library usage and helps reviewers run quick manual checks. The CLI is optional for automated tests but valuable for manual verification in the browser demo or docs.

## Behavior
- The CLI is invoked via node src/lib/main.js and accepts a single integer argument n.
- When provided a valid positive integer print the fizzBuzz(n) array as JSON to stdout.
- When provided 0 print an empty JSON array.
- When provided invalid input print a helpful error message and exit with non-zero status.

## Acceptance Criteria
- Running node src/lib/main.js 15 prints JSON of the 15-element fizzBuzz result to stdout.
- Running node src/lib/main.js 0 prints an empty JSON array.
- Invalid inputs cause a non-zero exit code and a concise error message to stderr.

## Notes
The CLI must not duplicate library logic; it should import fizzBuzz and fizzBuzzSingle from src/lib/main.js and use them. Keep the CLI file minimal and testable.