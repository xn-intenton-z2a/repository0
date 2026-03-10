# FIZZBUZZ_CORE

## Overview

Provide a compact, deterministic library API implementing the FizzBuzz mission and precise validation rules so unit tests and downstream features can assert exact values and error messages.

## Specification

- Public named exports in src/lib/main.js
  - fizzBuzz(n)
    - Returns an array of strings representing fizzBuzzSingle(i) for i = 1..n.
    - Special case: fizzBuzz(0) returns [] (empty array).
  - fizzBuzzSingle(n)
    - Returns the FizzBuzz string for a single positive integer n.

- Validation rules (apply uniformly)
  - If typeof n !== "number": throw TypeError with exact message Input must be a number
  - If Number.isInteger(n) === false: throw TypeError with exact message Input must be an integer
  - fizzBuzzSingle: if n < 1 throw RangeError with exact message Input must be >= 1
  - fizzBuzz: if n < 0 throw RangeError with exact message Input must be >= 0

- Transformation rules
  - n divisible by 3 and 5 -> return FizzBuzz
  - n divisible by 3 -> return Fizz
  - n divisible by 5 -> return Buzz
  - otherwise -> return String(n)

- Implementation constraints
  - Pure, synchronous functions with no side effects.
  - fizzBuzz must reuse fizzBuzzSingle internally.
  - Export both functions as named ES module exports from src/lib/main.js.
  - Do not add runtime dependencies.

## Acceptance criteria

All criteria must be covered by unit tests in tests/unit/main.test.js and assert exact equality of return values, thrown error classes, and error message strings.

- fizzBuzz(15) returns an array of length 15 and element 14 (0-based) strictly equals FizzBuzz.
- fizzBuzzSingle(3) strictly equals Fizz.
- fizzBuzzSingle(5) strictly equals Buzz.
- fizzBuzzSingle(15) strictly equals FizzBuzz.
- fizzBuzzSingle(7) strictly equals "7" (string).
- fizzBuzz(0) strictly equals [] (empty array).
- fizzBuzzSingle(0) and fizzBuzzSingle(-1) throw RangeError with message Input must be >= 1.
- fizzBuzz(-1) throws RangeError with message Input must be >= 0.
- Passing non-number ("3", null, {}) to either function throws TypeError with message Input must be a number.
- Passing non-integer (3.5) to either function throws TypeError with message Input must be an integer.
- Tests import { fizzBuzz, fizzBuzzSingle } from src/lib/main.js and assert the exports exist and behave as specified.

## Tests and examples

- Unit tests should be located at tests/unit/main.test.js and assert every acceptance criterion with exact messages and types.
- README.md must include ES module import examples that match test expectations exactly.
- Examples should import and reuse the named exports rather than reimplementing logic.

## Rationale

Exact messages and pure behaviour remove ambiguity and make automated verification deterministic in CI.
