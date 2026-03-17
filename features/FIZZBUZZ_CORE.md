# FIZZBUZZ_CORE

Goal

Specify the deterministic, side-effect-free core behaviour of the library implementing the FizzBuzz rules.

Behavior

- fizzBuzz(n): synchronous, pure function that returns an array of length n where each element is the string representation for numbers 1 through n with these replacements: multiples of 3 -> Fizz, multiples of 5 -> Buzz, multiples of both -> FizzBuzz.
- fizzBuzzSingle(n): synchronous, pure function that returns the single string result for a positive integer n following the same replacement rules.

Invariants

- The functions do not mutate inputs or global state.
- For all positive integers k, fizzBuzzSingle(k) === fizzBuzz(k)[k-1].

Acceptance criteria

- Both functions are exported as named exports from src/lib/main.js.
- fizzBuzz(15) returns a 15-element array ending with FizzBuzz as the 15th element and matching the canonical sequence for 1..15.
- fizzBuzzSingle(3) returns Fizz, fizzBuzzSingle(5) returns Buzz, fizzBuzzSingle(15) returns FizzBuzz, fizzBuzzSingle(7) returns 7.
- Representative checks are implemented in unit tests that assert exact string values and array contents.

Notes

Implementation must be simple and readable; favor clarity over micro-optimizations for this educational library.