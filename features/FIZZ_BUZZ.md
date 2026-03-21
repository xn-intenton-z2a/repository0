# FIZZ_BUZZ

Goal

Provide the canonical feature specification for the library's core FizzBuzz behaviours and edge-case handling so implementers and tests can target a single authoritative source.

Description

Export two named functions from src/lib/main.js:

- fizzBuzz(n): returns an array of strings for integers 1..n where multiples of 3 are replaced with Fizz, multiples of 5 with Buzz, and multiples of both with FizzBuzz.
- fizzBuzzSingle(n): returns the FizzBuzz string for a single positive integer n.

Behaviour and edge cases

- If n is 0, fizzBuzz returns an empty array.
- If n is a negative integer, both functions throw RangeError.
- If n is not an integer (including floats, NaN) both functions throw TypeError.
- Functions accept only numeric inputs; non-number types throw TypeError.
- Both functions must be exported as named exports from src/lib/main.js.

Acceptance criteria

- fizzBuzz(15) returns the exact 15-element array ending with "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns an empty array [] exactly.
- Passing a negative integer throws RangeError.
- Passing a non-integer number or non-number throws TypeError.
- Unit tests covering all behaviours exist in tests/unit and pass locally.

Notes

Keep implementation minimal and well-documented; prefer clarity over cleverness. Refer to JS_NUMBER_ISINTEGER.md and JS_RANGEERROR.md in library/ for guidance on error types and messages.