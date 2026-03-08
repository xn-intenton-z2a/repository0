# VALIDATION_HELPERS

# Summary

Centralise and export strict, machine-friendly numeric validation helpers for the canonical FizzBuzz library so the library core, CLI, HTTP handlers and web demo reuse identical validation semantics and error messages. The feature packages small pure validation functions in the library entry (src/lib/main.js) and exposes them for unit tests and endpoint handler construction without changing existing canonical behaviour.

# Specification

- Purpose: Provide a single, well-tested validation surface that enforces the canonical numeric rules (type, finiteness, integerness, bounds), produces stable error types and message substrings, and can be imported by CLI, HTTP handlers and demos.

- Exports (named exports from src/lib/main.js):
  - validateCount(n)
    - Validates the parameter used for fizzBuzz (n >= 0 allowed).
    - On failure: throws TypeError or RangeError with messages containing the canonical substrings number, finite, integer, or >= 0 as appropriate.
  - validateSingle(n)
    - Validates the parameter used for fizzBuzzSingle (n >= 1 required).
    - On failure: throws TypeError or RangeError with messages containing the canonical substrings number, finite, integer, or >= 1 as appropriate.
  - parseAndValidate(query, opts?)
    - Helper that parses a query-like object (strings) into numeric n and applies either validateCount or validateSingle based on opts.mode ('count'|'single').
    - On parse errors (missing or non-numeric) throw TypeError with message including the substring number.
    - Returns the validated numeric value on success.

- Error message semantics (must be stable substrings):
  - Type errors must include the word number for type failures and finite or integer as appropriate (for example: "n must be a number", "n must be finite", "n must be an integer").
  - Range errors must include comparator text (">= 0" or ">= 1").
  - Tests will assert presence of the appropriate substring rather than full message equality.

# Testing guidance

- Unit tests must import validateCount, validateSingle and parseAndValidate from src/lib/main.js and assert exact thrown error types and that messages contain required substrings for a variety of invalid inputs: '10' (string), NaN, Infinity, 1.5, -1.
- Tests must also assert that validated numeric values are returned for valid inputs (for parseAndValidate when given query-like values such as { n: '15' }).
- Add a small set of unit tests that import the handler factory (if present) and pass pre-parsed query objects to ensure the handlers call the validation helpers rather than re-implementing checks.

# Acceptance criteria

- validateCount, validateSingle and parseAndValidate are exported as named ESM exports from src/lib/main.js.
- Validation functions throw TypeError or RangeError with messages containing canonical substrings required by FIZZBUZZ_CORE for the following categories: type (number), finiteness (finite), integer (integer), lower-bound (>= 0 or >= 1).
- Unit tests cover both successful validation and all invalid categories and pass under npm test.
- CLI, HTTP handlers and web demo (existing features) can import these helpers and no longer duplicate validation logic (tests will assert the handlers map TypeError/RangeError to 400 with messages that contain the canonical substrings).

# Implementation notes

- Implement as small pure functions in src/lib/main.js so they are tree-shakeable and easy to unit-test; keep messages short and machine-friendly.
- Do not change existing canonical fizzBuzz or fizzBuzzSingle behaviour; only add new named exports and refactor other runtime branches (CLI/server/demo) to import them where appropriate.
- Keep the validation logic dependency-free and using standard Number APIs: typeof, Number.isFinite, Number.isInteger.

# Backwards compatibility

- Additive: adding these named exports must not change any behaviour of existing functions when imported normally.
- Existing code that does not import the new helpers remains unaffected; refactors to use the helpers are optional but recommended for consistency.

# Notes

Centralising validation increases testability and ensures consistent HTTP and CLI error mappings without touching the canonical core algorithm. This feature can be implemented entirely within src/lib/main.js and validated with unit tests under tests/unit/.
