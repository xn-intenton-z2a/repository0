# INPUT_VALIDATION

Goal

Define input validation rules and error handling so consumers get clear, deterministic failures for invalid inputs.

Rules

- fizzBuzz(0) returns an empty array.
- fizzBuzzSingle(0) is invalid and should throw a RangeError because the single form expects a positive integer.
- For negative numeric values, both functions throw RangeError.
- For non-integer numeric values (e.g., 3.5 or NaN) or non-number types (string, object, undefined), both functions throw TypeError.

Error messages

- Errors should include a short, human-readable explanation that mentions either positive or integer so tests can assert the message contains a meaningful hint (for example: n must be a positive integer).

Acceptance criteria

- fizzBuzz(0) returns an empty array.
- fizzBuzzSingle(0) throws RangeError and the error message includes a human-readable hint.
- Passing negative numbers to either function throws RangeError with a clear message.
- Passing non-integer numeric values (3.5, NaN) or non-number types to either function throws TypeError.
- Unit tests verify the exact error types and include at least one assertion checking the error message contains a readable explanation.

Notes

Document validation behaviour in the README usage examples so consumers know expected errors and return values.