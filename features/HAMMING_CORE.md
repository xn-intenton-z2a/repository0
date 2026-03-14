# FIZZBUZZ_CORE

Purpose

Provide the canonical feature specification for the library's core FizzBuzz functionality and its API surface. This feature ensures the library exports correct, well-documented and testable fizzBuzz and fizzBuzzSingle functions that satisfy the mission.

Behavior

- Export named functions fizzBuzz(n) and fizzBuzzSingle(n) from src/lib/main.js.
- fizzBuzz(n) returns an array of strings for integers 1..n inclusive, applying Fizz/Buzz/FizzBuzz substitutions.
- fizzBuzzSingle(n) returns the single string result for a positive integer n.
- Input validation:
  - n = 0 returns an empty array for fizzBuzz; fizzBuzzSingle(0) throws RangeError.
  - Negative numbers throw RangeError for both functions.
  - Non-integer numbers throw TypeError for both functions.

Edge cases and performance

- Very large n should be handled in a streaming-friendly way but for this repository an O(n) algorithm is acceptable.
- Functions should not mutate their inputs and must be pure.

Acceptance Criteria

- fizzBuzz and fizzBuzzSingle are exported as named exports from src/lib/main.js.
- fizzBuzz(15) returns an array of 15 strings with the last element equal to "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7" (string).
- fizzBuzz(0) returns an empty array.
- Passing a negative integer to either function throws RangeError.
- Passing a non-integer (e.g. 3.5 or "3") to either function throws TypeError.
- Unit tests exist in tests/unit covering each acceptance criterion.

Notes

This feature is the primary mission. Keep the implementation minimal, well-documented, and fully covered by unit tests.