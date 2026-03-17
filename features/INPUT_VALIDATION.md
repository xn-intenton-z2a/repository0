# INPUT_VALIDATION

Goal

Define validation rules and error handling for invalid inputs to the library functions.

Behavior

- For numeric input types:
  - If n is 0, fizzBuzz(0) returns an empty array.
  - fizzBuzzSingle(0) is considered invalid and should throw RangeError (single expects a positive integer).
  - If n is a negative number, both fizzBuzz and fizzBuzzSingle throw RangeError.
  - If n is not an integer (e.g., 3.5, NaN), both functions throw TypeError.
  - If n is not a number (string, object, undefined), both functions throw TypeError.

Error messages

- Error messages should be human-readable and include either the word "positive" or "integer" as appropriate so tests can assert the message contains a short explanation (e.g., "n must be a positive integer").

Acceptance criteria

- Passing n = 0 to fizzBuzz returns an empty array.
- Passing n = 0 to fizzBuzzSingle throws RangeError.
- Passing negative numbers to fizzBuzz or fizzBuzzSingle throws RangeError with a clear message.
- Passing non-integer numeric values (3.5, NaN) or non-number types to either function throws TypeError.
- Unit tests (tests/unit/main.test.js) verify the exact error types and include at least one assertion that checks the error message contains a human-readable explanation.

Notes

Validation behaviour must be deterministic and documented in README usage examples.