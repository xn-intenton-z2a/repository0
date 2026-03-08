# FEATURE_FIZZ_OUTPUT

Overview

Add a well-specified, thoroughly tested FizzBuzz output feature to the library API and examples. This feature documents the library behaviour, provides precise acceptance criteria, and clarifies edge-case handling so that tests and consumers align with the mission in MISSION.md.

Goals

- Ensure fizzBuzz and fizzBuzzSingle behaviour is explicit and testable.
- Provide examples suitable for README and the site in src/web/.
- Define exact error types and return shapes for edge cases.

Specification

- Exported functions: fizzBuzz(n) and fizzBuzzSingle(n) as named exports from src/lib/main.js.
- Behaviour: fizzBuzz(n) returns an array of strings representing numbers from 1 to n where:
  - Multiples of 3 are replaced with the string Fizz
  - Multiples of 5 are replaced with the string Buzz
  - Multiples of both 3 and 5 are replaced with the string FizzBuzz
  - Non-multiples are the decimal string of the number (e.g., 7 -> "7")
- Edge cases:
  - n = 0 returns an empty array
  - negative numbers throw a RangeError with message "n must be a non-negative integer"
  - non-integers throw a TypeError with message "n must be an integer"
  - fizzBuzzSingle follows the same validations for its single numeric argument and returns the single string for that number

Examples

- fizzBuzz(5) -> ["1","2","Fizz","4","Buzz"]
- fizzBuzzSingle(15) -> "FizzBuzz"

Acceptance criteria

- AC1: fizzBuzz(15) returns a 15-element array ending with "FizzBuzz"
- AC2: fizzBuzzSingle(3) returns "Fizz"
- AC3: fizzBuzzSingle(5) returns "Buzz"
- AC4: fizzBuzzSingle(15) returns "FizzBuzz"
- AC5: fizzBuzzSingle(7) returns "7"
- AC6: fizzBuzz(0) returns []
- AC7: fizzBuzz(-1) throws RangeError with the specified message
- AC8: fizzBuzz(1.5) throws TypeError with the specified message
- AC9: Both functions are exported as named exports from src/lib/main.js
- AC10: Unit tests cover all above behaviours and edge cases

Testing notes

- Add or update tests in tests/unit/ to assert exact return values and thrown error types/messages.
- Keep tests small and focused on the API contract.

Compatibility

This feature is intentionally minimal and self-contained so it can be implemented within src/lib/main.js, with corresponding unit tests and README examples.