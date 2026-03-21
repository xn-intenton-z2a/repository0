# CORE_FUNCTIONS

Summary
Implement the library core: two named exports fizzBuzz and fizzBuzzSingle in src/lib/main.js using ESM.

Description
Provide deterministic, minimal implementations of the two core functions required by the mission. Both functions must validate inputs and behave exactly as follows:

Behavior
- fizzBuzzSingle(n): for integer n evaluate divisibility in the order: n % 15, n % 3, n % 5. Return the string FizzBuzz when divisible by 15, Fizz when divisible by 3, Buzz when divisible by 5, otherwise the decimal representation of n as a string.
- fizzBuzz(n): validate n using Number.isInteger. If n is not an integer throw a TypeError with message n must be an integer. If n < 0 throw a RangeError with message n must be >= 0. If n === 0 return an empty array without iterating. Otherwise return an array of length n where element i-1 equals fizzBuzzSingle(i).
- Exports: both functions must be exported as named exports from src/lib/main.js and be consumable in ESM contexts (package.json already sets type: module).

Acceptance criteria
- [ ] fizzBuzz(15) returns a 15-element array ending with FizzBuzz
- [ ] fizzBuzzSingle(3) returns Fizz
- [ ] fizzBuzzSingle(5) returns Buzz
- [ ] fizzBuzzSingle(15) returns FizzBuzz
- [ ] fizzBuzzSingle(7) returns 7
- [ ] Both functions are available as named exports from src/lib/main.js

Notes
- Use Number.isInteger for integer checks and strict equality when comparing modulo results to zero.
- Keep time complexity O(n) and space O(n) for fizzBuzz.
- Use clear, exact error messages to make tests deterministic.
