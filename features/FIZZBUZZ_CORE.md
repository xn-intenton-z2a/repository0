# FIZZBUZZ_CORE

## Overview
Implement and validate the library's core FizzBuzz functionality as the repository mission describes. This feature ensures the canonical API and behaviour are present in src/lib/main.js and are fully exercised by unit tests.

## Specification
- Expose named exports fizzBuzz and fizzBuzzSingle from src/lib/main.js.
- fizzBuzz(n) returns an array of strings for 1..n with multiples of 3 replaced by Fizz, multiples of 5 replaced by Buzz, and multiples of both replaced by FizzBuzz.
- fizzBuzzSingle(n) returns the single-string result for a single positive integer n.
- Error handling: n = 0 returns an empty array for fizzBuzz; negative integers throw RangeError; non-integer input throws TypeError.

## Tests
- Add or update unit tests in tests/unit to assert normal behaviour and every edge case (zero, negative, non-integer, large n).

## Acceptance Criteria
- fizzBuzz(15) returns the correct 15-element array ending with FizzBuzz.
- fizzBuzzSingle(3) returns Fizz.
- fizzBuzzSingle(5) returns Buzz.
- fizzBuzzSingle(15) returns FizzBuzz.
- fizzBuzzSingle(7) returns 7.
- fizzBuzz(0) returns an empty array.
- All unit tests for core functions pass.