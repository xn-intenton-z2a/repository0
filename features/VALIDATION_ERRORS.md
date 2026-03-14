# VALIDATION_ERRORS

Purpose

Standardise the validation and error-handling behaviour across the Hamming distance APIs so tests and documentation can assert error types reliably.

Error rules

TypeError (invalid type)

- hammingString: throw TypeError when either argument is not a string.
- hammingBits: throw TypeError when either argument is not an integer (neither a Number integer nor a BigInt).

RangeError (invalid range)

- hammingString: throw RangeError when the two strings differ in code point length.
- hammingBits: throw RangeError when either integer is negative.

Testing and messages

- Tests should assert the thrown error type (TypeError or RangeError) for each invalid input case.
- Exact error message matching is optional, but messages should be clear and include the function name and expectation where practical (e.g., "hammingString expects two strings").

Acceptance criteria (testable)

- Passing wrong types to hammingString produces TypeError.
- Passing wrong types or non-integer numbers to hammingBits produces TypeError.
- Unequal-length strings cause RangeError.
- Negative integers cause RangeError.
