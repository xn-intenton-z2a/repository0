# FIZZBUZZ_IMPLEMENTATION

Purpose

Provide a single, actionable feature specification that drives the repository to implement the mission: a minimal JavaScript library that exports two named functions, a CLI entrypoint, a tiny web demo integration, and comprehensive unit tests that validate normal and edge behaviour.

Specification

- Export two named functions from src/lib/main.js: fizzBuzz and fizzBuzzSingle.
- fizzBuzz(n) returns an array of strings for integers 1..n using the classic Fizz/Buzz/FizzBuzz rules.
- fizzBuzzSingle(n) returns the single string result for the integer n using the same rules.
- Input validation rules:
  - If n is 0, fizzBuzz returns an empty array.
  - Negative integers throw RangeError (message must include the word range or negative).
  - Non-integers (including floats with fractional part) and non-number inputs throw TypeError.
  - Functions must not mutate inputs or rely on external state.

API

- Named exports: fizzBuzz, fizzBuzzSingle
- The module should remain usable in Node (require/import) and browser ESM environments.

CLI integration

- The repository's existing CLI (node src/lib/main.js) should be extended or refactored to use the exported fizzBuzz/fizzBuzzSingle functions when invoked with a numeric argument.
- CLI behaviour:
  - node src/lib/main.js <n> prints each line of fizzBuzz(n) joined by newlines to stdout.
  - node src/lib/main.js with no args prints a short usage line and the fizzBuzz(15) demo output.
  - Invalid input prints a brief human error to stderr and exits with non-zero status.

Web demo

- The existing web example should import the library and render fizzBuzz(15) as a visible list.
- The demo must include a numeric input and a button that recomputes the list in-place and shows inline validation errors for bad input.

Tests

- Add or update unit tests in tests/unit covering:
  - fizzBuzz(15) returns array length 15 with fifteenth element equal to FizzBuzz.
  - fizzBuzzSingle(3) === Fizz, fizzBuzzSingle(5) === Buzz, fizzBuzzSingle(15) === FizzBuzz, fizzBuzzSingle(7) === "7".
  - fizzBuzz(0) returns an empty array.
  - Negative inputs throw RangeError.
  - Non-integers and non-number inputs throw TypeError for both functions.
  - CLI tests that exercise process.argv invocation and verify correct stdout/stderr behaviour for valid and invalid inputs.

Acceptance Criteria

- The package exports named functions fizzBuzz and fizzBuzzSingle from src/lib/main.js.
- fizzBuzz(15) returns the expected 15-element array ending with FizzBuzz.
- fizzBuzzSingle(3) returns Fizz; fizzBuzzSingle(5) returns Buzz; fizzBuzzSingle(15) returns FizzBuzz; fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns [] and negative inputs raise RangeError; non-integers raise TypeError.
- The CLI prints fizzBuzz(n) results for a numeric argument and demonstrates fizzBuzz(15) when run without arguments; invalid input exits with non-zero status.
- The web demo displays fizzBuzz(15) and allows recomputing from an input with inline validation.
- Unit tests exist in tests/unit and cover the listed behaviours.

Notes

- Keep changes minimal and surgical: prefer adding a compact implementation and tests rather than large refactors.
- Avoid introducing new runtime dependencies.
