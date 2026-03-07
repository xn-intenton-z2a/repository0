# FIZZBUZZ_CORE

## Summary

Add a concise, testable core feature that implements and documents the library's primary mission: a small, well-specified JavaScript API that exports fizzBuzz and fizzBuzzSingle functions from src/lib/main.js, with clear behavior, edge-case handling, and unit tests. This feature centralizes requirements, acceptance criteria, examples, and testing guidance so contributors can implement and verify the core FizzBuzz functionality.

## Motivation

The project mission is to provide a JavaScript library exposing FizzBuzz functions. This feature ensures the core API is explicitly specified, testable, and documented so maintainers and automated agents can implement and validate the functionality reliably.

## Specification

Behavior

- Export two named functions from src/lib/main.js: fizzBuzz and fizzBuzzSingle.
- fizzBuzz(n): returns an array of length n containing the FizzBuzz sequence for integers 1..n (inclusive). When n is 0, returns an empty array.
- fizzBuzzSingle(n): returns a single string representing the FizzBuzz value for a single positive integer n.

Type and Range Rules

- If n is not a number, throw TypeError with a descriptive message.
- If n is not an integer, throw TypeError with a descriptive message.
- If n is negative, throw RangeError with a descriptive message.
- If n is 0, fizzBuzz returns an empty array; fizzBuzzSingle is undefined behavior for 0 and should throw RangeError.

Output Rules

- Multiples of 3 are replaced with the string Fizz
- Multiples of 5 are replaced with the string Buzz
- Multiples of both 3 and 5 are replaced with the string FizzBuzz
- All other numbers are returned as their decimal string representation (for fizzBuzzSingle) or as strings in the array (for fizzBuzz)

API and Exports

- Named exports only: export { fizzBuzz, fizzBuzzSingle } from src/lib/main.js
- Preserve module type as ESM (package.json type: module)

Examples

- fizzBuzz(5) -> ["1","2","Fizz","4","Buzz"]
- fizzBuzzSingle(15) -> "FizzBuzz"
- fizzBuzz(0) -> []

Acceptance Criteria (testable)

- fizzBuzz(15) returns a 15-element array that ends with "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns an empty array.
- Calling functions with a non-number throws TypeError.
- Calling functions with a non-integer number throws TypeError.
- Calling functions with negative numbers throws RangeError.

Testing Guidance

- Add unit tests in tests/unit/ that cover normal cases and each edge case listed above.
- Use the existing test script: npm test

Implementation Notes

- Keep implementation small and dependency free.
- Favor clarity and explicit input validation to make unit tests deterministic.

Compatibility with Mission

This feature directly realizes the repository mission by specifying the core FizzBuzz functions and the acceptance tests that verify correct behavior.
