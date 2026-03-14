# FIZZBUZZ_CORE

## Summary
Provide the primary FizzBuzz library API and exact behaviour required by the mission. This feature specifies the exported functions, edge-case handling, and unit-test acceptance criteria so the repository fulfils the mission.

## Behavior
- Export two named functions from src/lib/main.js: fizzBuzz and fizzBuzzSingle.
- fizzBuzz(n):
  - When n is 0 return an empty array.
  - For positive integer n return an array of length n where element for i (1-based) contains:
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

## Acceptance Criteria (testable)
- fizzBuzz(15) returns an array of length 15 with the final element "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7" (string "7").
- fizzBuzz(0) returns an empty array [] (exact equality).
- Passing a negative integer to either function throws a RangeError.
- Passing a non-integer (including floats and non-number types) to either function throws a TypeError.
- Both functions are exported as named exports from src/lib/main.js.
- Unit tests in tests/unit/ cover all acceptance criteria and edge cases.

## Notes
Keep implementation minimal, well-documented in-code, and avoid duplicating logic across CLI or demos; import the library where needed.