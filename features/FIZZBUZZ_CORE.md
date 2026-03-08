# FIZZBUZZ_CORE

## Summary

Canonical, comprehensive specification for the FizzBuzz library export surface and behaviour. This feature defines the required named exports, strict validation semantics, and a set of optional, additive helpers (formatters, statistics, synchronous generator, and localisation). Validation rules align with the mission: fizzBuzz accepts n = 0 and returns an empty array; invalid types and non-integers throw TypeError; out-of-range numeric values throw RangeError where appropriate.

## Specification

# Exports (named)

- fizzBuzz(n)
  - Description: Return an array representing the sequence 1..n where multiples of 3 are replaced with "Fizz", multiples of 5 are replaced with "Buzz", and multiples of both are replaced with "FizzBuzz". Non-replaced values are decimal strings (no leading zeros).
  - Parameters: n (number)
  - Validation and errors:
    - If typeof n !== 'number' -> throw TypeError('n must be a number')
    - If !Number.isFinite(n) or Number.isNaN(n) -> throw TypeError('n must be a finite number')
    - If !Number.isInteger(n) -> throw TypeError('n must be an integer')
    - If n < 0 -> throw RangeError('n must be >= 0')
    - If a project-wide MAX_N is enforced and n > MAX_N -> throw RangeError('n must be <= ' + MAX_N)
  - Behaviour:
    - If n === 0: return [] (an empty array) without throwing.
    - For n >= 1: return an array of length n with deterministic ordering: element at index i-1 corresponds to integer i and is exactly one of the strings "Fizz", "Buzz", "FizzBuzz" or the decimal string of i.

- fizzBuzzSingle(n)
  - Description: Return the single string result for integer n following the same replacement rules.
  - Validation and error behaviour:
    - If typeof n !== 'number' -> throw TypeError('n must be a number')
    - If !Number.isFinite(n) or Number.isNaN(n) -> throw TypeError('n must be a finite number')
    - If !Number.isInteger(n) -> throw TypeError('n must be an integer')
    - If n < 1 -> throw RangeError('n must be >= 1')
  - Behaviour: Returns the canonical string for the given positive integer n (no special-case for n === 0; callers should use fizzBuzz(0) for the empty sequence).

## Optional, additive helpers (must not change canonical functions)

- fizzBuzzFormatted(n, formatter)
  - Returns fizzBuzz(n) with each entry transformed by formatter(value, index) before being returned.
  - Validate n as above; if formatter is not a function throw TypeError('formatter must be a function').

- fizzBuzzSingleFormatted(n, formatter)
  - Returns formatter(fizzBuzzSingle(n), 0) with same validations.

- fizzBuzzStats(n)
  - Returns an object { fizz, buzz, fizzBuzz, numbers, total } counting occurrences. For n === 0 return zeroed counts and total 0.

- fizzBuzzGenerator(n)
  - A synchronous generator yielding the exact strings for 1..n in order. Array.from(fizzBuzzGenerator(n)) must equal fizzBuzz(n).

- fizzBuzzWithWords(n, words)
  - Use words.fizz and words.buzz as replacements instead of canonical strings. Missing keys fall back to canonical words. If words is provided but not an object, throw TypeError('words must be an object').

- fizzBuzzSingleWithWords(n, words)
  - Single-value variant using provided words object with the same fallback and validation rules.

## Validation and Error Semantics

- Centralised validation ensures all helpers reuse the same checks and error messages.
- Use TypeError for wrong types and non-integer or non-finite numeric inputs (messages include the term 'number', 'finite' or 'integer' to aid tests).
- Use RangeError for numeric domain violations (for example n < 0 or n > MAX_N), with messages containing ">=" or "<=" constraints to aid assertions.
- Tests should assert error type and an indicative substring of the message (for example "integer", "number", ">= 0").

## Testing guidance

- Unit tests in tests/unit/ must import named exports directly from src/lib/main.js and assert exact array/string outputs and thrown errors for invalid inputs.
- Add unit tests for each helper: formatted helpers reject invalid formatter; stats return exact counts for sample n (including 15); generator yields identical sequence; localisation helpers accept missing/partial words and reject non-object words.
- Include unit tests asserting fizzBuzz(0) returns [] and fizzBuzzStats(0) returns zeroed counts.
- Keep tests deterministic and assert on substrings of error messages when appropriate to avoid brittleness.

## Acceptance criteria

- fizzBuzz(15) returns an array of 15 strings where the 15th element is "FizzBuzz".
- fizzBuzz(0) returns [] and does not throw.
- fizzBuzzSingle(3) === "Fizz"; fizzBuzzSingle(5) === "Buzz"; fizzBuzzSingle(15) === "FizzBuzz"; fizzBuzzSingle(7) === "7".
- Passing a negative integer to fizzBuzz (e.g., -1) throws RangeError and the message contains '>= 0'.
- Passing a non-integer number (e.g., 3.5) or NaN or Infinity throws TypeError and message contains 'integer' or 'finite' as appropriate.
- Passing a non-number type (e.g., '5', null) throws TypeError and message contains 'number'.
- fizzBuzzFormatted delegates to fizzBuzz and returns a mapped array of the same length and ordering; passing a non-function formatter throws TypeError containing the word 'formatter'.
- fizzBuzzStats(15) returns { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }.
- Array.from(fizzBuzzGenerator(5)) equals fizzBuzz(5).
- Localisation helpers place alternate words in the same positions as canonical replacements and do not change canonical outputs.

## Implementation notes

- Keep canonical fizzBuzz and fizzBuzzSingle minimal and authoritative; implement helpers as thin wrappers calling the canonical functions and mapping/analysing results.
- Perform validation centrally so helper functions reuse the same checks and error messages.
- Use Number.isInteger and Number.isFinite for validation; use TypeError for type/non-integer issues and RangeError for domain violations.
- Avoid introducing external dependencies; helpers are small synchronous utilities.

