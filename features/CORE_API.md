# CORE_API

Summary

Status: Implemented.

The core API functions fizzBuzz and fizzBuzzSingle are implemented and exported as named exports from src/lib/main.js. The implementation includes input validation and covers zero as a special-case for fizzBuzz.

Evidence

- Implementation: src/lib/main.js exports fizzBuzz and fizzBuzzSingle.
- Tests: tests/unit/fizzbuzz.test.js contains assertions that exercise the functions for canonical values and edge cases.

Acceptance criteria (met)

- fizzBuzz(15) returns a 15-element array whose last element is FizzBuzz.
- fizzBuzzSingle(3) returns Fizz.
- fizzBuzzSingle(5) returns Buzz.
- fizzBuzzSingle(15) returns FizzBuzz.
- fizzBuzzSingle(7) returns 7.
- fizzBuzz(0) returns an empty array.

Notes

This feature is pruned from the active backlog because the code and tests implementing it are present in the repository.