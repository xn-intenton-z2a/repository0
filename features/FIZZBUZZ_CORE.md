# FIZZBUZZ_CORE

Goal

Describe and specify the core FizzBuzz behaviour to implement the library's primary functions.

Overview

Provide deterministic, side-effect free implementations of two functions:
- fizzBuzz(n): returns an array of strings representing 1..n with replacements: multiples of 3 -> Fizz, multiples of 5 -> Buzz, multiples of both -> FizzBuzz.
- fizzBuzzSingle(n): returns the single string for a positive integer n following the same replacement rules.

Behavior

- fizzBuzz(n) accepts a single numeric argument n and returns an array of length n with entries for 1..n in order.
- fizzBuzzSingle(n) accepts a single numeric argument n and returns exactly one string for that value.
- Both functions are pure and synchronous.

Acceptance criteria

- The repository exports both functions as named exports from src/lib/main.js.
- fizzBuzz(15) returns the 15-element array:
  ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"].
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- The behaviour is deterministic and does not mutate inputs or global state.
- Representative checks are implemented in tests/unit/main.test.js and assert exact string values.

Notes

This feature is the minimal, central piece of the mission and must be fully covered by unit tests in tests/unit/main.test.js.