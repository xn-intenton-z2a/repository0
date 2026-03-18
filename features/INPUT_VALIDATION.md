# INPUT_VALIDATION

Purpose

Specify strict input validation rules for public FizzBuzz functions so behaviour is deterministic and well-documented.

Behavior

- For both fizzBuzz and fizzBuzzSingle perform the following checks in order:
  - If the argument is not a number or not an integer, throw TypeError.
  - If the argument is a number but less than 0, throw RangeError.
  - If the argument equals 0 and the function is fizzBuzz, return an empty array. For fizzBuzzSingle, behavior for 0 is undefined in tests and should throw RangeError (avoid accepting 0 for single-item semantics).

Errors and types

- Use the JavaScript built-ins TypeError and RangeError with clear messages suitable for assertions in tests.

Acceptance criteria

- Passing 3.14 to either function causes TypeError.
- Passing -1 to either function causes RangeError.
- Passing 0 to fizzBuzz returns [] and does not throw.
- Error messages are stable enough for strict equality assertions in tests (implementers may choose concise messages such as "Argument must be an integer" and "Argument must be >= 0").
