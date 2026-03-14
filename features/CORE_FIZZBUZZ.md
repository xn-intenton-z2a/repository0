# CORE_FIZZBUZZ

Purpose

Provide the canonical, minimal library API implementing the mission: two named exports fizzBuzz and fizzBuzzSingle that behave exactly as specified in MISSION.md.

Behavior

- fizzBuzz(n): returns an array of strings representing numbers 1..n with multiples of 3 replaced by Fizz, multiples of 5 replaced by Buzz, and multiples of both replaced by FizzBuzz.
- fizzBuzzSingle(n): returns the Fizz/Buzz/FizzBuzz/string result for a single positive integer.

API

- Export named functions from src/lib/main.js: fizzBuzz and fizzBuzzSingle.
- Validate inputs: non-integers throw TypeError, negative numbers throw RangeError, zero is allowed for fizzBuzz and returns an empty array.

Implementation notes

- Keep implementation minimal and easy to read; prefer explicit checks over clever one-liners to make unit tests straightforward.
- Ensure both functions are pure and synchronous.

Acceptance criteria

- fizzBuzz(15) returns the correct 15-element array ending with "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns an empty array.
- Negative inputs to either function throw RangeError.
- Non-integer numeric inputs throw TypeError.
- Both functions are exported as named exports from src/lib/main.js.
