# UNIT_TESTS

Goal

Define a complete unit test plan to verify all mission acceptance criteria and input validation rules.

Test files

- tests/unit/main.test.js should contain focused tests for both fizzBuzz and fizzBuzzSingle.

Test cases

1. Normal behaviour
   - fizzBuzz(1) returns ["1"].
   - fizzBuzz(3) returns ["1","2","Fizz"].
   - fizzBuzz(5) returns ["1","2","Fizz","4","Buzz"].
   - fizzBuzz(15) returns the full 15-element array ending with "FizzBuzz".
   - fizzBuzzSingle for values 3, 5, 15, and 7 return "Fizz", "Buzz", "FizzBuzz", and "7" respectively.

2. Edge cases and validation
   - fizzBuzz(0) returns []
   - fizzBuzzSingle(0) throws RangeError
   - Negative input throws RangeError
   - Non-integer numeric input throws TypeError
   - Non-number input throws TypeError

3. Behavioural invariants
   - fizzBuzz(n).length === n for positive integers
   - fizzBuzzSingle(k) is equal to fizzBuzz(k)[k-1] for representative k values

Acceptance criteria

- All tests above are implemented in tests/unit/main.test.js and pass in the repository's test runner.
- Tests assert exact error types and include at least one message check for errors.
- Tests avoid relying on global state and run deterministically under Node >= 24.

Notes

Keep tests minimal and precise; they should serve as the authoritative specification for implementation.