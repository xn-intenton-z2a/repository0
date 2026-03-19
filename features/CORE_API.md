# CORE_API

## Summary
Define the library's core API: two named exports from src/lib/main.js, fizzBuzz and fizzBuzzSingle, implementing the classic FizzBuzz rules and the input validation required by the mission. This feature is the authoritative specification other features (tests, CLI, README, web demo) rely on.

## Behavior
- fizzBuzz(n)
  - Accepts n as a number. If n is a non-integer, throw TypeError. If n is negative, throw RangeError. If n is 0 return an empty array.
  - Returns an array of length n containing the FizzBuzz string for each integer i in 1..n where:
    - i divisible by 3 -> "Fizz"
    - i divisible by 5 -> "Buzz"
    - i divisible by both 3 and 5 -> "FizzBuzz"
    - otherwise the decimal representation of i
- fizzBuzzSingle(n)
  - Accepts n as a number. If n is a non-integer, throw TypeError. If n is less than 1, throw RangeError.
  - Returns the single FizzBuzz string for integer n applying the same substitution rules as fizzBuzz.

## Module and exports
- Both functions must be exported as named exports from src/lib/main.js (export { fizzBuzz, fizzBuzzSingle }).
- Implementation should be synchronous and pure (no side effects such as console output or global state) so it is easy to unit test and reuse from the web demo and CLI.

## Edge cases and errors
- fizzBuzz(0) returns [] (empty array).
- Negative inputs throw RangeError with a clear message.
- Non-integer numeric inputs throw TypeError with a clear message.
- fizzBuzzSingle treats 0 and negatives as invalid and throws RangeError; non-integers throw TypeError.

## Acceptance criteria
- fizzBuzz(15) returns a 15-element array following the rules above and the 15th element is the string "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns the string "7".
- fizzBuzz(0) returns an empty array [] exactly.
- fizzBuzz(-1) throws RangeError; fizzBuzz(2.5) throws TypeError.
- fizzBuzzSingle(0) and fizzBuzzSingle(-3) throw RangeError; fizzBuzzSingle(3.14) throws TypeError.
- Both functions are exported as named exports from src/lib/main.js and importing them via import { fizzBuzz, fizzBuzzSingle } from 'src/lib/main.js' (or from package root) resolves the functions.
- Unit tests must exist in tests/unit/ that assert exact string values, array lengths, and thrown error types for all above cases and be runnable with npm test.
- README contains examples demonstrating library import usage and CLI invocation that exercise these functions.

## Notes
- This spec intentionally centralizes the canonical behavior and acceptance criteria so other feature specs (INPUT_VALIDATION, TEST_COVERAGE, README_EXAMPLES, CLI_TOOL, WEB_DEMO) can reference it and avoid divergence.
