# ERROR_HANDLING

Purpose

Specify the library's error classes and minimum message contents so unit tests and consumers can rely on precise, testable error behaviour for invalid inputs.

Specification

- Both named exports (fizzBuzz and fizzBuzzSingle) must validate input types and ranges before computing results.
- Error classes to use:
  - TypeError for all non-number inputs and for numeric values that are not integers (including NaN and floating-point values with fraction).
  - RangeError for numeric inputs that are out of the allowed range (negative values for both functions; for fizzBuzzSingle zero or negative should be considered out-of-range and therefore RangeError).
- Error messages: tests will assert that thrown errors include specific identifying substrings; implementations must include these substrings in the error message text (case-insensitive checks are acceptable):
  - For TypeError cases include the substring "number" or "integer" to indicate type expectation.
  - For RangeError cases include the substring "negative" or "range" to indicate invalid numeric range.
- No other error classes should be used for input validation (internal errors may use other classes but validation must use the two classes above).

Edge cases

- fizzBuzz(0) is valid and returns an empty array; it must not throw RangeError.
- fizzBuzzSingle(0) must throw RangeError because single-call requires a positive integer.
- Values such as 2.0 (a float equal to an integer) may be treated as integer if the implementation uses Number.isInteger semantics; fractional 2.5 must throw TypeError.

Testing guidance

- Unit tests should assert both the error class and that the error message contains the expected identifying substring (e.g., assert error instanceof RangeError and error.message.toLowerCase().includes('negative')).
- Prefer substring checks over exact message equality to allow minor wording differences while still being strict about semantics.

Acceptance Criteria

- Passing a non-number (for example, "foo" or {}) to fizzBuzz or fizzBuzzSingle throws TypeError and the error message contains either "number" or "integer".
- Passing a non-integer numeric value (for example, 2.5 or NaN) to either function throws TypeError and the message indicates integer/number expectation.
- Passing a negative integer to fizzBuzz or fizzBuzzSingle throws RangeError and the message contains either "negative" or "range".
- Passing 0 to fizzBuzz returns an empty array and does not throw.
- Passing 0 to fizzBuzzSingle throws RangeError (message containing "negative" or "range").

Notes

- This feature complements CORE_FIZZBUZZ by making input validation behaviour explicit and fully testable across the codebase and examples.
