# INPUT_VALIDATION

Purpose

Specify deterministic input validation and stable error messages used by public FizzBuzz functions so unit tests can assert errors by value.

Validation rules (ordered checks)

1. If the provided argument is not of type 'number' or is not an integer according to Number.isInteger, throw TypeError with message: Argument must be an integer.
2. If the provided numeric argument is less than 0, throw RangeError with message: Argument must be >= 0.

Special cases

- fizzBuzz(0) is accepted and returns an empty array.
- fizzBuzzSingle(0) is considered invalid and throws RangeError (0 is not a positive integer for the single-item API).

Acceptance criteria (testable)

- Passing 3.14 to fizzBuzz throws TypeError and the error message equals Argument must be an integer.
- Passing 3.14 to fizzBuzzSingle throws TypeError and the error message equals Argument must be an integer.
- Passing -1 to fizzBuzz throws RangeError and the error message equals Argument must be >= 0.
- Passing -1 to fizzBuzzSingle throws RangeError and the error message equals Argument must be >= 0.
- Calling fizzBuzz(0) returns [] and does not throw.
