# CORE_FIZZ

## Summary

Implement the core FizzBuzz functionality as two named exports from the library entry point (src/lib/main.js): fizzBuzz and fizzBuzzSingle. These functions implement the canonical FizzBuzz mapping for positive integers and are the primary API surface of the repository.

## Specification

- Export two named functions from src/lib/main.js: fizzBuzz and fizzBuzzSingle.
- fizzBuzz(n) returns an array of strings for the range 1..n inclusive.
- Replace numbers divisible by 3 with the string Fizz.
- Replace numbers divisible by 5 with the string Buzz.
- Replace numbers divisible by both 3 and 5 with the string FizzBuzz.
- fizzBuzzSingle(n) returns the single string for a single positive integer using the same replacement rules.

## Edge behaviour

- Passing n = 0 to fizzBuzz returns an empty array.
- Negative numbers cause a RangeError.
- Non-integer numeric inputs cause a TypeError.

## Acceptance criteria

- The module exports named functions fizzBuzz and fizzBuzzSingle from src/lib/main.js.
- fizzBuzz(15) returns a 15-element array with the exact sequence: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz.
- fizzBuzzSingle(3) returns the string Fizz.
- fizzBuzzSingle(5) returns the string Buzz.
- fizzBuzzSingle(15) returns the string FizzBuzz.
- fizzBuzzSingle(7) returns the string 7.
