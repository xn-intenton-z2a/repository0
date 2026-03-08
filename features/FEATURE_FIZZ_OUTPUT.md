# FEATURE_FIZZ_OUTPUT

Overview

Provide a precise, well-tested FizzBuzz API and documentation that fully implements the mission in MISSION.md. This feature specifies the exported library functions, validation rules, examples for README and the website, and the unit tests required to meet acceptance criteria.

Goals

- Deliver two named exports: fizzBuzz and fizzBuzzSingle from src/lib/main.js.
- Define validation behaviour for edge cases and error messages so tests are deterministic.
- Provide examples usable by README and the site at src/web/.
- Ensure complete unit test coverage for normal and edge cases.

Specification

API

- Exported functions (named exports): fizzBuzz(n) and fizzBuzzSingle(n).

Behavior

- fizzBuzz(n) returns an array of strings for integers from 1 to n (inclusive). Replacement rules:
  - Multiples of 3 => Fizz
  - Multiples of 5 => Buzz
  - Multiples of both 3 and 5 => FizzBuzz
  - Other numbers => decimal string of the number (e.g., 7 -> 7)
- fizzBuzzSingle(n) returns the single string result for the provided positive integer using the same rules above.

Validation and Errors

- If n is not of type number or not an integer, throw TypeError with message: n must be an integer
- If n is negative, throw RangeError with message: n must be a non-negative integer
- If n is 0, fizzBuzz(0) returns an empty array; fizzBuzzSingle(0) treats 0 as a non-negative integer and returns "FizzBuzz" (0 is divisible by 3 and 5)
- Inputs that are NaN, Infinity, or non-number types trigger TypeError

Examples (for README and site)

- fizzBuzz(5) -> [1, 2, Fizz, 4, Buzz]
- fizzBuzz(15) -> [..., FizzBuzz] with the last element FizzBuzz (15th)
- fizzBuzzSingle(3) -> Fizz
- fizzBuzzSingle(7) -> 7

Acceptance Criteria

- AC1: fizzBuzz(15) returns an array of 15 strings and the 15th element is FizzBuzz
- AC2: fizzBuzzSingle(3) returns Fizz
- AC3: fizzBuzzSingle(5) returns Buzz
- AC4: fizzBuzzSingle(15) returns FizzBuzz
- AC5: fizzBuzzSingle(7) returns 7
- AC6: fizzBuzz(0) returns an empty array
- AC7: fizzBuzz(-1) throws RangeError with message n must be a non-negative integer
- AC8: fizzBuzz(1.5) throws TypeError with message n must be an integer
- AC9: Both functions are exported as named exports from src/lib/main.js
- AC10: Unit tests in tests/unit/ cover all behaviours and edge cases above

Testing Notes

- Unit tests should assert both return values and exact thrown error types and messages.
- Keep tests focused on API contract; small integration tests may exercise the CLI wrapper but library functions are primary.
- Use deterministic inputs to avoid flakiness (no random values).

Compatibility and Constraints

- Implementation must live in src/lib/main.js and preserve the CLI behaviour specified in FEATURE_CLI if present.
- Do not change other files outside source, tests, README, package.json, or examples.

Implementation Tips

- Use simple loop or map over range 1..n to build output as strings.
- Validate inputs early and throw the specified errors to make tests precise.

Notes

- This file is intentionally explicit about error messages and export shapes so unit tests can assert exact strings and types.
