# FIZZ_BUZZ

## Summary
Add a focused FizzBuzz library feature that implements and documents the core mission functions: fizzBuzz(n) and fizzBuzzSingle(n). Provide a clear specification, edge-case handling, examples, and explicit acceptance criteria so maintainers can implement and test the feature in a single source file with accompanying unit tests and README examples.

## Rationale
The repository's mission is a minimal JavaScript library exporting FizzBuzz functions; this feature centralises the specification, acceptance criteria, and implementation notes to ensure predictable behaviour, complete tests, and clear examples for users and CI.

## Specification
- Exports (named): fizzBuzz, fizzBuzzSingle from src/lib/main.js.
- fizzBuzzSingle(n):
  - Input: a single value expected to be an integer > 0.
  - Output: string: "Fizz" if divisible by 3, "Buzz" if divisible by 5, "FizzBuzz" if divisible by both, otherwise the decimal integer as a string.
  - Errors: throw TypeError if input is not an integer; throw RangeError if input is less than 1.
- fizzBuzz(n):
  - Input: integer n >= 0.
  - Output: array of length n, containing fizzBuzzSingle results for integers 1..n.
  - Edge cases: n = 0 returns an empty array; negative n throws RangeError; non-integer n throws TypeError.

## Behavioural Details
- Validation: use Number.isInteger to detect integers. Treat numeric strings or other types as invalid.
- Determinism: functions must be pure and synchronous.
- Performance: linear in n with minimal memory overhead (single array result).

## Examples (to include in README and docs)
- fizzBuzzSingle(3) -> "Fizz"
- fizzBuzzSingle(5) -> "Buzz"
- fizzBuzzSingle(15) -> "FizzBuzz"
- fizzBuzzSingle(7) -> "7"
- fizzBuzz(15) -> returns array of strings from "1" to "FizzBuzz" at position 15
- fizzBuzz(0) -> []

## Tests and Acceptance Criteria
The unit tests shall exercise normal and edge cases and assert exact outputs and thrown errors.
Acceptance criteria (all must be satisfied):
- fizzBuzz(15) returns the correct 15-element array ending with "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns []
- Non-integer inputs to either function throw TypeError.
- Negative integers throw RangeError.
- Both functions are exported as named exports from src/lib/main.js.
- README shows the usage examples above.

## Implementation Notes
- Changes will be limited to: src/lib/main.js, tests/unit/main.test.js, README.md, and examples/ demonstration files if present.
- Tests should use Vitest and match the acceptance criteria exactly.
- Keep changes minimal and focused; prefer small, well-tested edits.

## Files to update
- src/lib/main.js (implement and export functions)
- tests/unit/main.test.js (add/ensure comprehensive tests)
- README.md (add usage examples)
- examples/ (optional small demo file showing usage)

