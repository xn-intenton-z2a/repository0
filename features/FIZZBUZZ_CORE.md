# FIZZBUZZ_CORE

Purpose

Define the canonical FizzBuzz behaviour and the two public functions that implement it: fizzBuzz and fizzBuzzSingle. This feature is the core of the mission and must be precise so unit tests can assert deterministic results.

Behavior

- fizzBuzz(n): given a single numeric argument n, return an array of strings for the sequence 1..n where:
  - numbers divisible by 3 are replaced with the string Fizz
  - numbers divisible by 5 are replaced with the string Buzz
  - numbers divisible by both 3 and 5 are replaced with the string FizzBuzz
  - all other numbers appear as their decimal string representation (e.g. 7 -> "7").
- fizzBuzzSingle(n): given a single positive integer n, return the single string result for n using the same replacement rules described above.

API

- Both functions are exported as named ES module exports from src/lib/main.js.
- Both functions accept exactly one argument.

Input and error rules

- If the argument is not a number or is not an integer, the function throws a TypeError with the message: Argument must be an integer.
- If the argument is a number but less than 0, the function throws a RangeError with the message: Argument must be >= 0.
- Special handling:
  - fizzBuzz(0) returns an empty array.
  - fizzBuzzSingle(0) throws RangeError (0 is not a valid single positive integer input).

Acceptance criteria (testable)

- fizzBuzz(15) returns an array of length 15 whose elements (as strings where applicable) are:
  1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz
- fizzBuzzSingle(3) returns Fizz.
- fizzBuzzSingle(5) returns Buzz.
- fizzBuzzSingle(15) returns FizzBuzz.
- fizzBuzzSingle(7) returns 7.
- fizzBuzz(0) returns an empty array.
- Passing a non-integer such as 3.14 to either function throws TypeError with message Argument must be an integer.
- Passing a negative number such as -1 to either function throws RangeError with message Argument must be >= 0.
