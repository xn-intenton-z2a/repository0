# CORE_API

Purpose
Provide the core library API: two named exports, fizzBuzz and fizzBuzzSingle, implemented in src/lib/main.js.

Specification
- fizzBuzz(n) returns an array of strings representing the sequence 1..n where multiples of 3 are replaced with Fizz, multiples of 5 with Buzz, and multiples of both with FizzBuzz.
- fizzBuzzSingle(n) returns the appropriate Fizz/Buzz/FizzBuzz string for a single positive integer.
- Both functions are pure; side-effect-free and deterministic.

Acceptance criteria
- [ ] fizzBuzz(15) returns a 15-element array whose last element is FizzBuzz
- [ ] fizzBuzzSingle(3) returns Fizz
- [ ] fizzBuzzSingle(5) returns Buzz
- [ ] fizzBuzzSingle(15) returns FizzBuzz
- [ ] fizzBuzzSingle(7) returns 7
- [ ] Both functions are exported as named exports from src/lib/main.js

Implementation notes
Keep the implementation simple and readable; prefer clarity over clever micro-optimisations.
