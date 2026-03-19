# INPUT_VALIDATION

## Summary
Input validation rules for both fizzBuzz and fizzBuzzSingle to make behaviour deterministic and testable.

## Rules
- For fizzBuzz:
  - n = 0 returns an empty array
  - negative numbers throw RangeError
  - non-integers throw TypeError
- For fizzBuzzSingle:
  - input must be a positive integer (>=1)
  - zero and negative numbers throw RangeError
  - non-integers throw TypeError

## Acceptance criteria
- fizzBuzz(0) returns an empty array.
- fizzBuzz(-1) throws RangeError.
- fizzBuzz(2.5) throws TypeError.
- fizzBuzzSingle(0) throws RangeError.
- fizzBuzzSingle(-3) throws RangeError.
- fizzBuzzSingle(3.14) throws TypeError.
