# FIZZBUZZ_CORE

Summary
Implement the core FizzBuzz library exports: fizzBuzz(n) and fizzBuzzSingle(n) in src/lib/main.js. They must follow the mission's contract precisely, be array- and string-returning respectively, and perform strict input validation.

Motivation
This feature delivers the primary library functionality required by the mission and is the foundation for tests, docs, and demos.

Specification
- Exports
  - Export two named functions from src/lib/main.js: fizzBuzz and fizzBuzzSingle.

- Behaviour: fizzBuzzSingle(n)
  - Accepts a single numeric argument n.
  - If n is not a number or not an integer, throw a TypeError.
  - If n is negative, throw a RangeError.
  - Returns the string representation of the standard FizzBuzz mapping for that integer: "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, otherwise the decimal representation of the number.

- Behaviour: fizzBuzz(n)
  - Accepts a single numeric argument n.
  - If n is not a number or not an integer, throw a TypeError.
  - If n is negative, throw a RangeError.
  - If n === 0, return an empty array.
  - For positive integer n, return an array of length n where element i (1-based) is the fizzBuzzSingle(i) result.

Implementation notes
- Use Number.isInteger to check for integer inputs.
- Do not alter other repository files beyond those listed in this feature's acceptance criteria.

Acceptance criteria
- fizzBuzz(15) returns an array of 15 strings whose 15th element is "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns an empty array.
- Passing a negative integer to either function throws RangeError.
- Passing a non-integer to either function throws TypeError.
