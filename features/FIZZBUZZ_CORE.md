# FIZZBUZZ_CORE

Goal

Provide the primary library feature: named exports fizzBuzz and fizzBuzzSingle implemented in src/lib/main.js, with clear behaviour and unit tests.

Specification

- Export two named functions from src/lib/main.js: fizzBuzz(n) and fizzBuzzSingle(n).
- fizzBuzz(n) returns an array of strings representing numbers from 1 to n with multiples of 3 replaced by "Fizz", multiples of 5 replaced by "Buzz", and multiples of both replaced by "FizzBuzz".
- fizzBuzzSingle(n) returns the single string value for the integer n following the same substitution rules.
- Both functions must validate inputs: non-integer inputs throw TypeError; negative integers throw RangeError; fizzBuzz(0) returns an empty array.

Acceptance Criteria

- fizzBuzz(15) returns the correct 15-element array ending with "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- Exports are named exports in src/lib/main.js.
- Unit tests exist under tests/unit/ covering normal behaviour and the input validation rules.