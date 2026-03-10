# FIZZBUZZ_CORE

## Overview

Define and standardise the core library API for generating FizzBuzz output so the project fulfils the mission: a minimal JavaScript library exporting two functions with deterministic behaviour and comprehensive unit tests.

## Specification

- Exports
  - fizzBuzz(n): named export. Returns an array of strings of length n (or empty array for n = 0) where each element is the FizzBuzz string for the 1-based index.
  - fizzBuzzSingle(n): named export. Returns a single FizzBuzz string for the positive integer n.

- Behaviour rules
  - For positive integers: replace multiples of 3 with Fizz, multiples of 5 with Buzz, multiples of both with FizzBuzz, otherwise return the decimal string for the number.
  - For n === 0: fizzBuzz(0) returns an empty array; fizzBuzzSingle is not called with 0 in normal usage but should throw RangeError if called with non-positive integers.
  - For negative numbers: both functions throw RangeError.
  - For non-integers and non-number types: both functions throw TypeError.

- Error types and messages (implementation should include clear messages):
  - TypeError when typeof n !== "number" or Number.isInteger(n) is false.
  - RangeError when n < 1 for fizzBuzzSingle or when n < 0 for fizzBuzz (fizzBuzz(0) is allowed and returns []).

## Acceptance criteria

- fizzBuzz(15) returns an array of 15 strings with the 15th element equal to FizzBuzz.
- fizzBuzzSingle(3) returns Fizz.
- fizzBuzzSingle(5) returns Buzz.
- fizzBuzzSingle(15) returns FizzBuzz.
- fizzBuzzSingle(7) returns 7.
- fizzBuzz(0) returns an empty array.
- fizzBuzzSingle called with a negative or zero value throws RangeError.
- Non-number and non-integer inputs to either function throw TypeError.
- Both functions are exported as named exports from src/lib/main.js.
- Unit tests in tests/unit/ ensure every acceptance criterion is asserted.

## Implementation notes

- Keep functions pure and deterministic so unit tests can assert equality without mocking.
- Place core logic in src/lib/main.js and expose named exports; add small wrapper for CLI (if CLI feature present) but keep the core functions testable in isolation.
- Update README.md with usage examples for both functions.
- Tests should cover edge cases and invalid inputs precisely and assert thrown error types, not just messages.
