# CORE_API

## Summary
Define the library's core API: two named exports from src/lib/main.js, fizzBuzz and fizzBuzzSingle, implementing the classic FizzBuzz rules.

## Behavior
- fizzBuzz(n): for n a non-negative integer return an array of length n containing the string result for each i in 1..n following rules:
  - multiples of 3 produce Fizz
  - multiples of 5 produce Buzz
  - multiples of both produce FizzBuzz
  - otherwise the decimal representation of i
- fizzBuzzSingle(n): for a single positive integer return the corresponding FizzBuzz string.

## Acceptance criteria
- fizzBuzz and fizzBuzzSingle are exported as named exports from src/lib/main.js.
- fizzBuzz(15) returns a 15-element array whose 15th element is FizzBuzz and whose elements follow the rules above.
- fizzBuzzSingle(3) returns Fizz.
- fizzBuzzSingle(5) returns Buzz.
- fizzBuzzSingle(15) returns FizzBuzz.
- fizzBuzzSingle(7) returns 7.
