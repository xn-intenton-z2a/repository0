# CORE_FIZZBUZZ

Summary

Provide a complete, well-documented, and tested canonical FizzBuzz implementation exported from src/lib/main.js. This feature ensures the library API, input validation, JSDoc, and unit tests satisfy the mission and acceptance criteria.

Motivation

The mission requires a minimal JavaScript library exposing fizzBuzz and fizzBuzzSingle with strict error semantics and full unit-test coverage. This feature closes the gap between the current implementation and the required test coverage and documentation.

Specification

- Public API
  - Named exports (ES module): fizzBuzz, fizzBuzzSingle
  - Both functions must be implemented in src/lib/main.js and used by CLI and web demo.

- fizzBuzz(n)
  - Signature: fizzBuzz(n: number) => string[]
  - Behaviour:
    - If n === 0, return an empty array []
    - If n is a negative integer, throw RangeError with message: "n must be non-negative"
    - If n is not a Number or not an integer (including NaN), throw TypeError with message: "n must be an integer"
    - Otherwise return an array of length n where element i (1-based) equals fizzBuzzSingle(i)

- fizzBuzzSingle(n)
  - Signature: fizzBuzzSingle(n: number) => string
  - Behaviour:
    - If n is not a Number or is NaN, throw TypeError with message: "n must be a number"
    - If n is not an integer, throw TypeError with message: "n must be an integer"
    - If n <= 0, throw RangeError with message: "n must be a positive integer"
    - Return:
      - "FizzBuzz" when n divisible by 15
      - "Fizz" when n divisible by 3 only
      - "Buzz" when n divisible by 5 only
      - String decimal representation of n otherwise

- Documentation
  - Add JSDoc above both functions describing parameters, return type, and thrown errors.
  - Ensure README.md examples import the named exports and show programmatic and CLI usage.

- Tests
  - Update tests/unit/main.test.js (or add tests in the same file) to include explicit unit tests for fizzBuzz and fizzBuzzSingle covering:
    - fizzBuzz(15) returns array length 15 and element 15 === "FizzBuzz"
    - fizzBuzzSingle(3) === "Fizz"
    - fizzBuzzSingle(5) === "Buzz"
    - fizzBuzzSingle(15) === "FizzBuzz"
    - fizzBuzzSingle(7) === "7"
    - fizzBuzz(0) returns []
    - fizzBuzz(-1) throws RangeError
    - fizzBuzz(3.5) throws TypeError
    - fizzBuzzSingle(0) throws RangeError
    - Non-number inputs (e.g., fizzBuzz('a')) throw TypeError
  - Tests must import named exports by name (import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js') and assert exact messages where appropriate.

Acceptance Criteria

- Programmatic API: fizzBuzz and fizzBuzzSingle are exported as named ES module exports.
- Behaviour: All function behaviours and error semantics match specifications above.
- Tests: tests/unit/main.test.js contains unit tests that assert all acceptance criteria and all tests pass when running npm test.
- Documentation: README.md shows copy-paste examples for both programmatic usage and CLI usage that match the implemented behaviour.

Notes

- Keep changes minimal: prefer editing tests and JSDoc over changing runtime behaviour unless a bug is found.
- Do not add new runtime dependencies.
- Ensure CLI and web demo reuse the same exported functions rather than duplicating logic.
