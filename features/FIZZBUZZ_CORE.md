# FIZZBUZZ_CORE

Overview

Provide the canonical implementation of the FizzBuzz library core functions in src/lib/main.js and comprehensive unit tests. This feature ensures the library meets the mission: simple, well-tested, and correctly exported FizzBuzz functions. It is extended to explicitly include a memory-efficient streaming/generator API so callers can consume large ranges without allocating large arrays.

Specification

- Exports: named exports fizzBuzz, fizzBuzzSingle, and fizzBuzzGenerator from src/lib/main.js.

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

- fizzBuzzGenerator(n): a generator function (export function* fizzBuzzGenerator(n)) that yields the same sequence of strings as fizzBuzz but one value at a time for i from 1..n.
  - Validation rules identical to fizzBuzz and fizzBuzzSingle (0 yields no yields and returns immediately; negative -> RangeError; non-integer -> TypeError).
  - Use the JavaScript generator protocol (yield value; return when complete) so consumers can iterate with for...of or by calling next().
  - The generator must not allocate the whole array; it should compute and yield each value on demand.

Testing

- Add or update tests in tests/unit to fully cover normal behaviour and edge cases for all three exports:
  - Small n values: 1, 2, 3, 4, 5, 15 — assert array output and single values match expected strings.
  - Multiples of 3, 5 and 15.
  - n = 0 returns [] for fizzBuzz and the generator yields no values (for...of loop body never executes).
  - Negative n throws RangeError for all three functions.
  - Non-integer inputs (3.1, '3', NaN, Infinity) throw TypeError for all three functions.
  - Generator-specific tests: collecting [...fizzBuzzGenerator(15)] equals fizzBuzz(15); manual iteration via generator.next() yields expected sequence and done becomes true after last value.

Acceptance Criteria

- fizzBuzz(15) returns the correct 15-element array ending with "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns an empty array.
- [...fizzBuzzGenerator(15)] returns the same array as fizzBuzz(15).
- The generator yields no values for n = 0.
- Negative inputs throw RangeError; non-integer inputs throw TypeError for all three functions.
- All unit tests pass with npm test.

Implementation Notes

- Make minimal, surgical changes to src/lib/main.js to implement behaviour; prefer adding a small generator function that reuses the single-value logic rather than duplicating complex logic.
- Keep functions pure and side-effect free; do not change CLI behavior or other features as part of this change.
- Use Number.isInteger to validate integer inputs and explicit checks for NaN/Infinity.
- For error messages, include concise helpful texts such as "n must be a non-negative integer" (for RangeError) and "n must be an integer" (for TypeError) — tests may assert the error type but should avoid brittle messages unless necessary.
- Ensure named exports match package.json main.
- Keep tests fast and use Vitest in tests/unit.
