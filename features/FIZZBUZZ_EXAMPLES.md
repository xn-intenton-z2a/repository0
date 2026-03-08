# VALIDATION_HELPERS

# Summary

Provide a single, well-specified validation surface for the canonical FizzBuzz library so all runtime modes (library, CLI, HTTP server, web demo, and tests) reuse identical numeric validation semantics and machine-friendly error messages. This feature centralises parsing and validation helpers as named ESM exports in src/lib/main.js and supplies clear acceptance criteria and test guidance.

# Specification

- Purpose: Expose small, pure validation functions that enforce the canonical numeric rules required by FIZZBUZZ_CORE and produce stable error types and message substrings so tests and endpoints can reliably assert validation failures.
- Constraints: Implementation must be dependency-free and added only as named exports from src/lib/main.js. It must not alter existing canonical fizzBuzz/fizzBuzzSingle behaviour.

# Public exports

Export the following named ESM functions from src/lib/main.js:

- validateCount(n)
  - Validates values intended for fizzBuzz (n >= 0 allowed).
  - On failure: throws TypeError or RangeError with messages that include the canonical substrings number, finite, integer, or ">= 0" as appropriate.
  - On success: returns the validated numeric value (the same numeric value passed through, not coerced from strings).

- validateSingle(n)
  - Validates values intended for fizzBuzzSingle (n >= 1 required).
  - On failure: throws TypeError or RangeError with messages that include canonical substrings number, finite, integer, or ">= 1".
  - On success: returns the validated numeric value.

- parseAndValidate(query, opts?)
  - Parses a query-like object (e.g., { n: '15' }) into a numeric value and applies validateCount or validateSingle depending on opts.mode which is 'count' by default or 'single'.
  - If query.n is missing or cannot be parsed as a finite integer string, throws TypeError with a message containing the substring number.
  - On success: returns the validated numeric value (number type).

# Error message semantics

- Use TypeError for type/coercion and finiteness/integer failures where appropriate. Messages must include the words number, finite or integer so tests can match substrings.
- Use RangeError for numeric domain violations. Messages must include comparator text such as ">= 0" or ">= 1" so tests can assert on substrings.
- Messages should be short and machine-friendly, for example: "n must be a number", "n must be finite", "n must be an integer", "n must be >= 0".

# Testing guidance

- Unit tests must import validateCount, validateSingle and parseAndValidate from src/lib/main.js and assert exact thrown error types and that messages contain required substrings for invalid inputs: string '10', NaN, Infinity, 1.5, -1, and missing n.
- Tests must assert that valid inputs return the numeric value for both direct numeric inputs and parseable string inputs via parseAndValidate (for example parseAndValidate({ n: '15' }, { mode: 'count' }) returns 15).
- Add small unit tests that pass pre-parsed query objects to any exported handler factories (HTTP/CLI demo helpers) to prove those handlers call the validation helpers rather than reimplementing checks.

# Acceptance criteria

- validateCount, validateSingle and parseAndValidate are exported as named ESM exports from src/lib/main.js.
- Validation functions throw TypeError or RangeError with messages containing canonical substrings as required by FIZZBUZZ_CORE: number, finite, integer, >= 0, >= 1.
- parseAndValidate accepts string inputs for n (typical of query string parsing), validates correctly, and returns a numeric value on success.
- Unit tests cover successful validation and all invalid categories and pass under the repository test scripts.
- CLI and HTTP handlers (existing feature specs) can import these helpers and the test suite will be able to assert that handlers map TypeError/RangeError to HTTP 400 with messages containing canonical substrings.

# Implementation notes

- Implement as small pure functions in src/lib/main.js so they are tree-shakeable and easy to unit-test.
- Use only standard Number APIs: typeof, Number.isFinite, Number.isInteger and minimal string-to-number parsing for parseAndValidate (e.g., parseInt with radix 10 followed by canonical checks).
- Keep messages short and exact to meet substring checks in tests.
- Do not change behaviour of fizzBuzz or fizzBuzzSingle; these helpers are additive and used by other runtime modes.

# Backwards compatibility

- Additive: adding these named exports must not change any behaviour of existing functions when imported normally.
- Existing code that does not import the new helpers remains unaffected.

# Notes

Centralising validation increases testability and ensures consistent error mapping across all runtime modes without duplicating logic. This feature is intentionally scoped to a single source file and unit-testable in isolation.
