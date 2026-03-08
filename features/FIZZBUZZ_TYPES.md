# FIZZBUZZ_STATS

# Summary

Introduce a focused, testable stats helper that analyses canonical fizzBuzz output and returns precise occurrence counts for Fizz, Buzz, FizzBuzz and numeric entries. This additive feature provides a small library helper, unit tests and README documentation so consumers can inspect distribution of results without reimplementing replacement logic.

# Specification

- New named export: fizzBuzzStats(n)
  - Signature: fizzBuzzStats(n)
  - Returns: an object with numeric properties: fizz, buzz, fizzBuzz, numbers, total
  - Behaviour: counts reflect the canonical fizzBuzz output for the sequence 1..n. total equals n. numbers counts entries that are not Fizz, Buzz or FizzBuzz.

- Validation: reuse the library's canonical validation for n. If n is invalid the same error type and message substrings used across the project must be thrown (for example, non-integers or NaN cause TypeError or RangeError per the repository contract; negative values cause RangeError with message including >= 1). For n = 0 the helper returns all counts zero and total 0.

- Implementation constraints:
  - Implement fizzBuzzStats as a thin wrapper that calls fizzBuzz(n) and iterates the returned sequence to compute counts; do not reimplement the divisibility logic separately to avoid drift from the canonical outputs.
  - Keep the runtime implementation synchronous and free of external dependencies.
  - Export fizzBuzzStats as a named export from src/lib/main.js alongside existing named exports.

# Examples (plain text)

- fizzBuzzStats(15) => { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }
- fizzBuzzStats(0) => { fizz: 0, buzz: 0, fizzBuzz: 0, numbers: 0, total: 0 }

# Acceptance criteria

- fizzBuzzStats(15) returns an object with values fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15.
- fizzBuzzStats(0) returns all zeros and total 0.
- Calling fizzBuzzStats with invalid n follows the canonical validation behaviour and throws the same error types and contains the same diagnostic substrings as other fizzBuzz helpers (for example use assertions that check error type and message substrings like integer or >= 1 rather than matching whole messages).
- fizzBuzzStats is exported as a named export in src/lib/main.js and is imported in tests and README examples where appropriate.

# Testing guidance

- Unit tests (tests/unit/):
  - Add a test that imports fizzBuzzStats from src/lib/main.js and asserts the exact object returned for n = 15 matches the expected counts.
  - Add tests for edge cases: n = 0 returns zeros; n = 1 returns fizz:0,buzz:0,fizzBuzz:0,numbers:1,total:1.
  - Add validation tests using the same invalid inputs used elsewhere: non-number, non-integer, NaN, Infinity, and negative integers, asserting the same error type and substring behaviour required by FIZZBUZZ_VALIDATION.

- README update:
  - Add a brief plain-text example showing fizzBuzzStats(15) and the expected return object. Keep the example inline and non-escaped so it is easy for readers and for tests that may copy examples verbatim.

- Behaviour tests / web demo:
  - Optionally show the counts in the web demo results area when a user renders fizzBuzz(15); the demo should call fizzBuzzStats to compute and display counts rather than duplicating logic.

# Implementation notes

- Centralise validation by reusing the existing validation helper or the canonical fizzBuzz entry point so message texts remain consistent with other functions and tests.
- Use a simple loop over the array returned by fizzBuzz(n) to compute counts; this keeps the stats helper trivially correct and cheap to implement.
- Keep the helper code small and well-commented with a JSDoc block describing parameters, return shape and thrown errors so tests can rely on documented substrings.

# Backwards compatibility

- Adding fizzBuzzStats is strictly additive and must not change the behaviour, exports or error messages of existing functions.

