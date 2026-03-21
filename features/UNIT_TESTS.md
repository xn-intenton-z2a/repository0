# UNIT_TESTS

Summary

Define the unit test coverage required to guard the FizzBuzz library and to meet the mission acceptance criteria.

Specification

- Tests live in tests/unit/main.test.js and run with the repository test script.
- Tests must cover normal sequences, single-value results, and all validation/error cases described in INPUT_VALIDATION.
- Required test cases:
  - fizzBuzz(15) equals the canonical 15-item sequence ending with FizzBuzz.
  - fizzBuzzSingle(3) returns Fizz.
  - fizzBuzzSingle(5) returns Buzz.
  - fizzBuzzSingle(15) returns FizzBuzz.
  - fizzBuzzSingle(7) returns 7.
  - fizzBuzz(0) returns an empty array.
  - Negative inputs throw RangeError.
  - Non-integer numeric inputs throw TypeError.
  - Non-number inputs throw TypeError.
  - Exports are named and importable with ES module import syntax.

Acceptance Criteria

- All unit tests pass when running npm test.
- Tests assert both correct return values and correct error types.
- Test coverage meets the repository's minimal coverage thresholds.

Implementation Notes

- Use Vitest for unit tests. Keep tests deterministic and fast. Assert exact array contents for sequence tests rather than loose string matching.
