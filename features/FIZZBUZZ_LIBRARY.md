FIZZBUZZ_LIBRARY

Purpose

Specify and track the core library feature: named exports fizzBuzz and fizzBuzzSingle that implement the FizzBuzz mission.

Description

Provide a small, well-tested JavaScript library exporting two named functions from src/lib/main.js:

- fizzBuzz(n): returns an array of strings for the sequence 1..n applying Fizz/Buzz/FizzBuzz rules.
- fizzBuzzSingle(n): returns the single string result for a single positive integer n.

Both functions must validate inputs and handle edge cases per the mission:

- If n is 0, fizzBuzz returns an empty array.
- If n is negative, both functions throw a RangeError with a descriptive message.
- If n is not an integer (including NaN), both functions throw a TypeError with a descriptive message.

Acceptance criteria

1. Exports: src/lib/main.js exports named functions fizzBuzz and fizzBuzzSingle.
2. Correctness: fizzBuzz(15) returns an array of length 15 with the correct Fizz/Buzz/FizzBuzz replacements.
3. Single: fizzBuzzSingle(3) -> "Fizz", fizzBuzzSingle(5) -> "Buzz", fizzBuzzSingle(15) -> "FizzBuzz", fizzBuzzSingle(7) -> "7".
4. Edge cases: fizzBuzz(0) -> [], negative inputs throw RangeError, non-integers throw TypeError.
5. Tests: Unit tests in tests/unit verify all behaviors and edge cases.
6. Documentation: README includes usage examples showing both functions.

Notes

Keep implementation minimal and idiomatic ESM JavaScript. Tests should be deterministic and small.