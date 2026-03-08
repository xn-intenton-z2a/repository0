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

Statistics extension (optional)

Summary

Provide a small, opt-in statistics helper that counts how many Fizz, Buzz, FizzBuzz and plain number entries occur in the sequence 1..n. This is an additive convenience for consumers and tooling and must not change canonical outputs.

Specification

- Add one new named export from src/lib/main.js: fizzBuzzStats.
- fizzBuzzStats(n): return a plain object with the following integer properties:
  - fizz: count of entries that are "Fizz" (multiples of 3 but not 5)
  - buzz: count of entries that are "Buzz" (multiples of 5 but not 3)
  - fizzBuzz: count of entries that are "FizzBuzz" (multiples of both 3 and 5)
  - numbers: count of entries that are decimal numeric strings (not replaced)
  - total: n (the requested upper bound)
- The helper must reuse the library's validation logic for n: non-integer inputs cause TypeError, negative integers cause RangeError, and n=0 returns an object with all zero counts and total 0.
- Implement fizzBuzzStats as a thin analysis wrapper that calls fizzBuzz(n) and computes counts by iterating the resulting array. Do not reimplement Fizz/Buzz rules separately.

Examples

- fizzBuzzStats(15) => { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }
- fizzBuzzStats(0) => { fizz: 0, buzz: 0, fizzBuzz: 0, numbers: 0, total: 0 }

Testing guidance

- Unit tests should import fizzBuzz, fizzBuzzSingle, fizzBuzzFormatted, fizzBuzzSingleFormatted and fizzBuzzStats from src/lib/main.js and assert exact outputs for canonical, formatted and stats helpers.
- For fizzBuzzStats include tests that assert exact counts for known inputs such as:
  - fizzBuzzStats(15) returns an object exactly matching { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }
  - fizzBuzzStats(0) returns zeros with total 0
- Validation tests: ensure that invalid n values cause the same error types and messages as the canonical functions.
- Tests should verify that fizzBuzzStats is implemented by mapping fizzBuzz output (for example by spying or by asserting behaviour) rather than duplicating logic; however prefer black-box assertions on outputs and counts.

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
- Acceptance criteria for statistics helper:
  - fizzBuzzStats(15) returns { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }
  - fizzBuzzStats(0) returns counts all zero with total 0
  - Invalid n values throw the same error types and messages as the canonical functions.
- Unit tests exist and pass for canonical, formatted and statistics helpers.

Notes

- Keep the implementation minimal: implement formatted helpers and fizzBuzzStats as thin wrappers that call the canonical functions and then map or analyse the result; do not duplicate the core fizz/fizzbuzz logic.
- This extension keeps the original API stable for downstream consumers and adds small, testable conveniences for presentation-level transformations and basic analytics.
- Demonstrate the new stats helper in README examples and optionally in the web demo where appropriate; ensure the demo imports the helper from src/lib/main.js and displays the returned counts.
