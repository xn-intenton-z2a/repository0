# CORE_FIZZBUZZ

Summary

Implement the core FizzBuzz library functions and export them as named exports from src/lib/main.js so the project fulfils the mission's primary behaviour.

Specification

- Export named functions fizzBuzz and fizzBuzzSingle from src/lib/main.js.
- fizzBuzz(n) returns an array of strings for numbers 1..n where multiples of 3 are replaced by Fizz, multiples of 5 by Buzz and multiples of both by FizzBuzz.
- fizzBuzzSingle(n) returns the FizzBuzz string for a single positive integer.

Acceptance Criteria

- [ ] fizzBuzz(15) returns an array of 15 strings with the last element equal to FizzBuzz.
- [ ] fizzBuzzSingle(3) returns Fizz.
- [ ] fizzBuzzSingle(5) returns Buzz.
- [ ] fizzBuzzSingle(15) returns FizzBuzz.
- [ ] fizzBuzzSingle(7) returns 7 (string).
- [ ] Both functions are exported as named exports from src/lib/main.js and importable by tests and the website.
