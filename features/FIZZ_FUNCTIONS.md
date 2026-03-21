FIZZ_FUNCTIONS

# FIZZ_FUNCTIONS

Status: Implemented

Goal

Provide a clear, testable specification for the core FizzBuzz library functions exported from src/lib/main.js and the unit tests that verify them.

Description

This feature specifies the API, behaviour, edge cases and final acceptance criteria for two named exports: fizzBuzz and fizzBuzzSingle. The implementation lives at src/lib/main.js and is exercised by unit tests in tests/unit.

Implementation

- See implementation: src/lib/main.js

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

Final Acceptance Criteria

1. The repository exports named functions fizzBuzz and fizzBuzzSingle from src/lib/main.js.
2. fizzBuzz(15) returns an array of 15 strings with element 15 equal to "FizzBuzz".
3. fizzBuzzSingle(3) returns "Fizz".
4. fizzBuzzSingle(5) returns "Buzz".
5. fizzBuzzSingle(15) returns "FizzBuzz".
6. fizzBuzzSingle(7) returns "7".
7. fizzBuzz(0) returns an empty array.
8. Passing a negative integer to fizzBuzz or fizzBuzzSingle throws RangeError.
9. Passing a non-integer (e.g., 3.5, '4', null, undefined) to either function throws TypeError.
10. Unit tests covering the examples and error cases exist under tests/unit and pass when running npm test.

Notes

- The implementation is intentionally minimal and should remain straightforward to keep tests readable and deterministic.
