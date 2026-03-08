# FIZZBUZZ_VALIDATION

Summary

Specify strict input validation rules and associated unit tests for the FizzBuzz library to ensure predictable error handling and clear diagnostics.

Specification

- Validate that inputs are numbers and integers where required.
- On non-number inputs (string, object, undefined, null, arrays), functions must throw a TypeError with a message containing the word "integer" or "number" to aid assertions in tests.
- On non-integer numeric inputs (e.g., 1.5, NaN, Infinity), functions must throw TypeError.
- On negative integers, functions must throw RangeError with a message that includes the word "non-negative" or "positive".
- Error messages should be deterministic and documented in tests so assertions can check either the error type and either the message or a substring.

Testing guidance

- Write unit tests that assert the function throws TypeError for inputs: "3", [], {}, null, undefined, 2.5, NaN, Infinity.
- Write unit tests that assert the function throws RangeError for inputs: -1, -100.
- Tests should also assert that valid inputs such as 1, 2, 3 produce expected values and do not throw.

Acceptance criteria

- All specified invalid inputs cause the correct error types to be thrown
- Error messages include the expected hint substrings to facilitate test assertions
- Unit tests exercising validation pass

Notes

This feature complements FIZZBUZZ_CORE by making error behaviour explicit and testable; keep messages concise to avoid brittle tests.