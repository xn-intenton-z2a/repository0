# CORE_FIZZBUZZ

Purpose

Define and standard, in a concise machine-testable way, the core API surface required by the mission: two named exports fizzBuzz and fizzBuzzSingle and their deterministic behaviour for valid inputs and error cases.

Specification

- Exports: named exports fizzBuzz and fizzBuzzSingle from src/lib/main.js.
- fizzBuzz(n):
  - Accepts a single numeric input n and returns an array of strings for integers 1..n inclusive.
  - For each integer i from 1 to n: if i is divisible by 3 return Fizz; if divisible by 5 return Buzz; if divisible by both 3 and 5 return FizzBuzz; otherwise return the decimal string form of i.
  - If n is 0 return an empty array.
  - If n is negative throw RangeError.
  - If n is not an integer or not a number throw TypeError.
- fizzBuzzSingle(n):
  - Accepts a single integer n and returns the single Fizz/Buzz/FizzBuzz/string result using the same rules.
  - For n <= 0 throw RangeError (single-call requires positive integer); non-integers and non-number inputs throw TypeError.
- Neither function mutates inputs or relies on external state.

Testing guidance

- Unit tests must assert both return values and error classes (TypeError or RangeError) and may assert message substrings for identification.
- Key examples to test: fizzBuzz(15), fizzBuzz(0), fizzBuzzSingle(3), fizzBuzzSingle(5), fizzBuzzSingle(15), fizzBuzzSingle(7), negative and non-integer inputs.

Acceptance Criteria

- fizzBuzz(15) returns an array of length 15 whose fifteenth element equals FizzBuzz.
- fizzBuzzSingle(3) returns Fizz; fizzBuzzSingle(5) returns Buzz; fizzBuzzSingle(15) returns FizzBuzz; fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns an empty array.
- Negative values passed to either function throw RangeError.
- Non-integer or non-number inputs throw TypeError.
- Both functions are exported as named exports from src/lib/main.js and covered by unit tests in tests/unit.
