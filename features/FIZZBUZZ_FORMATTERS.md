# FIZZBUZZ_FORMATTERS

Summary

Add small, additive formatter helpers that let callers transform canonical fizzBuzz outputs without changing the core behaviour. The feature provides two thin, synchronous wrapper exports: fizzBuzzFormatted and fizzBuzzSingleFormatted. These helpers make it easier to present FizzBuzz results in custom ways for demos, examples and downstream consumers while keeping canonical outputs unchanged.

Specification

- Named exports (src/lib/main.js)
  - fizzBuzzFormatted(n, formatter)
    - Description: Return an array like fizzBuzz(n) but with each entry mapped through formatter(value, index) before being returned.
    - Parameters:
      - n: number (integer > 0 as per canonical validation)
      - formatter: function (value: string, index: number) -> any
    - Validation:
      - Reuse the canonical validation for n (same error types and message substrings).
      - If formatter is not a function throw TypeError('formatter must be a function').
    - Behaviour:
      - Internally call fizzBuzz(n) to obtain the canonical sequence and return sequence.map((v,i) => formatter(v, i)).
      - Maintain length and ordering identical to fizzBuzz(n).

  - fizzBuzzSingleFormatted(n, formatter)
    - Description: Return formatter(fizzBuzzSingle(n), 0) — a single transformed value for n.
    - Parameters and validation: same validation for n; same TypeError for invalid formatter.
    - Behaviour: call fizzBuzzSingle(n) then return formatter(result, 0).

- Implementation notes
  - Both helpers must be thin wrappers that call the canonical functions (fizzBuzz / fizzBuzzSingle) rather than reimplementing the replacement rules.
  - Error messages and thrown error types for n must match the canonical validation so tests can assert on substrings (for example integer, >= 1).
  - The formatter function receives the original canonical string and the zero-based index and may return any JavaScript value; the formatted helpers do not coerce formatter return values.
  - Keep implementations synchronous and dependency-free.

Testing guidance

- Unit tests (tests/unit/):
  - Import fizzBuzzFormatted and fizzBuzzSingleFormatted from src/lib/main.js and verify behaviour using simple formatters.
  - Examples:
    - fizzBuzzFormatted(5, v => v.toUpperCase()) => ["1","2","FIZZ","4","BUZZ"].map toUpperCase results.
    - fizzBuzzFormatted(3, (v,i) => i+"-"+v) => ["0-1","1-2","2-Fizz"]
    - fizzBuzzSingleFormatted(3, v => `->${v}<-`) => "->Fizz<-".
  - Validation tests:
    - Passing a non-function formatter (string, null, {}) should throw TypeError and message must contain formatter.
    - Passing invalid n must throw the same error type and substrings as canonical functions.

Acceptance criteria

- fizzBuzzFormatted delegates to fizzBuzz and returns a mapped array of the same length and ordering.
- fizzBuzzSingleFormatted delegates to fizzBuzzSingle and returns formatter output for the single value.
- Both helpers throw TypeError when formatter is not a function; the message contains the word formatter.
- Validation of n matches canonical behaviour (same error types and message substrings).
- Tests cover normal mapping, formatter validation and n validation and pass.

Notes

- This feature is strictly additive and must not alter existing exports or canonical behaviour of fizzBuzz and fizzBuzzSingle.
- The feature can be fully realised in src/lib/main.js with accompanying unit tests and README examples; the web demo may optionally use these helpers to render styled outputs but must not rely on them for correctness tests of canonical behaviour.