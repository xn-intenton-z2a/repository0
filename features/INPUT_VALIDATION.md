# INPUT_VALIDATION

Goal

Define validation rules and error handling for invalid inputs to the library functions.

Behavior

- For numeric input types:
  - If n is 0, fizzBuzz(0) returns an empty array and fizzBuzzSingle(0) throws RangeError (single expects a positive integer).
  - If n is a negative number, both fizzBuzz and fizzBuzzSingle throw RangeError.
  - If n is not an integer (e.g., 3.5, NaN), both functions throw TypeError.
  - If n is not a number (string, object, undefined), both functions throw TypeError.

Acceptance criteria

- Passing n = 0 to fizzBuzz returns an empty array.
- Passing negative numbers to fizzBuzz or fizzBuzzSingle throws RangeError with a clear message.
- Passing non-integer numeric values or non-number types to either function throws TypeError.
- Unit tests verify the exact error types (RangeError vs TypeError) and include at least one assertion that checks the error message contains a human-readable explanation.

Notes

Validation behaviour must be deterministic and documented in README usage examples.