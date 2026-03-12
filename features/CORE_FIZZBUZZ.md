# CORE_FIZZBUZZ

Summary

Implement the canonical FizzBuzz library surface in src/lib/main.js: two named exports fizzBuzz and fizzBuzzSingle that implement the behaviour described in MISSION.md and handle edge cases precisely.

Motivation

Provide a minimal, fully tested, and documented library implementation that satisfies the repository mission and serves as the foundation for CLI, web demo, and docs features.

Specification

- Exports
  - Named exports: fizzBuzz, fizzBuzzSingle (ES module named exports)

- fizzBuzz(n):
  - Input: single numeric argument n
  - Behaviour:
    - If n is exactly 0, return an empty array []
    - If n is a negative integer, throw RangeError with a clear message
    - If n is not an integer (including NaN, non-number), throw TypeError
    - Otherwise return an array of length n with entries for 1..n using fizzBuzzSingle for each element

- fizzBuzzSingle(n):
  - Input: a single positive integer
  - Behaviour:
    - If input is not a number or not an integer, throw TypeError
    - If input is <= 0, throw RangeError
    - Return "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, otherwise the decimal representation of the number as a string

Edge Cases and Errors

- fizzBuzz(0) returns []
- fizzBuzz(-1) throws RangeError
- fizzBuzz(3.5) throws TypeError
- fizzBuzzSingle(0) throws RangeError
- Non-number inputs throw TypeError

Tests and Acceptance Criteria

- fizzBuzz(15) returns array of length 15 and element 15 equals "FizzBuzz"
- fizzBuzzSingle(3) returns "Fizz"
- fizzBuzzSingle(5) returns "Buzz"
- fizzBuzzSingle(15) returns "FizzBuzz"
- fizzBuzzSingle(7) returns "7"
- fizzBuzz(0) returns []
- Unit tests exist in tests/unit/main.test.js asserting all above behaviours and edge cases

Notes

- Keep implementation compact and well-documented with JSDoc to help website and CLI integration.

