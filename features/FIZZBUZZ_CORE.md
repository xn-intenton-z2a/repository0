# FIZZBUZZ_CORE

Overview

Provide the canonical implementation of the FizzBuzz library core functions in src/lib/main.js and comprehensive unit tests. This feature ensures the library meets the mission: simple, well-tested, and correctly exported FizzBuzz functions.

Specification

- Exports: named exports fizzBuzz and fizzBuzzSingle from src/lib/main.js.
- fizzBuzz(n): returns an array of strings for integers 1..n applying traditional FizzBuzz rules.
  - If n is 0, return an empty array.
  - If n is negative, throw a RangeError.
  - If n is not an integer, throw a TypeError.
- fizzBuzzSingle(n): returns the single FizzBuzz string for a positive integer n with the same validation rules.

Testing

- Add or update tests in tests/unit to fully cover normal behaviour and edge cases: small n values, multiples of 3/5/15, n=0, negative n, non-integer inputs.
- Tests should assert exact string values and thrown error types, not just truthy/falsy conditions.

Acceptance Criteria

- fizzBuzz(15) returns the correct 15-element array ending with FizzBuzz.
- fizzBuzzSingle(3) returns Fizz.
- fizzBuzzSingle(5) returns Buzz.
- fizzBuzzSingle(15) returns FizzBuzz.
- fizzBuzzSingle(7) returns 7.
- fizzBuzz(0) returns an empty array.
- Negative inputs throw RangeError.
- Non-integer inputs throw TypeError.
- All unit tests pass with npm test.

Implementation Notes

- Make the smallest possible change to src/lib/main.js to implement behaviour.
- Keep code simple and idiomatic JavaScript; avoid side effects.
- Ensure exports are named and match package.json main entry.
- Update README examples to demonstrate both functions if not already present.
