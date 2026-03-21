# EDGE_CASES

Summary
Validate inputs and define behaviour for zero, negative numbers, and non-integers.

Implementation
- Update src/lib/main.js input validation so the library has consistent, documented behaviour:
  - fizzBuzz(0) returns an empty array.
  - Passing negative numbers to fizzBuzz or fizzBuzzSingle throws a RangeError.
  - Passing non-integer numbers to fizzBuzz or fizzBuzzSingle throws a TypeError.
- Use Number.isInteger for integer checks and explicit comparisons for negatives.

Acceptance Criteria
- [ ] fizzBuzz(0) returns an empty array
- [ ] fizzBuzz(-1) throws RangeError
- [ ] fizzBuzzSingle(-3) throws RangeError
- [ ] fizzBuzz(2.5) throws TypeError
- [ ] fizzBuzzSingle(3.14) throws TypeError

Notes
- Keep error messages consistent and briefly documented in README.md.