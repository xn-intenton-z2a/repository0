# FIZZBUZZ_TESTS

Summary

Describe the unit test coverage required to verify correctness and edge-case behaviour for the core FizzBuzz functions.

Scope

- Unit tests must exercise fizzBuzz and fizzBuzzSingle across normal and edge-case inputs.
- Tests should be located under tests/unit and follow existing repository test conventions.

Required test cases

- Normal values
  - fizzBuzz(1) returns ["1"].
  - fizzBuzz(3) returns ["1","2","Fizz"].
  - fizzBuzz(5) returns ["1","2","Fizz","4","Buzz"].
  - fizzBuzz(15) returns expected 15-element array with FizzBuzz at position 15.
  - fizzBuzzSingle for 3, 5, 15, and a prime like 7.

- Edge cases
  - fizzBuzz(0) returns an empty array.
  - fizzBuzz and fizzBuzzSingle with negative numbers throw RangeError.
  - fizzBuzz and fizzBuzzSingle with non-integer input (e.g., 3.5 or string) throw TypeError.

- Behavioural tests
  - Confirm that function exports exist and are functions.
  - Confirm pure function behaviour by calling fizzBuzz multiple times with same input and asserting same result.

Acceptance criteria

- All listed test cases are implemented under tests/unit and pass when running npm test.
- Tests assert exact string values and thrown error types and messages for invalid inputs.