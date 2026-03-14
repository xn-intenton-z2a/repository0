# FIZZBUZZ_CORE

## Summary
Provide the primary FizzBuzz library API and exact behaviour required by the mission. This feature specifies the exported functions, edge-case handling, and unit-test acceptance criteria so the repository fulfils the mission.

## Behavior
- Export two named functions from src/lib/main.js: fizzBuzz and fizzBuzzSingle.
- fizzBuzz(n):
  - When n is 0 return an empty array.
  - For positive integer n return an array of length n where index i (1-based) contains:
    - "FizzBuzz" if i divisible by 3 and 5
    - "Fizz" if i divisible by 3 only
    - "Buzz" if i divisible by 5 only
    - otherwise the decimal string for i
  - For negative integers throw RangeError.
  - For non-integers throw TypeError.
- fizzBuzzSingle(n):
  - For positive integer n return the single FizzBuzz string as above.
  - For negative integers throw RangeError.
  - For non-integers throw TypeError.

## Acceptance Criteria
- fizzBuzz(15) returns the 15-element array ending with "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns an empty array.
- Negative inputs to either function throw RangeError.
- Non-integer inputs throw TypeError.
- Both functions are named exports from src/lib/main.js.
- Unit tests in tests/unit/ fully cover the above behaviour.

## Notes
Keep implementation small and well-documented in code comments. Tests should be deterministic and avoid external dependencies.