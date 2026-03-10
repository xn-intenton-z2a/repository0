# FIZZBUZZ_CORE

## Overview

Standardise the library core so the repository reliably fulfils the fizz-buzz mission: provide two small, pure, well-documented functions and exhaustive unit tests that validate normal behaviour and edge cases.

This feature specifies the public API, exact validation rules, error types and messages, and concrete acceptance criteria so implementers can write code and tests that are unambiguous and machine-testable.

## Specification

- Named exports (src/lib/main.js)
  - fizzBuzz(n)
    - Description: return an array of strings representing FizzBuzz for the integers 1..n (1-based).
    - Behaviour: for each i from 1 to n inclusive, element i-1 is fizzBuzzSingle(i).
    - Special case: fizzBuzz(0) returns an empty array.
  - fizzBuzzSingle(n)
    - Description: return the FizzBuzz string for a single positive integer n.

- Validation rules (apply uniformly to both functions)
  - If typeof n !== "number": throw TypeError with message Input must be a number.
  - If Number.isInteger(n) === false: throw TypeError with message Input must be an integer.
  - For fizzBuzzSingle: if n < 1 throw RangeError with message Input must be >= 1.
  - For fizzBuzz: if n < 0 throw RangeError with message Input must be >= 0.

- FizzBuzz transformation rules (pure logic)
  - If n is divisible by 3 and 5: return the exact string FizzBuzz.
  - Else if divisible by 3: return the exact string Fizz.
  - Else if divisible by 5: return the exact string Buzz.
  - Else: return the decimal string for the number (String(n)).

- Implementation constraints
  - Keep functions pure (no side effects) and synchronous.
  - Reuse fizzBuzzSingle inside fizzBuzz to avoid duplication.
  - Export both functions as named exports from src/lib/main.js (ES module syntax).
  - Do not introduce new runtime dependencies.

## Acceptance criteria

All acceptance criteria must be asserted by unit tests in tests/unit/ and be precise about types and messages where applicable.

- fizzBuzz(15) returns an array of 15 strings and the 15th element strictly equals FizzBuzz.
- fizzBuzzSingle(3) strictly equals Fizz.
- fizzBuzzSingle(5) strictly equals Buzz.
- fizzBuzzSingle(15) strictly equals FizzBuzz.
- fizzBuzzSingle(7) strictly equals "7" (string).
- fizzBuzz(0) strictly equals an empty array (length 0).
- fizzBuzzSingle called with 0 or a negative integer throws a RangeError and message Input must be >= 1.
- fizzBuzz called with a negative integer throws a RangeError and message Input must be >= 0.
- Passing a non-number (e.g., "3", null, {}) to either function throws a TypeError with message Input must be a number.
- Passing a non-integer number (e.g., 3.5) to either function throws a TypeError with message Input must be an integer.
- Both functions are exported as named exports; tests must import { fizzBuzz, fizzBuzzSingle } from src/lib/main.js and assert their presence and behaviour.

## Tests and examples

- Unit tests (tests/unit/main.test.js)
  - Assert every acceptance criterion above; for thrown errors assert both the error class and the exact message.
  - Use deterministic input and exact equality checks; avoid fuzzy matching.
- README.md examples
  - Show ES module import and exact function calls with their expected outputs (examples must match tests).
- examples/node-example.js
  - Use the named exports and print results so an integration test can spawn node and assert stdout lines.

## Implementation notes

- Keep error message strings exact and small so tests can assert equality: Input must be a number, Input must be an integer, Input must be >= 0, Input must be >= 1.
- Aim for a single source file implementation (src/lib/main.js) so the feature is self-contained and testable.
- Reuse this core in CLI and web demo features rather than duplicating logic.

## Rationale

Clear, exact validation messages and deterministic behaviour simplify unit tests and downstream features (CLI, examples, web demo) so the repository consistently meets the mission.
