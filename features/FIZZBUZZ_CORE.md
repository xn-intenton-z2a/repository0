# FIZZBUZZ_CORE

## Summary

Canonical, comprehensive specification for the FizzBuzz library export surface and behaviour. This feature defines the required named exports, strict validation semantics, and a set of optional, additive helpers (formatters, statistics, synchronous generator, and localisation) plus guidance for TypeScript declarations and tests.

## Specification

### Exports (named)

- fizzBuzz(n)
  - Description: Return an array of strings representing the sequence 1..n where multiples of 3 are replaced with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz". Non-replaced values are decimal strings (no leading zeros).
  - Parameters: n (number)
  - Validation and errors:
    - If !Number.isInteger(n) or Number.isNaN(n) or !Number.isFinite(n): throw new RangeError('n must be an integer')
    - If n < 1: throw new RangeError('n must be >= 1')
    - If a project-wide MAX_N is enforced, throw new RangeError('n must be <= ' + MAX_N)
  - Behaviour: Return an array of length n with deterministic ordering: index i-1 corresponds to integer i.

- fizzBuzzSingle(n)
  - Description: Return the single string result for integer n following the same replacement rules.
  - Same validation and error behaviour as fizzBuzz.

### Optional, additive helpers (must not change canonical functions)

- fizzBuzzFormatted(n, formatter)
  - Description: Returns fizzBuzz(n) where each string is transformed by formatter(value).
  - Validation: same checks for n; if formatter is not a function throw TypeError('formatter must be a function').

- fizzBuzzSingleFormatted(n, formatter)
  - Description: Return formatter(fizzBuzzSingle(n)). Same validation rules as above.

- fizzBuzzStats(n)
  - Description: Analyse fizzBuzz(n) and return an object { fizz, buzz, fizzBuzz, numbers, total } counting occurrences.
  - Validation: reuse canonical validation for n. For n = 0 return counts all zero and total 0.
  - Implementation note: compute counts by iterating fizzBuzz(n) results; do not reimplement the replacement rules separately.

- fizzBuzzGenerator(n)
  - Description: A synchronous generator function yielding the exact strings for 1..n in order.
  - Validation: perform validation synchronously on invocation; if invalid, throw the same RangeError messages.
  - Behaviour: For n = 0 the generator yields nothing; Array.from(fizzBuzzGenerator(n)) must equal fizzBuzz(n).

- fizzBuzzWithWords(n, words)
  - Description: Return fizzBuzz sequence using words.fizz and words.buzz as replacements instead of canonical "Fizz"/"Buzz". Both keys optional; absent keys fall back to canonical words.
  - Validation: reuse canonical validation for n. If words is provided but not an object, throw TypeError('words must be an object'). Empty strings are allowed and used as-is.

- fizzBuzzSingleWithWords(n, words)
  - Description: Single-value variant using provided words object with same fallback and validation.

### TypeScript declarations and JSDoc

- Provide a declaration file at src/lib/main.d.ts exporting the above named functions with proper types.
- Add JSDoc comments to each exported function in src/lib/main.js describing parameters, return types and thrown errors so editors surface accurate information even without .d.ts.

## Acceptance criteria

- fizzBuzz(15) returns an array of 15 strings where the 15th element is "FizzBuzz".
- fizzBuzzSingle(3) === "Fizz"; fizzBuzzSingle(5) === "Buzz"; fizzBuzzSingle(15) === "FizzBuzz"; fizzBuzzSingle(7) === "7".
- fizzBuzz(0) returns [] (if project opts to accept 0) or throwing behaviour is documented and tested consistently with validation rules above—tests must match implemented choice.
- Non-number, non-integer, NaN, Infinity inputs cause the declared RangeError with message containing the word "integer"; negative integers cause RangeError with message containing ">= 1" or similar documented text.
- The formatted helpers throw TypeError when formatter is missing or not a function and otherwise produce mapped outputs identical in shape to canonical results but transformed.
- fizzBuzzStats(15) returns { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }.
- Array.from(fizzBuzzGenerator(5)) equals fizzBuzz(5).
- Localisation helpers replace labels without changing counts or positions; fizzBuzzWithWords(15,{fizz:'Foo',buzz:'Bar'}) must place Foo/Bar/FooBar in the same positions as canonical Fizz/Buzz/FizzBuzz.
- A src/lib/main.d.ts file exists and matches runtime signatures; JSDoc present on runtime exports.

## Testing guidance

- Unit tests in tests/unit/ must import named exports directly from src/lib/main.js and assert exact array/string outputs and thrown errors for invalid inputs.
- Add tests for each optional helper: formatted helpers reject invalid formatter; stats return exact counts for a set of sample n (including 0 and 15); generator yields identical sequence; localisation helpers accept missing/partial words and reject non-object words.
- Keep tests deterministic and assert on substrings of error messages when appropriate to avoid brittleness.

## Implementation notes

- Keep canonical fizzBuzz and fizzBuzzSingle minimal and authoritative; implement helpers as thin wrappers that call the canonical functions and then map/analyse results.
- Perform validation centrally so helper functions reuse the same checks and error messages.
- Use Number.isInteger and Number.isFinite for validation; prefer RangeError for numeric violations per repository guidance.
- Avoid introducing external dependencies; helpers are small, synchronous utilities.
- Add JSDoc and a lightweight main.d.ts to improve DX; updating package.json types is optional but recommended.

## Backwards compatibility

- Do not change signatures or behaviour of fizzBuzz and fizzBuzzSingle as they are mission-critical; new functions are additive.

