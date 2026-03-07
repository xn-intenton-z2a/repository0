# FIZZBUZZ_CLI

## Summary
Add a small command-line interface around the core library so users can run fizzbuzz from the terminal. The CLI will be implemented in src/lib/main.js with a lightweight argument parser or as a separate CLI entrypoint that reuses the library functions.

## Goals
- Provide a CLI that accepts a single positional integer or a flag for a range and prints the fizzbuzz output to stdout, one value per line.
- Offer a --json flag to print the array as JSON for machine consumption.
- Ensure CLI reuses library functions and is covered by unit tests or a light integration test.

## Behavior
- Running node src/lib/main.js 15 (or npm run start:cli 15) prints the 15-line fizzbuzz sequence to stdout.
- The CLI should validate inputs similarly to the library: non-integers yield error and exit with non-zero code, negative values print an error and exit non-zero.
- The --json flag prints the result as a JSON array to stdout instead of line-separated output.

## Implementation Notes
- Keep dependencies minimal; prefer built-in process.argv parsing unless an existing lightweight dependency is already present.
- Tests should simulate CLI invocation (spawn or run the node script) and assert stdout and exit codes.

## Acceptance Criteria
- [ ] Running the CLI with 15 prints the same values produced by fizzBuzz(15), one per line.
- [ ] Running the CLI with --json and 15 prints a valid JSON array equal to fizzBuzz(15).
- [ ] Invalid inputs cause a non-zero exit code and print a useful error message to stderr.
- [ ] CLI reuses the library functions; no duplicate business logic.

---

Notes for contributors: add a small test that runs node src/lib/main.js with arguments to verify behavior; avoid adding heavyweight CLI frameworks.