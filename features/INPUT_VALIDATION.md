# INPUT_VALIDATION

Summary

Specify how the library validates and reports invalid inputs for both fizzBuzz and fizzBuzzSingle.

Specification

- Accept only JavaScript numbers that are integers (Number.isInteger).
- Non-number inputs (string, null, undefined, object, NaN) must cause a TypeError with a clear message describing the expected input.
- Non-integer numeric inputs (for example 3.2) must cause a TypeError.
- Negative integers must cause a RangeError.
- Zero is valid for fizzBuzz and returns an empty array; for fizzBuzzSingle zero is a valid input and returns 0 as a string or, if you prefer, treat zero consistently with the substitution rules (0 is divisible by 3 and 5 and therefore returns FizzBuzz). The implementation must declare which behaviour it chooses and tests must reflect that choice.

Acceptance Criteria

- Passing a string, null, or undefined to either function causes a TypeError.
- Passing NaN or Infinity causes a TypeError.
- Passing a non-integer numeric value causes a TypeError.
- Passing a negative integer causes a RangeError.
- Passing 0 to fizzBuzz returns an empty array.
- Tests assert the exact exception types and include clear assertion messages.

Implementation Notes

- Prefer using Number.isInteger and typeof checks. Document the chosen behaviour for fizzBuzzSingle(0) and ensure tests match it.
