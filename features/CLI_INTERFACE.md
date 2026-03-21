# CLI_INTERFACE

Summary
Document the command-line interface for the library so reviewers can run the CLI and verify outputs.

Behavior
- The CLI accepts a single positional argument n and validates it using Number.isInteger semantics. If n is not an integer the CLI must write the exact message n must be an integer to standard error and exit with a non-zero code. If n is a negative integer the CLI must write the exact message n must be >= 0 to standard error and exit with a non-zero code. For valid n the CLI writes a JSON object to standard output with the following top-level keys: identity, fizzBuzzN and fizzBuzzSingleN where fizzBuzzN is the array returned by fizzBuzz(n) and fizzBuzzSingleN is the string returned by fizzBuzzSingle(n). The CLI must exit with code 0 on success.

Acceptance criteria
- [ ] Running npm run start:cli 15 prints valid JSON to stdout containing a key fizzBuzz15 whose last element equals FizzBuzz
- [ ] Running npm run start:cli with a non-integer argument exits non-zero and writes the exact message n must be an integer to stderr
- [ ] Running npm run start:cli with a negative integer exits non-zero and writes the exact message n must be >= 0 to stderr
