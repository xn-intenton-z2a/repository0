# FIZZBUZZ_CORE

# Overview

The canonical core feature for the repository: a minimal, dependency-free JavaScript library that exports authoritative FizzBuzz functions and a small set of additive helpers. This specification defines exact function signatures, centralised validation rules, helper behaviours, and concrete acceptance criteria so unit and behaviour tests can rely on deterministic outputs and error messages.

All runtime behaviour must be implemented in src/lib/main.js and exported as named ESM exports. Helpers must delegate to the canonical functions rather than reimplement logic.

# Public exports (src/lib/main.js)

- fizzBuzz(n)
  - Purpose: return an array of length n where element at index i-1 corresponds to integer i and values follow these exact rules in priority order:
    - if i % 15 === 0 -> 'FizzBuzz'
    - else if i % 3 === 0 -> 'Fizz'
    - else if i % 5 === 0 -> 'Buzz'
    - else -> the decimal string representation of i (no padding)
  - Parameter: n (number)
  - Validation (shared canonical checks):
    - if typeof n !== 'number' -> throw TypeError('n must be a number')
    - if !Number.isFinite(n) -> throw TypeError('n must be a finite number')
    - if !Number.isInteger(n) -> throw TypeError('n must be an integer')
    - if n < 0 -> throw RangeError('n must be >= 0')
    - Optional: implementations may define MAX_N and if present must throw RangeError('n must be <= ' + MAX_N) when exceeded
  - Behaviour:
    - n === 0 -> return [] (do not throw)
    - n >= 1 -> return an array of strings of length n with canonical values for 1..n

- fizzBuzzSingle(n)
  - Purpose: return the canonical string for a single integer n using the same replacement priority as fizzBuzz.
  - Validation: reuse canonical numeric checks but require n >= 1; if n < 1 -> throw RangeError('n must be >= 1').
  - Behaviour: return the canonical string for n.

# Additive helpers (must delegate to canonical exports)

Helpers must call fizzBuzz or fizzBuzzSingle for validation and base results; they must not reimplement core mapping logic.

- fizzBuzzFormatted(n, formatter)
  - Returns fizzBuzz(n).map((value, index) => formatter(value, index)).
  - Validation: canonical n checks; if typeof formatter !== 'function' -> throw TypeError('formatter must be a function').

- fizzBuzzSingleFormatted(n, formatter)
  - Returns formatter(fizzBuzzSingle(n), 0).
  - Validation: same as fizzBuzzFormatted.

- fizzBuzzStats(n)
  - Returns { fizz, buzz, fizzBuzz, numbers, total } where counts sum to total.
  - For n === 0 return zeros and total 0.
  - Implementation may scan fizzBuzz(n) or use arithmetic formulas but results must equal a scan of fizzBuzz(n).
  - Validation: canonical n checks.

- fizzBuzzGenerator(n)
  - Synchronous generator yielding canonical strings for 1..n.
  - Requirement: Array.from(fizzBuzzGenerator(n)) must equal fizzBuzz(n).
  - Validation: canonical n checks.

- fizzBuzzWithWords(n, words)
  - Display-oriented variant that substitutes display words while leaving canonical outputs unchanged.
  - words may be undefined or an object with optional fizz and buzz keys (strings). Missing keys fall back to canonical words.
  - Substitution rules:
    - canonical 'Fizz' -> words.fizz || 'Fizz'
    - canonical 'Buzz' -> words.buzz || 'Buzz'
    - canonical 'FizzBuzz' -> (words.fizz || 'Fizz') + (words.buzz || 'Buzz')
    - otherwise unchanged
  - Validation: if words is provided but not an object -> throw TypeError('words must be an object'); if words.fizz or words.buzz is present but not a string -> throw TypeError('words.fizz and words.buzz must be strings'). Reuse canonical n checks.

- fizzBuzzSingleWithWords(n, words)
  - Single-value variant applying the same substitution rules to fizzBuzzSingle(n).

# Validation and error semantics (centralised)

- All public exports must reuse the same validation helpers so error types and message substrings are stable and testable.
- Use TypeError for non-number types and for non-finite or non-integer numeric inputs; messages must include the words number, finite or integer as applicable.
- Use RangeError for numeric domain violations; messages must contain comparator text such as '>= 0' or '<= ' + MAX_N.

# Testing guidance (unit tests)

Unit tests must import named exports from src/lib/main.js and assert exact return values and precise error types/messages. Required unit assertions include:

- fizzBuzz(15) returns an array of length 15 with the last element exactly 'FizzBuzz'.
- fizzBuzzSingle(3) -> 'Fizz'; fizzBuzzSingle(5) -> 'Buzz'; fizzBuzzSingle(15) -> 'FizzBuzz'; fizzBuzzSingle(7) -> '7'.
- fizzBuzz(0) -> [] and fizzBuzzStats(0) -> { fizz:0, buzz:0, fizzBuzz:0, numbers:0, total:0 }.
- Invalid inputs: '10', NaN, Infinity, 1.5 throw TypeError; messages include the relevant substring ('number', 'finite', 'integer').
- Negative integers (e.g., -1) throw RangeError with message including '>= 0'.
- fizzBuzzFormatted and fizzBuzzSingleFormatted apply given formatter and throw TypeError('formatter must be a function') when invalid.
- fizzBuzzStats(15) equals { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }.
- Array.from(fizzBuzzGenerator(5)) equals fizzBuzz(5).
- fizzBuzzWithWords(15, { fizz: 'Foo', buzz: 'Bar' }) produces Foo, Bar and FooBar at the canonical positions and does not mutate the outputs of fizzBuzz or fizzBuzzSingle.

# Acceptance criteria

- Named ESM exports exist from src/lib/main.js for: fizzBuzz, fizzBuzzSingle, fizzBuzzFormatted, fizzBuzzSingleFormatted, fizzBuzzStats, fizzBuzzGenerator, fizzBuzzWithWords, fizzBuzzSingleWithWords.
- Core behaviour matches canonical mapping rules for all tested integers and edge cases.
- Validation semantics and error messages conform to the specified TypeError/RangeError rules and include required substrings for machine checks.
- Helpers are implemented by delegating to canonical functions and do not duplicate core logic.
- Unit tests covering all mandated assertions pass under the repository test scripts.

# Implementation notes

- Keep src/lib/main.js small and authoritative; prefer clarity and reuse over micro-optimisations.
- Do not introduce runtime dependencies; use only standard JS APIs (Number.isFinite, Number.isInteger).
- Avoid global state or mutation; functions must be pure and deterministic.
- Keep error messages short and machine-friendly so tests can assert substrings reliably.

# Backwards compatibility

- This feature is additive and must not change existing behaviour for consumers that import the library normally. Any CLI, HTTP or web demo features must import and reuse these exports rather than changing them.

