# FIZZBUZZ_CORE

## Summary
Small, focused feature to implement the library core required by the mission: two named exports, fizzBuzz and fizzBuzzSingle, in src/lib/main.js. This feature defines behavior, validation rules, and tests for the core FizzBuzz functionality so the project satisfies the mission acceptance criteria.

## Goals
- Provide a library API that exports fizzBuzz and fizzBuzzSingle as named exports from src/lib/main.js.
- Implement input validation and clear error types for invalid inputs.
- Cover the API with comprehensive unit tests in tests/unit/ to guard normal and edge case behavior.

## Behavior
- fizzBuzz(n): returns an array of strings for every integer from 1 to n inclusive.
  - Multiples of 3 are replaced with Fizz.
  - Multiples of 5 are replaced with Buzz.
  - Multiples of both 3 and 5 are replaced with FizzBuzz.
  - If n is 0, return an empty array.
- fizzBuzzSingle(n): returns the single FizzBuzz string for the positive integer n.

## Validation and Errors
- Non-integer input should throw TypeError with a helpful message.
- Negative integers should throw RangeError with a helpful message.
- Zero for fizzBuzz is allowed and returns an empty array; zero for fizzBuzzSingle is a RangeError.

## Implementation Notes
- Keep implementation compact and fully synchronous in src/lib/main.js so tests run quickly.
- Export both functions as named exports and ensure default module entry still points to src/lib/main.js per package.json.
- Place unit tests under tests/unit/ matching repository patterns.

## Acceptance Criteria
- [ ] fizzBuzz(15) returns exactly 15 strings with the last element equal to FizzBuzz.
- [ ] fizzBuzzSingle(3) returns Fizz.
- [ ] fizzBuzzSingle(5) returns Buzz.
- [ ] fizzBuzzSingle(15) returns FizzBuzz.
- [ ] fizzBuzzSingle(7) returns 7.
- [ ] fizzBuzz(0) returns an empty array.
- [ ] Non-integer inputs to either function throw TypeError.
- [ ] Negative integers to either function throw RangeError.
- [ ] All unit tests pass when running npm test

---

Notes for contributors: follow repository style and add only minimal changes to satisfy tests. Tests should not weaken assertions to force a pass.