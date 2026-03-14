# CORE_FIZZBUZZ

Purpose

Define and standardize the library core: two named exports fizzBuzz and fizzBuzzSingle and their exact behaviour, error handling and testable outputs so unit tests can be written against deterministic behaviour.

Specification

The library exports two named functions from src/lib/main.js: fizzBuzz and fizzBuzzSingle.

fizzBuzz(n)

- Accepts a single numeric input n and returns an array of strings representing 1..n inclusive.
- For each integer i from 1 to n: if i is divisible by 3 return Fizz; if divisible by 5 return Buzz; if divisible by both 3 and 5 return FizzBuzz; otherwise return the decimal string form of i.
- If n is 0 return an empty array.
- If n is a negative integer throw a RangeError whose message includes the word range or negative.
- If n is not an integer (including NaN, floating point with fractional component, or non-number) throw a TypeError.

fizzBuzzSingle(n)

- Accepts a single positive integer n and returns the Fizz/Buzz/FizzBuzz string for that integer using the same rules above.
- If n is not a positive integer throw a TypeError for non-integers and RangeError for negative or zero where appropriate; tests will assert the exact error class is used.

Edge cases and validation

- n = 0 for fizzBuzz returns an empty array.
- Negative inputs must throw RangeError.
- Non-integer numeric inputs (e.g. 2.5) must throw TypeError.
- Non-number inputs must throw TypeError.
- The functions must not mutate input values or rely on global state.

Testing guidance

- Unit tests must exercise happy paths and all listed edge cases.
- Exact-return checks: fizzBuzz(15) must return an array of length 15 with the fifteenth element equal to FizzBuzz.
- Exact single checks: fizzBuzzSingle(3) returns Fizz, fizzBuzzSingle(5) returns Buzz, fizzBuzzSingle(15) returns FizzBuzz, fizzBuzzSingle(7) returns 7.

Acceptance Criteria

- fizzBuzz(15) returns an array of 15 strings where element 15 is FizzBuzz and earlier positions match their expected values.
- fizzBuzzSingle(3) returns Fizz.
- fizzBuzzSingle(5) returns Buzz.
- fizzBuzzSingle(15) returns FizzBuzz.
- fizzBuzzSingle(7) returns 7.
- fizzBuzz(0) returns an empty array.
- Negative numbers passed to either function throw RangeError.
- Non-integers or non-number inputs throw TypeError.
- Both functions are exported as named exports from src/lib/main.js.
- Unit tests covering these behaviours are present in tests/unit and pass.
