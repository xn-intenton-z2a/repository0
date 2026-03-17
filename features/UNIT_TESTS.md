# UNIT_TESTS

Goal

Provide a precise, minimal unit test plan that verifies all mission acceptance criteria and input validation rules.

Test files

- Primary unit tests should live in tests/unit/main.test.js. Additional focused tests may be placed in tests/unit/fizzbuzz.exports.test.js when helpful.

Test cases

1. Normal behaviour
   - fizzBuzz(1) returns [1] as a string element.
   - fizzBuzz(3) returns the three-element sequence with Fizz at position 3.
   - fizzBuzz(5) returns the five-element sequence with Buzz at position 5.
   - fizzBuzz(15) returns the canonical 15-element sequence ending with FizzBuzz.
   - fizzBuzzSingle for 3, 5, 15, and 7 return Fizz, Buzz, FizzBuzz, and 7 respectively.

2. Edge cases and validation
   - fizzBuzz(0) returns an empty array.
   - fizzBuzzSingle(0) throws RangeError.
   - Negative input throws RangeError.
   - Non-integer numeric input throws TypeError.
   - Non-number input throws TypeError.

3. Invariants
   - fizzBuzz(n).length === n for positive integers.
   - fizzBuzzSingle(k) === fizzBuzz(k)[k-1] for representative k values.

Acceptance criteria

- All above tests are implemented in tests/unit/*.test.js and assert exact string values and error types.
- At least one test checks error message content for a human-readable explanation when invalid input is provided.
- Tests run deterministically under Node >= 24 using the repository test script (npm test).

Notes

Keep tests focused and minimal; they serve as the authoritative specification for the library behaviour.