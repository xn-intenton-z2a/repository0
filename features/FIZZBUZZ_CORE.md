# FIZZBUZZ_CORE

Summary

A focused feature that implements the core FizzBuzz library required by the project mission. Provides two named exports: fizzBuzz and fizzBuzzSingle. Behaviour follows the mission specification exactly and includes full input validation, error types, and unit-testable outputs.

Goals

- Implement fizzBuzz(n) returning an array of strings representing 1..n with replacements for multiples of 3 and 5.
- Implement fizzBuzzSingle(n) returning the single string result for a positive integer n.
- Validate inputs strictly: zero returns an empty array for fizzBuzz, negative integers throw RangeError, non-integers throw TypeError.
- Export both functions as named exports from src/lib/main.js.
- Provide comprehensive unit tests covering normal cases and all edge cases.

Non-goals

- Internationalisation, plugin architecture, or streaming APIs. This feature is intentionally small and single-file.

API

- fizzBuzz(n): number -> string[]
  - n === 0 -> []
  - n > 0 -> array length n, index i corresponds to value i+1
  - throws RangeError for n < 0
  - throws TypeError for non-integer inputs

- fizzBuzzSingle(n): number -> string
  - returns "Fizz" for multiples of 3 (but not 5), "Buzz" for multiples of 5 (but not 3), "FizzBuzz" for multiples of both, otherwise the decimal representation of the number
  - throws RangeError for n < 0
  - throws TypeError for non-integer inputs

Edge cases

- n = 0 for fizzBuzz returns an empty array.
- n must be finite and integral; NaN, Infinity, floats like 3.5 are TypeError.
- Negative values are RangeError.

Testing and Acceptance Criteria

- Unit tests located at tests/unit/main.test.js should include:
  - fizzBuzz(15) returns the 15-element array ending with FizzBuzz
  - fizzBuzzSingle(3) returns Fizz
  - fizzBuzzSingle(5) returns Buzz
  - fizzBuzzSingle(15) returns FizzBuzz
  - fizzBuzzSingle(7) returns 7
  - fizzBuzz(0) returns []
  - Tests that non-integers throw TypeError and negatives throw RangeError for both functions

- Acceptance checklist:
  - fizzBuzz(15) correct 15-element array
  - fizzBuzzSingle(3) returns Fizz
  - fizzBuzzSingle(5) returns Buzz
  - fizzBuzzSingle(15) returns FizzBuzz
  - fizzBuzzSingle(7) returns 7
  - fizzBuzz(0) returns []
  - All unit tests pass with npm test

Implementation notes

- Put implementation in src/lib/main.js as named exports to match package.json main entry.
- Keep implementation synchronous and dependency-free.
- Make tests deterministic and fast using Vitest.
- Update README.md usage examples to show both functions.

Examples

Import style example: import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js' then call fizzBuzz(15) or fizzBuzzSingle(3).

Compatibility

This feature directly implements the mission and fits within a single source file. It is intentionally minimal and test-driven to ensure CI passes and the library can be used by downstream examples and the optional CLI.
