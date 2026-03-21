# INPUT_VALIDATION

Summary

Specify and enforce input validation rules for both API functions to ensure predictable behaviour and clear error reporting.

Specification

- fizzBuzz(0) must return an empty array.
- Negative numbers passed to fizzBuzz or fizzBuzzSingle must throw a RangeError.
- Non-integer numeric inputs must throw a TypeError.
- Non-numeric inputs must throw a TypeError.

Acceptance Criteria

- [ ] fizzBuzz(0) returns an empty array.
- [ ] fizzBuzz(-1) throws a RangeError.
- [ ] fizzBuzzSingle(-3) throws a RangeError.
- [ ] fizzBuzz(2.5) throws a TypeError.
- [ ] fizzBuzzSingle(3.14) throws a TypeError.
- [ ] Passing a non-number (for example a string or undefined) throws a TypeError with a clear message.
