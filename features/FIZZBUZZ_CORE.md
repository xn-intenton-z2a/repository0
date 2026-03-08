# FIZZBUZZ_CORE

# Summary

Canonical FizzBuzz library specification and authoritative guide for small, additive helpers. This feature defines the required named ESM exports, centralised validation rules, and precise acceptance criteria used by unit and behaviour tests. Implementations must keep the canonical functions minimal and have all helper exports delegate to them.

# Public exports (file: src/lib/main.js)

- fizzBuzz(n)
  - Purpose: produce an array of length n where index i-1 represents integer i and values follow these exact rules:
    - i % 15 === 0 -> the string FizzBuzz
    - else i % 3 === 0 -> the string Fizz
    - else i % 5 === 0 -> the string Buzz
    - else -> the decimal string representation of i (no padding)
  - Parameter: n (number)
  - Validation (shared behaviour required across all exports):
    - if typeof n !== 'number' -> throw TypeError('n must be a number')
    - if !Number.isFinite(n) -> throw TypeError('n must be a finite number')
    - if !Number.isInteger(n) -> throw TypeError('n must be an integer')
    - if n < 0 -> throw RangeError('n must be >= 0')
    - Optional: if an implementation sets MAX_N and n > MAX_N -> throw RangeError('n must be <= ' + MAX_N)
  - Behaviour:
    - n === 0 -> return [] (do not throw)
    - n >= 1 -> return an array of strings of length n with canonical values for 1..n

- fizzBuzzSingle(n)
  - Purpose: return the canonical string for a single integer n using the same replacement priority as fizzBuzz.
  - Validation: reuse the same numeric checks as fizzBuzz, except the lower bound is n >= 1 (throw RangeError('n must be >= 1') for n < 1).
  - Behaviour: return the canonical string for n.

# Additive helpers (must delegate to canonical exports)

Helpers must not reimplement FizzBuzz logic or change the canonical outputs of fizzBuzz or fizzBuzzSingle. They must call the canonical functions for validation and sequence generation and then transform or analyse the results.

- fizzBuzzFormatted(n, formatter)
  - Returns: fizzBuzz(n).map((value, index) => formatter(value, index)).
  - Validation: apply canonical n checks; if typeof formatter !== 'function' -> throw TypeError('formatter must be a function').

- fizzBuzzSingleFormatted(n, formatter)
  - Returns: formatter(fizzBuzzSingle(n), 0).
  - Validation: same as fizzBuzzFormatted.

- fizzBuzzStats(n)
  - Returns an object: { fizz, buzz, fizzBuzz, numbers, total } where counts sum to total.
  - For n === 0 return counts of zero and total 0.
  - Implementation: compute counts by iterating the canonical sequence or by arithmetic formulas; results must match exact counts returned by scanning fizzBuzz(n).
  - Validation: reuse canonical n validation.

- fizzBuzzGenerator(n)
  - A synchronous generator that yields the canonical strings for 1..n in order.
  - Requirement: Array.from(fizzBuzzGenerator(n)) must equal fizzBuzz(n).
  - Validation: reuse canonical n validation.

- fizzBuzzWithWords(n, words)
  - Purpose: return a display-oriented array where the canonical words Fizz and Buzz are replaced by words.fizz and words.buzz strings for presentation only.
  - words may be undefined (use canonical words), or an object with optional keys fizz and buzz (strings). Missing keys fall back to canonical words.
  - Behaviour rules:
    - If a canonical value === 'Fizz' -> replace with words.fizz || 'Fizz'
    - If a canonical value === 'Buzz' -> replace with words.buzz || 'Buzz'
    - If a canonical value === 'FizzBuzz' -> replace with (words.fizz || 'Fizz') + (words.buzz || 'Buzz')
    - Otherwise leave the value unchanged
  - Validation: if words is provided but not an object (including null) -> throw TypeError('words must be an object'); if words.fizz or words.buzz is present but not a string -> throw TypeError('words.fizz and words.buzz must be strings'). Reuse canonical n validation.

- fizzBuzzSingleWithWords(n, words)
  - Single-value variant applying the same substitution rules to fizzBuzzSingle(n).

# Validation & error semantics (centralised)

- All public exports must reuse the same validation functions so unit tests can rely on consistent error types and message substrings.
- Use TypeError for type problems and for non-finite or non-integer numeric inputs; messages must include the words number, finite or integer as appropriate.
- Use RangeError for domain violations with messages containing comparator text, for example '>= 0' or '<= ' + MAX_N.

# Testing guidance (unit tests)

Write unit tests that import named exports from src/lib/main.js and assert exact values and error behaviour. Mandatory tests:
- fizzBuzz(15) returns an array of length 15 with the last element exactly 'FizzBuzz'.
- fizzBuzzSingle(3) -> 'Fizz', fizzBuzzSingle(5) -> 'Buzz', fizzBuzzSingle(15) -> 'FizzBuzz', fizzBuzzSingle(7) -> '7'.
- fizzBuzz(0) -> [] and fizzBuzzStats(0) -> { fizz:0, buzz:0, fizzBuzz:0, numbers:0, total:0 }.
- Invalid type or non-finite/non-integer inputs (e.g., '10', NaN, 1.5) throw TypeError and messages include 'number', 'finite' or 'integer' as appropriate.
- Negative integers (e.g., -1) throw RangeError and the message includes '>= 0'.
- fizzBuzzFormatted and fizzBuzzSingleFormatted apply the provided formatter and throw TypeError when formatter is not a function; formatted outputs must reflect exact mapping order.
- fizzBuzzStats(15) equals { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }.
- Array.from(fizzBuzzGenerator(5)) equals fizzBuzz(5).
- fizzBuzzWithWords(15, { fizz:'Foo', buzz:'Bar' }) produces Foo, Bar and FooBar at the canonical positions and does not mutate canonical fizzBuzz outputs when called.

# Acceptance criteria

- All named exports exist as named ESM exports from src/lib/main.js.
- fizzBuzz(15) returns the correct 15-element array ending with 'FizzBuzz'.
- fizzBuzzSingle(3) == 'Fizz', fizzBuzzSingle(5) == 'Buzz', fizzBuzzSingle(15) == 'FizzBuzz', fizzBuzzSingle(7) == '7'.
- fizzBuzz(0) returns [] without throwing.
- Validation: non-integer or non-finite inputs throw TypeError; negative values throw RangeError with message substrings as specified.
- Formatter helpers delegate to canonical functions and validate the formatter argument.
- fizzBuzzStats and fizzBuzzGenerator produce deterministic, testable outputs that match scans of the canonical sequence.
- Localisation helpers apply display-only word substitutions and do not change canonical outputs.

# Implementation notes

- Keep canonical functions compact and authoritative; all helpers must delegate to them for validation and sequence generation.
- Use only standard JS (Number.isInteger, Number.isFinite); avoid extra dependencies.
- Implementations must not introduce global state or mutate inputs.
- Keep error messages short and machine-friendly to make unit assertions stable.

