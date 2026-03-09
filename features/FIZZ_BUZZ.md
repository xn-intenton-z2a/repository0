# FIZZ_BUZZ

## Summary

Add a concise, testable feature to implement the core FizzBuzz mission: export two named functions from src/lib/main.js — fizzBuzz and fizzBuzzSingle — with robust input validation, unit tests, and README usage examples. This feature ensures the library fulfills the mission by providing the required behaviour and edge-case handling, plus clear documentation and tests.

## Goals

- Provide fizzBuzz(n) that returns an array of strings from 1 to n following FizzBuzz rules.
- Provide fizzBuzzSingle(n) that returns the correct single FizzBuzz string for a positive integer n.
- Validate inputs: return [] for n = 0, throw RangeError for negative integers, throw TypeError for non-integers or non-number types.
- Export both functions as named exports from src/lib/main.js.
- Add comprehensive unit tests in tests/unit/ that cover normal cases, boundaries, and all edge cases.
- Update README with usage examples showing both functions.

## Rationale

The mission requires a minimal, fully tested FizzBuzz library. This feature groups all required deliverables (library implementation, exports, tests, and documentation) and makes the acceptance criteria explicit so CI and reviewers can validate the implementation.

## Implementation notes

- Modify or create src/lib/main.js to export named functions: fizzBuzz and fizzBuzzSingle.
- Behavior:
  - fizzBuzz(n):
    - If n is 0, return an empty array.
    - If n is negative, throw RangeError with a clear message.
    - If n is not an integer or not a number, throw TypeError.
    - For positive integer n, return an array of length n where each element is:
      - "FizzBuzz" when the index (1-based) is divisible by 3 and 5
      - "Fizz" when divisible by 3 only
      - "Buzz" when divisible by 5 only
      - The decimal string of the number otherwise
  - fizzBuzzSingle(n):
    - Same validation rules as above for a single integer input.
    - Return the single string following the above mapping.
- Tests:
  - Place unit tests in tests/unit/main.test.js (or update existing tests) and use exact equality assertions for returned arrays and strings.
  - Include tests for:
    - fizzBuzz(15) returns the standard 15-element array ending with FizzBuzz
    - fizzBuzzSingle(3) returns Fizz
    - fizzBuzzSingle(5) returns Buzz
    - fizzBuzzSingle(15) returns FizzBuzz
    - fizzBuzzSingle(7) returns 7
    - fizzBuzz(0) returns an empty array
    - Non-integer inputs (e.g., 3.5, "5", null) throw TypeError
    - Negative integers throw RangeError
- README:
  - Add short usage examples showing calling both functions and expected outputs; keep examples simple and copy/paste ready for users.

## Acceptance criteria

1. fizzBuzz(15) returns an array of length 15 with contents matching the canonical FizzBuzz sequence and the final element equal to FizzBuzz.
2. fizzBuzzSingle(3) returns Fizz.
3. fizzBuzzSingle(5) returns Buzz.
4. fizzBuzzSingle(15) returns FizzBuzz.
5. fizzBuzzSingle(7) returns 7.
6. fizzBuzz(0) returns an empty array.
7. Passing negative integers to either function throws RangeError.
8. Passing non-integer or non-number values to either function throws TypeError.
9. Both functions are exported as named exports from src/lib/main.js.
10. Unit tests covering the above criteria are present in tests/unit/ and pass under npm test.
11. README contains examples demonstrating both functions and a note about input validation.

## Files to change

- src/lib/main.js: implement and export functions named fizzBuzz and fizzBuzzSingle.
- tests/unit/main.test.js: add or update tests to cover acceptance criteria.
- README.md: add usage examples and input validation notes.

## Notes for reviewers

- Keep implementation minimal and focused; avoid adding unrelated utilities or dependencies.
- Use clear, descriptive error messages for thrown exceptions so tests can assert on error types only.
- Ensure examples in README are accurate and match test expectations.

