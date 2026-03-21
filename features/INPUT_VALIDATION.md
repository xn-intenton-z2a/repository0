# INPUT_VALIDATION

## Summary

Define and enforce input validation rules for both fizzBuzz and fizzBuzzSingle so their behaviour is deterministic and easily unit-tested.

## Specification

- Both functions validate arguments synchronously and throw immediately on invalid input.
- Accept only numbers; reject other types with TypeError.
- Accept only integers where integer semantics are required; non-integer numbers should raise TypeError.
- Negative integers should raise RangeError.
- Zero is allowed for fizzBuzz (returns empty array) and is invalid for fizzBuzzSingle (RangeError if single values must be positive).

## Acceptance criteria

- Calling fizzBuzz(0) returns an empty array.
- Calling fizzBuzz(-1) throws a RangeError.
- Calling fizzBuzz(3.5) throws a TypeError.
- Calling fizzBuzzSingle(-3) throws a RangeError.
- Calling fizzBuzzSingle(4.2) throws a TypeError.
- Passing non-number types (for example, null or string) to either function throws TypeError.
