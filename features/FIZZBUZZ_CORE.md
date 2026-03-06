# FIZZBUZZ_CORE

Summary

A focused feature that implements the core FizzBuzz library required by the project mission. Provides two named exports: fizzBuzz and fizzBuzzSingle. Behavior follows the mission specification exactly and includes strict input validation, explicit error types, and full unit-test coverage.

Goals

- Implement fizzBuzz(n) returning an array of strings for numbers 1..n with replacements for multiples of 3 (Fizz), 5 (Buzz), and both (FizzBuzz).
- Implement fizzBuzzSingle(n) returning the single FizzBuzz string for a positive integer n.
- Validate inputs strictly: fizzBuzz(0) returns [], negative integers throw RangeError, non-integers and non-finite numbers throw TypeError.
- Export both functions as named exports from src/lib/main.js and keep implementation dependency-free.
- Provide comprehensive unit tests covering normal operation and all edge cases described below.

API

- fizzBuzz(n): number -> string[]
  - If n === 0 return an empty array.
  - If n is a positive integer return an array of length n where the element at index i represents value i+1.
  - Throws RangeError for n < 0.
  - Throws TypeError for non-integer or non-finite inputs (NaN, Infinity, floats like 3.5).

- fizzBuzzSingle(n): number -> string
  - For a positive integer n return:
    - "FizzBuzz" when n divisible by 3 and 5
    - "Fizz" when n divisible by 3 only
    - "Buzz" when n divisible by 5 only
    - The decimal string representation of n otherwise
  - Throws RangeError for n < 0.
  - Throws TypeError for non-integer or non-finite inputs.

Edge cases

- fizzBuzz(0) returns an empty array and does not throw.
- Inputs that are not finite integers (NaN, Infinity, floats) cause TypeError.
- Negative values cause RangeError.

Testing and Acceptance Criteria

Unit tests should exist at tests/unit/main.test.js and include the following assertions:

- fizzBuzz(15) returns the expected 15-element array ending with "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns an empty array.
- fizzBuzz and fizzBuzzSingle throw TypeError for non-integers (e.g. 3.5, NaN) and throw RangeError for negative integers (e.g. -1).

Acceptance checklist (tests must pass):

- fizzBuzz(15) produces correct array
- fizzBuzzSingle(3) -> Fizz
- fizzBuzzSingle(5) -> Buzz
- fizzBuzzSingle(15) -> FizzBuzz
- fizzBuzzSingle(7) -> 7
- fizzBuzz(0) -> []
- All unit tests pass via npm test

Implementation notes

- Implement the functions synchronously in src/lib/main.js and export them as named exports.
- Keep the implementation concise and dependency-free to ensure compatibility with the existing CI and Node >=24.
- Use Vitest for unit tests and ensure tests are deterministic and fast.
- Update README.md usage examples to show both functions and (optionally) the CLI examples from the companion feature.

Examples

Import and call:

import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js'
const list = fizzBuzz(15)
const single = fizzBuzzSingle(3)

Compatibility

This feature is minimal, single-file, and aligns with the repository mission to export FizzBuzz functions with clear validation and tests.
