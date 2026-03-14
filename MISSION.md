# Mission

A JavaScript library exporting FizzBuzz functions. This is the simplest possible mission — if the pipeline can't complete this and stop, something is fundamentally broken.

## Core Functions

- `fizzBuzz(n)` — return an array of strings from 1 to n, replacing multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz".
- `fizzBuzzSingle(n)` — return the FizzBuzz string for a single positive integer.

## Requirements

- Handle edge cases: `n = 0` returns an empty array, negative numbers throw `RangeError`, non-integers throw `TypeError`.
- Export both functions as named exports from `src/lib/main.js`.
- Comprehensive unit tests covering normal operation and all edge cases.
- README with usage examples.

## Acceptance Criteria

- [ ] `fizzBuzz(15)` returns the correct 15-element array ending with "FizzBuzz"
- [ ] `fizzBuzzSingle(3)` returns "Fizz"
- [ ] `fizzBuzzSingle(5)` returns "Buzz"
- [ ] `fizzBuzzSingle(15)` returns "FizzBuzz"
- [ ] `fizzBuzzSingle(7)` returns "7"
- [ ] `fizzBuzz(0)` returns `[]`
- [ ] All unit tests pass
- [ ] README documents usage with examples
