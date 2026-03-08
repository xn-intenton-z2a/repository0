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

Streaming extension (optional)

Summary

Provide a synchronous generator-based API to produce the FizzBuzz sequence on demand. This is intended for memory-efficient consumption of large ranges and for streaming-style processing in consumers. The extension must be an additive, opt-in export and must reuse the canonical validation behaviour.

Specification

- Add one new named export from src/lib/main.js: fizzBuzzGenerator.
- fizzBuzzGenerator(n): a synchronous generator function that yields the Fizz/Buzz/FizzBuzz/number strings for 1..n in order, one value per yield.
- The generator must perform the same validation as the canonical functions:
  - If n is not a number or not an integer, throw TypeError with a message containing the word "integer" or "number".
  - If n is a negative integer, throw RangeError with a message containing the word "non-negative" or "positive".
  - If n is 0, the generator yields nothing (i.e., completes immediately).
- The generator must not reimplement the core fizz/buzz logic in a different way; it should reuse the same internal helpers used by fizzBuzz/fizzBuzzSingle where feasible.
- Consumers should be able to use Array.from(fizzBuzzGenerator(n)) or for..of to obtain the full sequence; the array produced must exactly match fizzBuzz(n).

Examples

- Array.from(fizzBuzzGenerator(5)) => ["1", "2", "Fizz", "4", "Buzz"]
- for (const item of fizzBuzzGenerator(3)) { /* item yields "1", "2", "Fizz" */ }

Edge cases and errors

- Creating the generator with invalid input should throw immediately and not return a generator object in a broken state. Validation should run synchronously so callers receive TypeError/RangeError on invocation.
- If n is 0, the generator produces no yields and completes normally.

Testing guidance

- Unit tests should import fizzBuzz, fizzBuzzSingle, fizzBuzzFormatted, fizzBuzzSingleFormatted, fizzBuzzStats and fizzBuzzGenerator from src/lib/main.js and assert exact outputs for canonical, formatted, statistics and streaming helpers.
- For fizzBuzzGenerator include tests that:
  - assert Array.from(fizzBuzzGenerator(15)) equals fizzBuzz(15)
  - assert iterating the generator with for..of yields the same sequence as the array result
  - assert that calling fizzBuzzGenerator with invalid inputs throws the same error types and message substrings as the canonical functions
  - assert that fizzBuzzGenerator(0) yields no values (Array.from returns [])
- Prefer black-box assertions comparing outputs rather than inspecting internal implementation details.

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
- Acceptance criteria for streaming extension:
  - Array.from(fizzBuzzGenerator(15)) returns the same 15-element array as fizzBuzz(15)
  - fizzBuzzGenerator(0) yields no values (Array.from returns [])
  - Calling fizzBuzzGenerator with invalid inputs throws the same TypeError/RangeError as the canonical functions and does so synchronously on invocation
- Unit tests exist and pass for canonical, formatted, statistics and streaming helpers.

Notes

- Keep the implementation minimal: implement formatted helpers, fizzBuzzStats and fizzBuzzGenerator as thin wrappers that call or reuse the canonical functions and then map or analyse the result; do not duplicate the core fizz/fizzbuzz logic in divergent ways.
- The streaming generator is synchronous and intended for memory-efficient consumption; do not introduce async behaviour unless separately specified.
- Demonstrate the new streaming helper in README examples and optionally in the web demo where appropriate; ensure the demo imports the helper from src/lib/main.js and uses Array.from or for..of to display results.
