# FIZZBUZZ_LIBRARY

## Summary
Add a well-specified library feature implemented in src/lib/main.js that exposes the canonical FizzBuzz API required by the mission. This feature documents the exports, behaviour, edge-case handling, examples, and unit-test acceptance criteria so implementers and tests have a single source of truth.

## Goals
- Ensure named exports fizzBuzz and fizzBuzzSingle exist and match mission semantics.
- Require precise error handling: n = 0 returns [], negative numbers throw RangeError, non-integers throw TypeError.
- Provide usage examples for both library and CLI usage.
- Provide clear unit-test acceptance criteria so tests can assert exact behaviour.

## API
- fizzBuzz(n): Array<string>
  - For integer n >= 1 returns array of strings for 1..n with Fizz/Buzz/FizzBuzz substitutions.
  - For n === 0 returns an empty array.
  - For negative integers throws RangeError with message: "n must be a non-negative integer".
  - For non-integer numbers throws TypeError with message: "n must be an integer".

- fizzBuzzSingle(n): string
  - For integer n >= 1 returns the string for the single number according to FizzBuzz rules.
  - For negative integers throws RangeError.
  - For non-integer numbers throws TypeError.

## Examples
- Library usage example (to appear in README and docs):
  - fizzBuzz(5) -> ["1","2","Fizz","4","Buzz"]
  - fizzBuzzSingle(15) -> "FizzBuzz"

- CLI usage example (node src/lib/main.js) should call fizzBuzzSingle when given a single numeric arg and print the result.

## Acceptance Criteria
- fizzBuzz(15) returns a 15-element array with the correct substitutions and last element "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns [].
- Passing -1 to either function throws RangeError.
- Passing 2.5 to either function throws TypeError.
- README includes the documented examples and usage lines.

## Notes
- This feature is intentionally narrow and aligns strictly with the mission. Tests and web demo features should rely on this canonical spec.
