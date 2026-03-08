# FIZZBUZZ_CORE

Summary

Define and deliver the canonical FizzBuzz library API required by the mission. This feature specifies the library exports, functional behaviour, and observable outcomes so unit tests and examples can be written against a precise contract.

Specification

- Provide two named exports from src/lib/main.js: fizzBuzz and fizzBuzzSingle.
- fizzBuzz(n): return an array of strings representing values 1..n where:
  - multiples of 3 are replaced with the string Fizz
  - multiples of 5 are replaced with the string Buzz
  - multiples of both 3 and 5 are replaced with the string FizzBuzz
  - all other numbers are represented as their decimal string (no leading zeros)
- fizzBuzzSingle(n): return the single Fizz/Buzz/FizzBuzz/number string for the integer n.

Edge cases and errors

- If n is 0, fizzBuzz(0) returns an empty array.
- If n is a negative integer, functions must throw a RangeError with a descriptive message.
- If n is not an integer (including floats, NaN, non-number types), functions must throw a TypeError with a descriptive message.
- Both functions must accept only a single argument and ignore additional arguments.

Examples (plain text)

- fizzBuzzSingle(3) => Fizz
- fizzBuzzSingle(5) => Buzz
- fizzBuzzSingle(15) => FizzBuzz
- fizzBuzz(5) => ["1","2","Fizz","4","Buzz"]

Testing guidance

- Unit tests should import named exports from src/lib/main.js and assert exact string array contents and thrown error types/messages.
- Tests must cover positive normal cases, zero, negative, and non-integer inputs.

Acceptance criteria

- fizzBuzz(15) returns a 15-element array ending with FizzBuzz
- fizzBuzzSingle(3) returns Fizz
- fizzBuzzSingle(5) returns Buzz
- fizzBuzzSingle(15) returns FizzBuzz
- fizzBuzzSingle(7) returns 7
- fizzBuzz(0) returns an empty array
- All unit tests pass for the implemented behaviour

Notes

This feature is the primary deliverable of the mission and must be implemented in src/lib/main.js with tests under tests/unit/ matching the behaviour above.