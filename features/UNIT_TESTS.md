# UNIT_TESTS

Summary

Add comprehensive unit tests that cover normal behaviour and all edge cases required by the mission. Tests must be deterministic and fast and live under tests/unit.

Test structure and location

- Add a new test file tests/unit/fizzbuzz.test.js describing the fizzBuzz and fizzBuzzSingle behaviour.
- Keep existing tests for library identity intact; add the new file alongside them.

Required test cases

- fizzBuzz(15) returns an array of length 15 and the last element is FizzBuzz.
- fizzBuzzSingle(3) returns Fizz, fizzBuzzSingle(5) returns Buzz, fizzBuzzSingle(15) returns FizzBuzz, fizzBuzzSingle(7) returns 7.
- fizzBuzz(0) returns an empty array.
- Non-number input to either function throws TypeError.
- Non-integer numeric input throws TypeError.
- Negative input throws RangeError.
- Exports are functions and importable from src/lib/main.js.

Coverage and acceptance

- Tests must run with the existing npm test script and pass in continuous integration.
- Tests should be written using the existing vitest setup and use expect assertions for exact equality and throws checks.

Acceptance criteria

- tests/unit/fizzbuzz.test.js exists and contains the cases listed above.
- Running npm test completes with exit code zero and the new tests pass locally and in CI.
- Line coverage for the new code is sufficient to cover all branches of the validation logic.
