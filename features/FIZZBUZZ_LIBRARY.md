# FIZZBUZZ_LIBRARY

Feature name

FIZZBUZZ_LIBRARY

Summary

A focused, testable JavaScript library feature exporting two named functions: fizzBuzz and fizzBuzzSingle. This feature implements the exact behavior and input validation required by the mission, includes clear API surface, usage examples, and precise acceptance criteria so unit tests can verify correct behavior.

Motivation

Ensure the repository provides a minimal, correct, and well-documented FizzBuzz library that can be consumed by the web demo and CLI, and that satisfies the mission acceptance criteria and unit tests in tests/unit/.

Specification

Exports

- Named export: fizzBuzz(n)
  - Signature: function fizzBuzz(n: number): string[]
  - Behavior: Returns an array of length n containing the FizzBuzz sequence for integers 1..n using rules: divisible by 3 => "Fizz", divisible by 5 => "Buzz", divisible by both => "FizzBuzz", otherwise the decimal string of the number.
  - Edge cases and validation:
    - If n === 0, return an empty array []
    - If n is negative, throw RangeError with a descriptive message
    - If n is not an integer, throw TypeError with a descriptive message
- Named export: fizzBuzzSingle(n)
  - Signature: function fizzBuzzSingle(n: number): string
  - Behavior: Returns the FizzBuzz string for a single positive integer n using the same rules as above.
  - Edge cases and validation:
    - If n is not a finite integer greater than 0, follow same validation rules as above (TypeError for non-integers, RangeError for negatives or zero when appropriate for single-value semantics if tests expect error for zero; otherwise handle 0 explicitly by returning "0" as string if required by tests). Prefer behavior consistent with mission tests: single-value expects positive integer inputs; invalid inputs raise errors.

Examples

- fizzBuzz(5) -> ["1","2","Fizz","4","Buzz"]
- fizzBuzzSingle(3) -> "Fizz"

Implementation notes

- Keep implementations small and pure with no side effects so unit tests can import functions directly.
- Use Array.from or a simple loop to construct the array for fizzBuzz to match library guidance in ARRAY_FROM.md.
- Export both functions as named ESM exports from src/lib/main.js.
- Do not add runtime dependencies.

Testing and acceptance criteria

Include comprehensive unit tests in tests/unit/ to assert:

- fizzBuzz(15) returns an array of length 15 ending with "FizzBuzz"
- fizzBuzzSingle(3) returns "Fizz"
- fizzBuzzSingle(5) returns "Buzz"
- fizzBuzzSingle(15) returns "FizzBuzz"
- fizzBuzzSingle(7) returns "7"
- fizzBuzz(0) returns []
- Passing a negative number to fizzBuzz or fizzBuzzSingle throws RangeError
- Passing a non-integer to fizzBuzz or fizzBuzzSingle throws TypeError

Acceptance criteria

- All unit tests pass
- README.md documents usage with examples for both exports
- The web demo (WEB_DEMO feature) can import and demonstrate the library functions

Compatibility and constraints

- Feature must be implementable within src/lib/main.js and verified by changes to the corresponding unit tests in tests/unit/
- Keep feature file count within repository limits (2 max)
- Do not introduce new files outside allowed set (source, tests, README, dependencies, examples)

Notes

- This document is compatible with CONTRIBUTING.md guidelines: keep behaviour explicit, include examples, and provide direct acceptance criteria for tests.
- If the current WEB_DEMO feature already covers demonstrating usage, ensure that demo imports the named exports and uses them; update WEB_DEMO spec if necessary.