# ERROR_HANDLING

Purpose

Define the exact, testable input validation behaviour required so consumers and tests can rely on the library producing consistent error classes and identifiable messages for invalid inputs.

Specification

- Validation responsibility: fizzBuzz and fizzBuzzSingle must validate inputs and throw the following error classes for input validation failures only:
  - TypeError: for any non-number input and for numeric values that are not integers (including NaN and fractional numbers like 2.5).
  - RangeError: for numeric inputs that are out of the allowed range (negative numbers for fizzBuzz; zero or negative for fizzBuzzSingle).
- Error message guidance: include identifying substrings to aid tests. Implementations should include one of the following substrings (case-insensitive):
  - For TypeError messages include "number" or "integer".
  - For RangeError messages include "negative" or "range".
- Do not use other error classes for input validation (internal/runtime errors may use other classes but must not be relied upon by tests for validation behaviour).

Edge cases

- fizzBuzz(0) is valid and must not throw.
- fizzBuzzSingle(0) must throw RangeError.
- Numeric values equal to integers (for example 2.0) may be accepted if Number.isInteger semantics are used; fractional numbers must throw TypeError.

Testing guidance

- Tests should assert the error class (instanceof) and that the message contains an identifying substring rather than enforcing exact message equality.

Acceptance Criteria

- Passing a non-number (for example, "foo" or {}) to fizzBuzz or fizzBuzzSingle throws TypeError and the error message contains either "number" or "integer".
- Passing a non-integer numeric value (for example, 2.5 or NaN) to either function throws TypeError and the message indicates integer/number expectation.
- Passing a negative integer to fizzBuzz or fizzBuzzSingle throws RangeError and the message contains either "negative" or "range".
- Passing 0 to fizzBuzz returns an empty array and does not throw; passing 0 to fizzBuzzSingle throws RangeError.
