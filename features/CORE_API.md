# CORE_API

Summary

Implement the library core API by adding two named exports to src/lib/main.js: fizzBuzz and fizzBuzzSingle. These functions provide the canonical FizzBuzz behaviour for the project and are the primary surface the tests and website will exercise.

Specification

- fizzBuzz(n): return an array of length n containing the FizzBuzz mapping for the integers 1 through n inclusive. When n is 0 return an empty array. Replace multiples of 3 with the literal string Fizz, multiples of 5 with the literal string Buzz, and multiples of both with the literal string FizzBuzz. For other numbers return the decimal string form of the number.

- fizzBuzzSingle(n): return a single string value for the integer n using the same mapping rules as fizzBuzz for that single value.

Validation and errors

- If n is not of type number or Number.isInteger(n) is false then the function must throw a TypeError.
- If n is less than 0 the function must throw a RangeError.
- The functions should perform validation before producing results.

Exports and compatibility

- Export both functions as named exports from src/lib/main.js.
- Ensure the exported values are functions and documented in README examples.

Acceptance criteria

- Calling fizzBuzz with 15 returns an array of 15 strings whose last element is FizzBuzz.
- fizzBuzzSingle called with 3 returns the string Fizz.
- fizzBuzzSingle called with 5 returns the string Buzz.
- fizzBuzzSingle called with 15 returns the string FizzBuzz.
- fizzBuzzSingle called with 7 returns the string 7.
- fizzBuzz called with 0 returns an empty array.
- Both functions are exported as named exports from src/lib/main.js and are importable by tests.
- Unit tests covering the above cases exist in tests/unit and pass.
