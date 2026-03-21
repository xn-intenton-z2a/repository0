# CORE_API

Summary

Define the library's core public API: two named exports, fizzBuzz and fizzBuzzSingle, implemented in src/lib/main.js.

Motivation

Provide a minimal, well-specified API that implements the classic FizzBuzz behaviour and is easy to test and reuse.

Specification

- fizzBuzz(n) returns an array of strings for the sequence 1..n inclusive.
- fizzBuzzSingle(n) returns the single FizzBuzz string result for the positive integer n.
- Substitution rules: multiples of 3 produce the string Fizz; multiples of 5 produce Buzz; numbers divisible by both produce FizzBuzz; all other numbers produce their decimal string value.
- Input semantics: n is a numeric integer. If n === 0 return an empty array. If n is negative throw RangeError. If n is not an integer throw TypeError. If n is not a number throw TypeError.
- Both functions must be pure and side-effect free and exported as named exports from src/lib/main.js.

Acceptance Criteria

- fizzBuzz(15) returns an array of 15 strings whose last element is FizzBuzz and whose sequence matches the canonical FizzBuzz rules.
- fizzBuzzSingle(3) returns Fizz.
- fizzBuzzSingle(5) returns Buzz.
- fizzBuzzSingle(15) returns FizzBuzz.
- fizzBuzzSingle(7) returns 7.
- fizzBuzz(0) returns an empty array.
- src/lib/main.js exposes named exports fizzBuzz and fizzBuzzSingle.
- Unit tests exercising these behaviours exist in tests/unit/ and pass in CI.

Implementation Notes

- Implement behaviour in src/lib/main.js and add unit tests in tests/unit/main.test.js. Keep logic small, explicit, and easily testable.
