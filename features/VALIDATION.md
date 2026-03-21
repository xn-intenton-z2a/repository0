# VALIDATION

Purpose
Define input validation and error behaviour for the library functions.

Specification
- Inputs must be numbers and integers. Non-integers must cause a TypeError.
- Negative numbers must cause a RangeError.
- For fizzBuzz, n = 0 returns an empty array (no elements).

Acceptance criteria
- [ ] fizzBuzz(0) returns an empty array
- [ ] Passing a negative integer to fizzBuzz or fizzBuzzSingle throws RangeError
- [ ] Passing a non-integer value to fizzBuzz or fizzBuzzSingle throws TypeError

Notes
Use Number.isInteger for integer checks and RangeError to signal out-of-range inputs; document behaviour in README.
