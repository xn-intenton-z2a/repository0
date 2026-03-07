# FIZZBUZZ_CORE

## Summary

A precise, testable specification for the core FizzBuzz library: two named exports, fizzBuzz and fizzBuzzSingle, implementing the classic replacements and strict input validation required by the repository mission. This document defines behavior, exact error semantics, test coverage requirements, README examples, and minimal implementation guidance so the feature can be completed within a single source file and unit tests.

## Motivation

Provide a minimal, correctly-specified JavaScript library that is trivial to verify in CI and to reuse from other code (and the CLI). The focus is correctness, predictable errors, and thorough unit tests that cover normal and edge cases listed in the mission.

## Behaviour and API

Exports (named):
- fizzBuzz(n)
  - Signature: fizzBuzz(number) -> string[]
  - Returns an array of strings representing integers 1 through n.
  - For each k in 1..n:
    - if k is divisible by 3 and 5, element is FizzBuzz
    - else if k is divisible by 3, element is Fizz
    - else if k is divisible by 5, element is Buzz
    - else element is the decimal string for k
  - If n is 0, returns an empty array.

- fizzBuzzSingle(n)
  - Signature: fizzBuzzSingle(number) -> string
  - Returns the Fizz/Buzz/FizzBuzz/decimal string for the single integer n using the same rules.

Input validation (exact behaviour):
- If typeof n !== 'number' or Number.isInteger(n) is false, throw a TypeError with message: Input must be an integer
- If n is negative, throw a RangeError with message: Input must be a positive integer
- For fizzBuzzSingle, n must be a positive integer (n <= 0 throws RangeError)
- For fizzBuzz, n may be 0 and returns [] (but negative or non-integer inputs follow the same errors above)

Error messages (must match tests exactly):
- TypeError: Input must be an integer
- RangeError: Input must be a positive integer

## Tests

Required unit tests (place under tests/unit and follow existing naming):
- Normal operation
  - fizzBuzz(1) -> ["1"]
  - fizzBuzz(3) -> ["1","2","Fizz"]
  - fizzBuzz(5) -> ["1","2","Fizz","4","Buzz"]
  - fizzBuzz(15) -> array length 15 and element 15 equals "FizzBuzz"
- Single value behaviour
  - fizzBuzzSingle(3) -> "Fizz"
  - fizzBuzzSingle(5) -> "Buzz"
  - fizzBuzzSingle(15) -> "FizzBuzz"
  - fizzBuzzSingle(7) -> "7"
- Edge and error cases
  - fizzBuzz(0) -> []
  - fizzBuzzSingle(0) -> RangeError with message Input must be a positive integer
  - fizzBuzz('3') -> TypeError with message Input must be an integer
  - fizzBuzz(2.5) -> TypeError with message Input must be an integer
  - fizzBuzz(-1) -> RangeError with message Input must be a positive integer

Tests must assert both the thrown error type (TypeError/RangeError) and the exact message text above.

## Acceptance Criteria

- All tests listed above pass in the project's test runner
- Named exports fizzBuzz and fizzBuzzSingle exist in src/lib/main.js and match the specified signatures and error messages
- README contains usage examples for both functions demonstrating fizzBuzz(15) and fizzBuzzSingle(7)

## Implementation notes

- Keep the implementation synchronous and minimal; place both exports into src/lib/main.js as named exports; do not introduce new runtime dependencies.
- Prefer clear, simple loops or Array.from to build the fizzBuzz array so the behaviour is deterministic and easy to test.
- Exporting an additional runCli or CLI helper is allowed but optional; core behaviour must remain intact.
- Avoid changing other repository files; tests and README may be updated to reflect examples and to verify acceptance criteria.

## Deliverables

- Updated src/lib/main.js exporting fizzBuzz and fizzBuzzSingle
- Unit tests in tests/unit covering the above test matrix
- README examples showing usage and expected outputs for fizzBuzz(15) and fizzBuzzSingle(7)
