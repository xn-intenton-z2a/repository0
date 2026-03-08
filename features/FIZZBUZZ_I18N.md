# FIZZBUZZ_I18N

Summary

Add small, additive internationalisation/localisation helpers that let callers display alternate words for Fizz and Buzz without changing the canonical library behaviour. The feature provides two thin wrapper exports: fizzBuzzWithWords and fizzBuzzSingleWithWords. These helpers are intended for CLI and web demo label overrides and must delegate to the canonical functions for validation and sequence generation.

Specification

Public named exports (src/lib/main.js)

- fizzBuzzWithWords(n, words)
  - Description: Return an array like fizzBuzz(n) but with the canonical words "Fizz" and "Buzz" replaced by the strings provided in words for display only.
  - Parameters:
    - n: number (validated using canonical validation rules from FIZZBUZZ_CORE)
    - words: object (optional) with optional keys fizz and buzz, each a string. Missing keys fall back to canonical values.
  - Behaviour:
    - Internally call fizzBuzz(n) to obtain the canonical sequence.
    - For each entry:
      - If the canonical value is exactly "Fizz" replace it with words.fizz or "Fizz".
      - If the canonical value is exactly "Buzz" replace it with words.buzz or "Buzz".
      - If the canonical value is exactly "FizzBuzz" replace it with the concatenation of (words.fizz||"Fizz") + (words.buzz||"Buzz").
      - Otherwise leave the value unchanged.
    - Always return an array of strings with the same length and ordering as fizzBuzz(n).
    - Must not mutate or depend on global state; must not change the output of fizzBuzz or fizzBuzzSingle.

- fizzBuzzSingleWithWords(n, words)
  - Description: Single-value variant that returns a single display string for integer n with the same replacement rules and fallback semantics.
  - Behaviour: call fizzBuzzSingle(n) and apply the same per-value substitution rules as above, returning the resulting string.

Validation and error semantics

- Reuse the canonical validation for n from FIZZBUZZ_CORE so error types and message substrings remain stable for tests.
- If words is provided but not an object (including null) throw TypeError('words must be an object').
- If words.fizz or words.buzz is provided and is not a string throw TypeError('words.fizz and words.buzz must be strings').

Testing guidance

- Unit tests (tests/unit/) should import fizzBuzzWithWords and fizzBuzzSingleWithWords from src/lib/main.js and assert exact outputs and validation behaviour:
  - fizzBuzzWithWords(15, { fizz: 'Foo', buzz: 'Bar' }) should return an array whose positions for multiples of 3 contain "Foo", multiples of 5 contain "Bar", and multiples of 15 contain "FooBar"; the final entry for 15 must be "FooBar".
  - fizzBuzzSingleWithWords(3, { fizz: 'Foo' }) returns "Foo" and fizzBuzzSingle(3) remains "Fizz".
  - Passing words as null, a number, or an array should throw TypeError('words must be an object').
  - Passing non-string fizz/buzz values should throw TypeError with message mentioning words.fizz or words.buzz.
  - Ensure fizzBuzz(15) and fizzBuzzSingle(3) unchanged by these helpers (call canonical functions directly in tests and assert equality to known values).

Acceptance criteria

- fizzBuzzWithWords and fizzBuzzSingleWithWords are exported from src/lib/main.js and behave as thin, deterministic wrappers over canonical functions.
- Label overrides are applied only for display and do not alter canonical outputs from fizzBuzz or fizzBuzzSingle.
- Validation of n is identical to canonical functions; invalid words arguments produce TypeError with informative messages.
- Unit tests verify substitution positions, fallback behaviour and that canonical functions remain unchanged.

Notes

- This feature is additive and small; it should be implemented by delegating to existing canonical functions to preserve validation and behaviour consistency.
- The CLI and web demo features may call these helpers when a --labels or label fields are provided; tests for those features should assert that the canonical library outputs are still unchanged.
