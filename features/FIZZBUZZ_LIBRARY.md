FIZZBUZZ_LIBRARY

Purpose

Specify the core JavaScript library feature: named exports fizzBuzz and fizzBuzzSingle implementing the FizzBuzz mission requirements.

Description

Implement two named ESM exports from src/lib/main.js:

- fizzBuzz(n): returns an array of strings for the sequence 1..n applying Fizz/Buzz/FizzBuzz rules.
- fizzBuzzSingle(n): returns the single string result for a single positive integer n.

Input validation and edge cases (identical behaviour for both functions):

- If n is 0, fizzBuzz returns an empty array.
- If n is negative, both functions throw RangeError with the message "n must be a non-negative integer".
- If n is not an integer (including NaN), both functions throw TypeError with the message "n must be an integer".

Implementation notes

- Use idiomatic ESM exports and keep functions pure and side-effect free.
- Keep logic shared where possible: fizzBuzz should call fizzBuzzSingle to build the array.
- Ensure messages used in thrown errors are descriptive and stable for unit tests.

Acceptance criteria

1. Exports: src/lib/main.js exports named functions fizzBuzz and fizzBuzzSingle.
2. Correctness: fizzBuzz(15) returns an array of length 15 with the correct Fizz/Buzz/FizzBuzz replacements and the last element equals "FizzBuzz".
3. Single: fizzBuzzSingle(3) returns "Fizz", fizzBuzzSingle(5) returns "Buzz", fizzBuzzSingle(15) returns "FizzBuzz", fizzBuzzSingle(7) returns "7".
4. Edge cases: fizzBuzz(0) returns [], negative inputs throw RangeError with message "n must be a non-negative integer", non-integers (including 3.5 and NaN) throw TypeError with message "n must be an integer".
5. Tests: Unit tests in tests/unit verify all behaviours and edge cases and assert the exact error messages specified above.
6. Documentation: README includes usage examples for both fizzBuzz and fizzBuzzSingle and shows CLI example if CLI is present.

Notes

Keep implementation minimal and well-documented. Tests should be deterministic and reference exact error messages and return values so acceptance can be validated by CI.