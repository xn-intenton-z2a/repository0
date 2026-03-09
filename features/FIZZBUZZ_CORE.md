# FIZZBUZZ_CORE

Summary

A concise, testable implementation specification for the core FizzBuzz library. This feature defines the API, error handling, behaviour, and unit test requirements for the primary library functions exported from src/lib/main.js.

Rationale

The mission of this repository is a JavaScript library exporting FizzBuzz functions that are simple, correct, and well-tested. This feature ensures the library satisfies the mission acceptance criteria and handles edge cases.

Scope

- Implement and export named functions fizzBuzz and fizzBuzzSingle from src/lib/main.js.
- Enforce input validation and error types: non-integer inputs throw TypeError, negative numbers throw RangeError, zero returns an empty array for fizzBuzz.
- Add or update unit tests in tests/unit/ to cover normal and edge cases.

API

- fizzBuzz(n): returns an array of strings for integers 1..n following FizzBuzz rules. When n is 0, returns an empty array. If n is negative, throws RangeError. If n is not an integer, throws TypeError.
- fizzBuzzSingle(n): returns a single string following FizzBuzz rules for the given positive integer. If input is non-integer, throws TypeError. If input is negative or zero, behavior: zero is allowed for fizzBuzz only; fizzBuzzSingle should accept positive integers and throw RangeError for numbers less than 1.

Tests

Unit tests must verify:
- fizzBuzz(15) returns 15-element array ending with FizzBuzz.
- fizzBuzz(0) returns an empty array.
- fizzBuzzSingle(3) returns Fizz.
- fizzBuzzSingle(5) returns Buzz.
- fizzBuzzSingle(15) returns FizzBuzz.
- fizzBuzzSingle(7) returns "7".
- Non-integer inputs to either function throw TypeError.
- Negative inputs throw RangeError where specified.

Acceptance Criteria

- Both functions are exported as named exports from src/lib/main.js.
- All unit tests described above are added or updated and pass.
- README documents the two functions with usage examples and notes about thrown errors.

Implementation Notes

- Keep implementation minimal and pure-functional with no side effects.
- Tests should assert exact return values and thrown error types.
- Avoid introducing new dependencies.

Backward Compatibility

- This feature is the canonical implementation for the mission and should replace any placeholder implementations while preserving the public API described here.
