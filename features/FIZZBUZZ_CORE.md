# FIZZBUZZ_CORE

Summary
Implement the core library functions fizzBuzz and fizzBuzzSingle and export them as named exports from src/lib/main.js.

Implementation
- Add two named exports in src/lib/main.js:
  - fizzBuzz(n): returns an array of strings for integers 1..n following the FizzBuzz rules: multiples of 3 -> "Fizz", multiples of 5 -> "Buzz", multiples of both -> "FizzBuzz", otherwise the number as a string.
  - fizzBuzzSingle(n): returns the FizzBuzz string for a single positive integer n.
- Keep behaviour pure and side-effect free (no console output) so unit tests can import and assert return values.
- Detailed input validation is handled in the EDGE_CASES feature; core logic should assume valid integer inputs for normal operation.

Acceptance Criteria
- [ ] fizzBuzz(15) returns a 15-element array whose last element is "FizzBuzz"
- [ ] fizzBuzzSingle(3) returns "Fizz"
- [ ] fizzBuzzSingle(5) returns "Buzz"
- [ ] fizzBuzzSingle(15) returns "FizzBuzz"
- [ ] fizzBuzzSingle(7) returns "7"

Notes
- Tests that exercise these criteria belong in tests/unit/main.test.js.