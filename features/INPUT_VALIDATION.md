# INPUT_VALIDATION

Summary

Status: Implemented.

Input validation for both fizzBuzz and fizzBuzzSingle is implemented in src/lib/main.js via a shared helper. Behaviour includes TypeError for non-number or non-integer inputs, and RangeError for negative values. fizzBuzzSingle intentionally treats zero as invalid (RangeError) while fizzBuzz(0) returns an empty array.

Evidence

- Implementation: validateIntegerInput helper in src/lib/main.js and calls from fizzBuzz and fizzBuzzSingle.
- Tests: tests/unit/fizzbuzz.test.js asserts TypeError and RangeError behaviours for invalid inputs and fizzBuzz(0).

Acceptance criteria (met)

- Non-number input throws TypeError.
- Non-integer numeric input throws TypeError.
- Negative integers throw RangeError.
- fizzBuzz(0) returns an empty array.

Notes

This feature is pruned from the active backlog because validation and tests are present.