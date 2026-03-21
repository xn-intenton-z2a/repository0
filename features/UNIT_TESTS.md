# UNIT_TESTS

Summary
Specify the unit tests that must be added to tests/unit/main.test.js to validate normal operation and all edge cases.

Required test cases
- fizzBuzzSingle with 3 returns Fizz
- fizzBuzzSingle with 5 returns Buzz
- fizzBuzzSingle with 15 returns FizzBuzz
- fizzBuzzSingle with 7 returns the string 7
- fizzBuzz(0) returns an empty array
- fizzBuzz(15) returns an array of 15 strings where the last element is FizzBuzz and positions map to integers 1..15
- Non-integer input (for example 2.5) throws TypeError and error.message equals n must be an integer
- Negative input (for example -1) throws RangeError and error.message equals n must be >= 0
- NaN and Infinity inputs are treated as non-integers and throw TypeError
- Module exports: importing named exports fizzBuzz and fizzBuzzSingle from src/lib/main.js works

Acceptance criteria
- [ ] Tests include all required cases listed above
- [ ] Running npm test executes tests/unit/main.test.js and all tests pass
- [ ] Tests assert exact error types and messages for invalid inputs

Notes
- Use vitest conventions present in the repository; match style of existing tests in tests/unit.
- Keep tests focused on API-level behavior, not on implementation details.
