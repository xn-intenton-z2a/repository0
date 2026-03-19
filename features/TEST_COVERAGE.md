# TEST_COVERAGE

## Summary
Unit tests required to validate library behavior, edge cases and exports.

## Required tests
- Core behavior tests:
  - fizzBuzz(1), fizzBuzz(3), fizzBuzz(5), fizzBuzz(15) with expected arrays.
  - fizzBuzzSingle for values including 3, 5, 15, 7.
- Edge case tests:
  - fizzBuzz(0) returns empty array.
  - fizzBuzz negative and non-integer inputs throw the correct error types.
  - fizzBuzzSingle invalid inputs throw the correct error types.
- Export tests:
  - src/lib/main.js exports named functions fizzBuzz and fizzBuzzSingle.

## Acceptance criteria
- Tests cover the behaviors above and are runnable with npm test.
- Tests assert exact string values and thrown error types rather than loose truthy checks.
