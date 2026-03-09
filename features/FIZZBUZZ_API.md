# FIZZBUZZ_API

## Summary

Add a concise FizzBuzz API feature to the library: export and document two functions, fizzBuzz and fizzBuzzSingle, with precise behavior, edge case handling, and unit tests. This feature ensures the library meets the mission by providing the core API, examples, and tests that validate required behaviour.

## Motivation

The repository's mission is a JavaScript library exporting FizzBuzz functions. This feature makes the API explicit, testable, and documented, allowing consumers and automated workflows to rely on exact behaviour.

## Specification

1. Exports
   - Named exports from src/lib/main.js:
     - fizzBuzz(n): returns an array of strings for 1..n following FizzBuzz rules.
     - fizzBuzzSingle(n): returns a single string for integer n following FizzBuzz rules.

2. Behavior
   - fizzBuzz(n):
     - If n is 0, returns an empty array.
     - If n is negative, throws RangeError with message "n must be a positive integer".
     - If n is not an integer, throws TypeError with message "n must be an integer".
     - For positive integers, returns an array of length n where position i (1-based) yields:
       - "FizzBuzz" when i divisible by 3 and 5
       - "Fizz" when i divisible by 3
       - "Buzz" when i divisible by 5
       - The decimal string of i otherwise

   - fizzBuzzSingle(n):
     - If n is not an integer, throws TypeError with message "n must be an integer".
     - If n is negative or zero, throws RangeError with message "n must be a positive integer" for non-positive values.
     - Returns "FizzBuzz", "Fizz", "Buzz", or decimal string for a single value following the same divisibility rules.

3. Tests
   - Add or ensure unit tests in tests/unit verify all acceptance criteria:
     - fizzBuzz(15) returns the correct 15-element array ending with "FizzBuzz".
     - fizzBuzzSingle(3) returns "Fizz".
     - fizzBuzzSingle(5) returns "Buzz".
     - fizzBuzzSingle(15) returns "FizzBuzz".
     - fizzBuzzSingle(7) returns "7".
     - fizzBuzz(0) returns [].
     - Type and Range errors are thrown for invalid inputs.

4. Documentation
   - Update README.md examples section or add usage examples showing both functions, expected outputs, and error cases.

## Acceptance Criteria

- Named exports fizzBuzz and fizzBuzzSingle exist in src/lib/main.js and match the specified behavior.
- Unit tests in tests/unit pass and cover all edge cases listed above.
- README contains usage examples for both functions.

## Notes

- Keep implementation minimal and well-tested.
- Do not alter unrelated files; only update source, tests, README, dependencies or examples if needed.
