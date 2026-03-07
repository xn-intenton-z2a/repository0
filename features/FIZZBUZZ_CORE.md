# FIZZBUZZ_CORE

## Summary

Specification for the core library feature that implements and exports the FizzBuzz functions required by the mission: fizzBuzz and fizzBuzzSingle. This feature ensures correct behaviour, robust input validation, and comprehensive unit tests.

## Motivation

The mission of this repository is to provide a JavaScript library exporting FizzBuzz functions. This feature formalises the expectations, edge cases, and tests so contributors can implement or verify the library reliably.

## API

- Named exports from src/lib/main.js: fizzBuzz, fizzBuzzSingle
- fizzBuzz(n) -> Array of strings. Generates the FizzBuzz sequence from 1 to n inclusive.
- fizzBuzzSingle(n) -> String. Returns the FizzBuzz replacement for the single positive integer n.

Behaviour rules:
- A positive integer divisible by 3 returns "Fizz".
- A positive integer divisible by 5 returns "Buzz".
- A positive integer divisible by both 3 and 5 returns "FizzBuzz".
- Other positive integers return their decimal string representation.

Input validation:
- n = 0: fizzBuzz(0) returns an empty array.
- Negative numbers: throw RangeError with a clear message.
- Non-integers: throw TypeError with a clear message.
- Non-number types: throw TypeError.

## Acceptance criteria

- [ ] fizzBuzz(15) returns an array of length 15 whose last element is "FizzBuzz" and whose entries match the standard FizzBuzz sequence.
- [ ] fizzBuzzSingle(3) returns "Fizz".
- [ ] fizzBuzzSingle(5) returns "Buzz".
- [ ] fizzBuzzSingle(15) returns "FizzBuzz".
- [ ] fizzBuzzSingle(7) returns "7".
- [ ] fizzBuzz(0) returns an empty array [] (not null or undefined).
- [ ] Passing a negative number to either function throws RangeError.
- [ ] Passing a non-integer numeric value throws TypeError.
- [ ] Both functions are exported as named exports from src/lib/main.js.
- [ ] Unit tests cover normal behaviour and all listed edge cases.

## Tests (guidance)

Add or update tests in tests/unit/main.test.js. Include:
- Basic smoke tests for fizzBuzzSingle: 1, 2, 3, 4, 5, 15.
- Short sequence tests for fizzBuzz: n = 0, 1, 3, 5, 15.
- Error tests: negative inputs and non-integer numbers like 3.5, NaN, undefined.
- Type tests: passing strings or objects should raise TypeError.

Example expected mappings (plain text examples):
- fizzBuzzSingle(3) -> Fizz
- fizzBuzzSingle(5) -> Buzz
- fizzBuzzSingle(15) -> FizzBuzz
- fizzBuzzSingle(7) -> 7

## Implementation notes

- Keep implementation pure and synchronous; no side effects.
- Avoid global state; functions should be deterministic.
- Keep error messages stable and precise to make tests robust.
- Update README.md to include usage examples for both functions.

## Backwards compatibility

This is the canonical implementation for the mission; no prior API exists that must be preserved. Maintain stable export names and behaviours described above.
