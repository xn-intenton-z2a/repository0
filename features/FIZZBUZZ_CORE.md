# FIZZBUZZ_CORE

## Summary

Implement the core FizzBuzz feature: robust, well-documented, testable library exports that fulfill the mission's requirements. This feature defines the API, expected behaviour, edge-case handling, and acceptance criteria so it can be implemented in src/lib/main.js with corresponding unit tests and README examples.

## Motivation

Provide a minimal, correct, and well-specified FizzBuzz implementation that is easy to test and integrate. This aligns directly with the repository mission and provides the library's canonical behaviour for consumers and CI tests.

## Behaviour and API

Exports (named):
- fizzBuzz(n): returns an array of strings for integers 1..n where:
  - multiples of 3 are replaced with Fizz
  - multiples of 5 are replaced with Buzz
  - multiples of both 3 and 5 are replaced with FizzBuzz
  - non-multiples are represented as their decimal string
- fizzBuzzSingle(n): returns a single string applying the same replacement rules for the integer n

Input validation:
- If n is not a number or not an integer, throw TypeError with a clear message
- If n is negative, throw RangeError with a clear message
- If n is 0, fizzBuzz returns an empty array and fizzBuzzSingle(0) throws RangeError (single values must be positive)

Performance and constraints:
- Implementations should be simple and synchronous; optimized algorithms are not required for the small inputs used in tests

## Error messages (recommended exact text)
- TypeError: Input must be an integer
- RangeError: Input must be a positive integer

## Tests

Unit tests should cover:
- Normal values: fizzBuzz(1), fizzBuzz(3), fizzBuzz(5), fizzBuzz(15)
- Single values returning expected strings: fizzBuzzSingle(3) -> Fizz, fizzBuzzSingle(5) -> Buzz, fizzBuzzSingle(15) -> FizzBuzz, fizzBuzzSingle(7) -> 7
- Edge values: fizzBuzz(0) -> [], fizzBuzzSingle(0) -> RangeError
- Invalid types: string, float numbers (e.g., 2.5) -> TypeError
- Negative values: -1 -> RangeError

Tests should be placed in tests/unit and named to match existing test conventions.

## README examples

Include short usage examples demonstrating imports and calling both functions, showing the result for fizzBuzz(15) and fizzBuzzSingle(7).

## Acceptance Criteria

- fizzBuzz(15) returns an array of 15 strings with the 15th element "FizzBuzz"
- fizzBuzzSingle(3) returns "Fizz"
- fizzBuzzSingle(5) returns "Buzz"
- fizzBuzzSingle(15) returns "FizzBuzz"
- fizzBuzzSingle(7) returns "7"
- fizzBuzz(0) returns []
- All unit tests pass in CI
- README contains usage examples for both functions

## Implementation notes

- Place functions as named exports in src/lib/main.js, matching package.json main entry
- Keep behaviour deterministic and fully specified to avoid ambiguity in tests
- Unit tests must assert both returned values and thrown error types/messages where applicable
