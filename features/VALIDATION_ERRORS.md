# VALIDATION_ERRORS

Purpose

Centralize the repository's validation and error-handling expectations for the Hamming distance APIs so tests and documentation are consistent.

Behavior and error types

- TypeError conditions (should include a helpful message):
  - hammingString: when either argument is not a string.
  - hammingBits: when either argument is not a number or not an integer.

- RangeError conditions (should include a helpful message):
  - hammingString: when the two strings differ in code point length.
  - hammingBits: when either integer is negative.

Messages

- Error messages should be specific enough for tests to assert the error type; message exact string matching is optional but recommended to aid debugging.

Acceptance criteria

- All invalid inputs described above cause the correct error type to be thrown.
- Unit tests assert that TypeError is thrown for wrong types and RangeError for range violations.
