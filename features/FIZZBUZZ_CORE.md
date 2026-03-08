# FIZZBUZZ_CORE

# Summary

A precise, testable feature specification for the canonical FizzBuzz library API and a set of small, additive helpers. The feature defines named ESM exports, centralised validation semantics, and acceptance criteria used by unit and behaviour tests. Implementations must keep canonical functions minimal and provide helpers as thin wrappers that do not change canonical outputs.

# Specification

## Public named exports (src/lib/main.js)

- fizzBuzz(n)
  - Description: Return an array of length n for the sequence 1..n where:
    - If i % 15 === 0 -> "FizzBuzz"
    - Else if i % 3 === 0 -> "Fizz"
    - Else if i % 5 === 0 -> "Buzz"
    - Else -> decimal string of i (no leading zeros)
  - Parameter: n (number)
  - Validation and errors (apply in implementation):
    - If typeof n !== 'number' -> throw TypeError('n must be a number')
    - If !Number.isFinite(n) -> throw TypeError('n must be a finite number')
    - If !Number.isInteger(n) -> throw TypeError('n must be an integer')
    - If n < 0 -> throw RangeError('n must be >= 0')
    - Optional: if MAX_N is chosen and n > MAX_N -> throw RangeError('n must be <= ' + MAX_N)
  - Behaviour:
    - n === 0 -> return [] (no throw)
    - n >= 1 -> return array of strings where element index i-1 is the canonical string for integer i

- fizzBuzzSingle(n)
  - Description: Return the canonical string for a single positive integer n using the same replacement rules.
  - Validation and errors:
    - If typeof n !== 'number' -> throw TypeError('n must be a number')
    - If !Number.isFinite(n) -> throw TypeError('n must be a finite number')
    - If !Number.isInteger(n) -> throw TypeError('n must be an integer')
    - If n < 1 -> throw RangeError('n must be >= 1')
  - Behaviour: return one canonical string for n; callers should use fizzBuzz(0) for the empty sequence case.

## Additive helpers (must not alter canonical functions)

Implement as thin wrappers that call the canonical functions and transform or analyse the results.

- fizzBuzzFormatted(n, formatter)
  - Returns fizzBuzz(n).map((v,i) => formatter(v,i)).
  - Validation: n validated as above; if typeof formatter !== 'function' -> throw TypeError('formatter must be a function').

- fizzBuzzSingleFormatted(n, formatter)
  - Returns formatter(fizzBuzzSingle(n), 0) with the same validations as above.

- fizzBuzzStats(n)
  - Returns { fizz, buzz, fizzBuzz, numbers, total } where counts sum to total.
  - For n === 0 return zeros and total 0.
  - Validation: reuse canonical validation for n.

- fizzBuzzGenerator(n)
  - Synchronous generator yielding the canonical strings for 1..n in order.
  - Array.from(fizzBuzzGenerator(n)) must equal fizzBuzz(n).

- fizzBuzzWithWords(n, words)
  - words may be an object with optional keys fizz and buzz (strings). Missing keys fall back to canonical words.
  - If words is provided but not an object -> throw TypeError('words must be an object').
  - Validation: reuse canonical n validation.

- fizzBuzzSingleWithWords(n, words)
  - Single-value variant using words with the same fallback and validation semantics.

# Validation and error semantics

- Centralise validation so all public exports reuse identical checks and error message substrings; this keeps unit tests stable.
- Use TypeError for wrong types and for non-finite or non-integer numeric inputs (messages must contain the words number, finite or integer as indicated above).
- Use RangeError for domain violations (n < 0 or n > MAX_N). Messages should include ">=" or "<=" constraints to aid assertions.

# Testing guidance

- Unit tests must import named exports from src/lib/main.js and assert exact outputs and thrown error types/substrings.
- Mandatory unit tests to cover:
  - fizzBuzz(15) returns 15 items with final element "FizzBuzz".
  - fizzBuzzSingle(3) -> "Fizz", (5) -> "Buzz", (15) -> "FizzBuzz", (7) -> "7".
  - fizzBuzz(0) -> [] and fizzBuzzStats(0) -> all counts zero.
  - Passing invalid types or non-integers -> TypeError with indicative substring.
  - Passing negative integers -> RangeError with message containing '>= 0'.
  - fizzBuzzFormatted and fizzBuzzSingleFormatted behaviour and formatter validation.
  - fizzBuzzStats(15) equals { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }.
  - Array.from(fizzBuzzGenerator(5)) equals fizzBuzz(5).
  - Localisation helpers place alternate words at the same positions and do not alter canonical outputs.

# Acceptance criteria

- fizzBuzz(15) returns the correct 15-element array ending with "FizzBuzz".
- fizzBuzzSingle(3) == "Fizz", fizzBuzzSingle(5) == "Buzz", fizzBuzzSingle(15) == "FizzBuzz", fizzBuzzSingle(7) == "7".
- fizzBuzz(0) returns [] and does not throw.
- Non-integer or non-finite inputs throw TypeError; negative integers throw RangeError with messages containing expected substrings.
- fizzBuzzFormatted and fizzBuzzSingleFormatted delegate to canonical functions and validate formatter.
- fizzBuzzStats and fizzBuzzGenerator produce exact, testable outputs for sample inputs.

# Implementation notes

- Keep canonical exports minimal and authoritative; helpers call into them.
- Prefer simple, dependency-free implementations using Number.isInteger and Number.isFinite.
- Do not change existing public function names or their canonical behaviour; the feature is additive for helpers.

