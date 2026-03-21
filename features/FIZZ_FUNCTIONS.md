FIZZ_FUNCTIONS

# FIZZ_FUNCTIONS

Goal

Provide a clear, testable specification for the core FizzBuzz library functions exported from src/lib/main.js and the unit tests that verify them.

Description

This feature specifies the API, behaviour, edge cases and acceptance criteria for two named exports: fizzBuzz and fizzBuzzSingle. The implementation must be provided in src/lib/main.js and exercised by unit tests in tests/unit to meet the mission.

API

- Named exports: fizzBuzz(n), fizzBuzzSingle(n)
- fizzBuzz(n): returns an array of strings for integers 1..n using FizzBuzz rules.
- fizzBuzzSingle(n): returns the FizzBuzz string for the single positive integer n.

Behaviour and edge cases

- fizzBuzz(0) returns an empty array.
- Passing a negative integer to either function throws RangeError.
- Passing a non-integer to either function throws TypeError.
- fizzBuzz(n) when n >= 1 returns an array of length n with values: for multiples of 3 -> "Fizz", multiples of 5 -> "Buzz", multiples of both -> "FizzBuzz", otherwise decimal string of the number.
- fizzBuzzSingle follows the same mapping for the single integer.

Testing

- Unit tests must cover normal cases and all edge cases above.
- Tests should assert exact string values and errors thrown for invalid inputs.

Acceptance Criteria

1. fizzBuzz(15) returns an array of 15 strings with element 15 equal to "FizzBuzz".
2. fizzBuzzSingle(3) returns "Fizz".
3. fizzBuzzSingle(5) returns "Buzz".
4. fizzBuzzSingle(15) returns "FizzBuzz".
5. fizzBuzzSingle(7) returns "7".
6. fizzBuzz(0) returns an empty array.
7. Negative inputs to fizzBuzz and fizzBuzzSingle throw RangeError.
8. Non-integer inputs to fizzBuzz and fizzBuzzSingle throw TypeError.
9. All unit tests pass in the repository test harness.

Notes

Keep the implementation minimal and fully covered by unit tests to satisfy the mission.
