# TEST_SUITE

Purpose

Define the unit-test requirements and acceptance checks for the FizzBuzz library so CI can verify mission completion.

Required tests

- Unit tests for fizzBuzzSingle:
  - Input 3 => "Fizz".
  - Input 5 => "Buzz".
  - Input 15 => "FizzBuzz".
  - Input 7 => "7" (string).
  - Input 0 => RangeError (explicit behaviour: fizzBuzzSingle should throw RangeError for 0).
  - Negative input => RangeError.
  - Non-integer input => TypeError.

- Unit tests for fizzBuzz:
  - fizzBuzz(0) returns [].
  - fizzBuzz(1) returns ["1"].
  - fizzBuzz(15) returns array length 15 with expected Fizz/Buzz substitutions at classic positions.
  - Non-integer or negative inputs throw the right errors.

- Test style and constraints:
  - Tests must be deterministic and not rely on global state.
  - Use vitest for unit tests located in tests/unit/.
  - Each acceptance criterion from FIZZBUZZ_CORE must be asserted by at least one test.

Acceptance Criteria

- tests/unit contains tests that cover all required cases above.
- Running npm test exits with success in the repository environment when functions meet the spec.
- Tests assert exact string values and error types (RangeError, TypeError) where specified.

Notes

Keep tests minimal but exhaustive for the contract described in the mission.