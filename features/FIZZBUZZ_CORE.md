# FIZZBUZZ_CORE

Purpose

Provide the core FizzBuzz library functions that implement the mission: fizzBuzz and fizzBuzzSingle. These functions form the canonical behaviour that unit tests and the website will exercise.

Behavior

- fizzBuzz(n) returns an array of strings for integers 1..n where multiples of 3 are replaced with Fizz, multiples of 5 with Buzz, and multiples of both with FizzBuzz.
- fizzBuzzSingle(n) returns the single string result for a positive integer n using the same substitution rules.
- Edge behaviours: n = 0 returns an empty array; negative n throws RangeError; non-integers throw TypeError.

API

- Named exports from src/lib/main.js: fizzBuzz(n), fizzBuzzSingle(n).
- Inputs: a single numeric argument. Implementations must validate argument types and ranges as described above.

Acceptance criteria

- fizzBuzz(15) returns an array of length 15 whose elements are: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz (strings where appropriate).
- fizzBuzzSingle(3) returns Fizz.
- fizzBuzzSingle(5) returns Buzz.
- fizzBuzzSingle(15) returns FizzBuzz.
- fizzBuzzSingle(7) returns 7.
- fizzBuzz(0) returns an empty array.
- Negative inputs throw RangeError and non-integers throw TypeError; these are covered by unit tests.
