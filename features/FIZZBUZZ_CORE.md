# FIZZBUZZ_CORE

Overview

Provide the canonical implementation of the FizzBuzz library core functions in src/lib/main.js and comprehensive unit tests. This feature ensures the library meets the mission: simple, well-tested, and correctly exported FizzBuzz functions.

Specification

- Exports: named exports fizzBuzz and fizzBuzzSingle from src/lib/main.js.
- fizzBuzz(n): returns an array of strings for integers 1..n applying traditional FizzBuzz rules.
  - If n is 0, return an empty array.
  - If n is negative, throw a RangeError with a helpful message.
  - If n is not an integer (including non-number types), throw a TypeError with a helpful message.
  - Behavior: for each integer i from 1..n produce:
    - "FizzBuzz" when i % 15 === 0
    - "Fizz" when i % 3 === 0
    - "Buzz" when i % 5 === 0
    - otherwise the decimal string of i
- fizzBuzzSingle(n): returns the single FizzBuzz string for a positive integer n with the same validation rules as above.

Testing

- Add or update tests in tests/unit to fully cover normal behaviour and edge cases:
  - small n values (1,2,3,4,5,15)
  - multiples of 3, 5 and 15
  - n = 0 returns []
  - negative n throws RangeError
  - non-integer inputs (3.1, '3', NaN, Infinity) throw TypeError
- Tests must assert exact string values and exact Error types/messages where specified.

Acceptance Criteria

- fizzBuzz(15) returns the correct 15-element array ending with "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns an empty array.
- Negative inputs throw RangeError; non-integer inputs throw TypeError.
- All unit tests pass with npm test.

Implementation Notes

- Make the smallest possible changes to src/lib/main.js to implement behaviour.
- Keep code simple and idiomatic JavaScript; avoid side effects and keep functions pure.
- Ensure named exports match package.json main.
- Tests should remain fast and use vitest in tests/unit.
