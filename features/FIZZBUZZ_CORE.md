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

Important compatibility note

- The canonical exports fizzBuzz and fizzBuzzSingle must remain unchanged to satisfy the mission's acceptance criteria and existing dependent tests. Any extensions must be additional named exports and must not alter the behaviour or signature of the canonical functions.

Formatter extension (optional)

Summary

Provide a compatible, opt-in formatter extension that adds two additional named exports without changing the canonical API. These helpers let consumers transform the produced strings for display or localization while reusing the library's validation and core logic.

Specification

- Add two new named exports from src/lib/main.js: fizzBuzzFormatted and fizzBuzzSingleFormatted.
- fizzBuzzFormatted(n, formatter): returns the fizzBuzz array for 1..n where each resulting string is passed through formatter and the formatter's return value is used in the resulting array.
- fizzBuzzSingleFormatted(n, formatter): returns fizzBuzzSingle(n) passed through formatter and returns the formatter output.
- The formatter argument must be a function. If formatter is not a function, the library must throw a TypeError with a message containing the word "formatter".
- Both formatted helpers must reuse the same validation rules as the canonical functions for n (zero, negative, non-integer checks) and must throw the same error types and messages for invalid n.

Examples

- fizzBuzz(5) => ["1","2","Fizz","4","Buzz"]
- fizzBuzzFormatted(5, s => `[` + s + `]`) => ["[1]","[2]","[Fizz]","[4]","[Buzz]"]
- fizzBuzzSingle(3) => "Fizz"
- fizzBuzzSingleFormatted(3, s => s + "!") => "Fizz!"

Edge cases and errors

- If n is 0, fizzBuzzFormatted(0, fn) returns an empty array (after applying no formatter calls).
- If n is a negative integer, both formatted helpers must throw RangeError with the same descriptive message used by the canonical functions.
- If n is not an integer, both formatted helpers must throw TypeError with the same descriptive message used by the canonical functions.
- If formatter is missing or not a function, throw TypeError and do not call the formatter.

Testing guidance

- Unit tests should import the four named exports from src/lib/main.js and assert exact output for both canonical and formatted helpers.
- Tests for formatter helpers should include:
  - A basic formatter that wraps or appends to strings and asserts exact transformed output for fizzBuzzFormatted(5, formatter) and fizzBuzzSingleFormatted(3, formatter).
  - A test asserting that a non-function formatter (null, string, number) causes a TypeError containing the word "formatter".
  - Validation tests reusing the FIZZBUZZ_VALIDATION cases to ensure identical error types/messages for invalid n.

Acceptance criteria

- All original acceptance criteria for fizzBuzz and fizzBuzzSingle remain true:
  - fizzBuzz(15) returns a 15-element array ending with FizzBuzz
  - fizzBuzzSingle(3) returns Fizz
  - fizzBuzzSingle(5) returns Buzz
  - fizzBuzzSingle(15) returns FizzBuzz
  - fizzBuzzSingle(7) returns 7
  - fizzBuzz(0) returns an empty array
- Additional acceptance criteria for the formatter extension:
  - fizzBuzzFormatted(5, s => `[` + s + `]`) returns ["[1]","[2]","[Fizz]","[4]","[Buzz]"]
  - fizzBuzzSingleFormatted(3, s => s + "!") returns "Fizz!"
  - Passing a non-function formatter throws a TypeError whose message contains "formatter".
- Unit tests exist and pass for both canonical and formatted helpers.

Notes

- Keep the implementation minimal: implement formatted helpers as thin wrappers that call the canonical functions and then map the result through the formatter, or call formatter on the single result. Do not duplicate core fizz/fizzbuzz logic.
- This extension keeps the original API stable for downstream consumers and adds a small, testable convenience for presentation-level transformations.
- The new helpers should be demonstrated in README examples and in the web demo where appropriate, but core behaviour and tests remain authoritative.