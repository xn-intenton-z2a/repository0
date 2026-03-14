# EDGE_CASE_TESTS

Purpose

Specify unit tests that cover the edge cases required by the mission and ensure regressions are caught by CI.

Behavior

- Tests live under tests/unit/ and exercise the public API exported by src/lib/main.js.
- Focus on the mission-required edge cases: zero, negatives, non-integers, and typical small values.

Tests to write

- fizzBuzz(0) returns []
- fizzBuzzSingle(3) returns "Fizz"
- fizzBuzzSingle(5) returns "Buzz"
- fizzBuzzSingle(15) returns "FizzBuzz"
- fizzBuzzSingle(7) returns "7"
- fizzBuzz(-1) throws RangeError
- fizzBuzzSingle(-5) throws RangeError
- fizzBuzz(2.5) throws TypeError
- fizzBuzzSingle(3.1) throws TypeError

Acceptance criteria

- All edge-case unit tests are present and pass under npm test.
- Tests assert both error type and message where applicable to avoid ambiguous catches.
