# FIZZBUZZ_CORE

Summary

Define and export the core library functions that implement the mission's FizzBuzz behaviour for programmatic consumption. These functions must be small, well-documented, and exported as named exports from src/lib/main.js.

Behaviour

- Provide function fizzBuzz(n) that returns an array of strings representing numbers 1 through n with multiples of 3 replaced by Fizz, multiples of 5 replaced by Buzz, and multiples of both replaced by FizzBuzz.
- Provide function fizzBuzzSingle(n) that returns the single string result for a positive integer n following the same replacement rules.
- Input validation rules:
  - If n is zero, fizzBuzz returns an empty array.
  - If n is negative, both functions throw a RangeError with a clear message.
  - If n is not an integer, both functions throw a TypeError with a clear message.

Implementation notes

- Export both functions as named exports from src/lib/main.js.
- Keep functions pure and free of side-effects to make testing straightforward.
- Avoid logging to stdout/stderr from library functions; presentation is handled by separate features.

Acceptance criteria

- fizzBuzz(15) returns an array of 15 strings ending with FizzBuzz as the 15th element.
- fizzBuzzSingle(3) returns Fizz.
- fizzBuzzSingle(5) returns Buzz.
- fizzBuzzSingle(15) returns FizzBuzz.
- fizzBuzzSingle(7) returns 7.
- fizzBuzz(0) returns an empty array.
- Negative inputs produce a RangeError and non-integer inputs produce a TypeError.
- Functions are exported as named exports from src/lib/main.js and are callable when required by the tests.