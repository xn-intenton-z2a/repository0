# FIZZ_BUZZ

## Summary

Implement the core FizzBuzz library feature required by the mission: provide two named exports from src/lib/main.js — fizzBuzz and fizzBuzzSingle — with strict input validation, exhaustive unit tests, and clear README examples. Keep the implementation minimal, well-documented, and fully testable.

## Goals

- Export named functions fizzBuzz(n) and fizzBuzzSingle(n) from src/lib/main.js.
- Input validation rules:
  - If n is 0, fizzBuzz returns an empty array; fizzBuzzSingle(0) should throw RangeError because single calls expect positive integers.
  - Negative integers throw RangeError with a clear message.
  - Non-number types or non-integers throw TypeError.
- Behavior rules:
  - fizzBuzz(n) returns an array of length n where each 1-based index maps to:
    - "FizzBuzz" when divisible by 3 and 5
    - "Fizz" when divisible by 3 only
    - "Buzz" when divisible by 5 only
    - the decimal string of the number otherwise
  - fizzBuzzSingle(n) applies the same mapping for a single positive integer and returns the string.
- Provide unit tests covering canonical sequences, edge cases and all validation branches.
- Add README examples showing library usage and input validation notes.

## Acceptance criteria

1. fizzBuzz(15) returns the canonical 15-element FizzBuzz sequence ending with FizzBuzz.
2. fizzBuzzSingle(3) returns "Fizz".
3. fizzBuzzSingle(5) returns "Buzz".
4. fizzBuzzSingle(15) returns "FizzBuzz".
5. fizzBuzzSingle(7) returns "7".
6. fizzBuzz(0) returns [].
7. fizzBuzzSingle(0) throws RangeError.
8. Negative integers passed to either function throw RangeError.
9. Non-number or non-integer inputs throw TypeError.
10. Both functions are exported as named exports from src/lib/main.js.
11. Unit tests exist in tests/unit/ that assert exact outputs and error types.
12. README contains copy-paste usage examples matching test expectations.

## Implementation notes

- Keep implementation contained to src/lib/main.js; prefer clarity over terseness.
- Error messages should be descriptive but tests should assert on the thrown Error type, not on full message text.
- Unit tests should use exact equality assertions for arrays and strings and assert throws for TypeError and RangeError where appropriate.

## Files to change

- src/lib/main.js — implement and export fizzBuzz and fizzBuzzSingle.
- tests/unit/main.test.js — add or update tests to satisfy acceptance criteria.
- README.md — add usage examples and a short paragraph on input validation.

## Notes for reviewers

- Reviewers should verify only the required behaviour; avoid expanding scope (no extra utilities or dependencies).
- Ensure tests assert on types of exceptions and exact outputs for canonical inputs.
- Implementation must be minimal and easily readable.

