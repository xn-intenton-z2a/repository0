# FIZZBUZZ_TESTS

Summary
Add unit tests to tests/unit/main.test.js that verify all normal and edge-case behaviour of fizzBuzz and fizzBuzzSingle.

Motivation
Tests provide automated verification of the mission acceptance criteria and guard against regressions during future transforms.

Specification
- Test harness
  - Use the existing test runner (vitest) configured in package.json.
  - Put tests in tests/unit/main.test.js so npm test picks them up.

- Required test cases
  - fizzBuzzSingle(3) returns "Fizz".
  - fizzBuzzSingle(5) returns "Buzz".
  - fizzBuzzSingle(15) returns "FizzBuzz".
  - fizzBuzzSingle(7) returns "7".
  - fizzBuzz(15) returns an array of length 15 with correct sequence ending in "FizzBuzz".
  - fizzBuzz(0) returns an empty array.
  - Both functions throw RangeError on negative input (e.g., -1).
  - Both functions throw TypeError on non-integer input (e.g., 3.14 or '3').

Acceptance criteria
- All tests run with npm test and pass locally.
- Tests assert precise return values and thrown error types, not just truthy/falsey.
- Coverage demonstrates the edge cases are exercised.
