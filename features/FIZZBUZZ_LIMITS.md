# FIZZBUZZ_LIMITS

Summary

Introduce a canonical upper-bound constant MAX_N and require all public library exports to validate against it. This feature makes the library's scalability constraints explicit and provides a single source of truth for tests, examples and the README.

Specification

- Feature name: FIZZBUZZ_LIMITS

- Public export (src/lib/main.js): export const MAX_N = 10000000
  - The constant is a positive integer and represents the maximum permitted n for all public functions.
  - Implementations MAY choose a smaller value for performance in constrained environments but MUST default to 10000000 unless an explicit project-wide decision changes it.

- Validation rule (applies to all relevant public functions):
  - After existing type and finiteness checks, if n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)
  - The RangeError message must include the literal substring "<= " followed by the numeric MAX_N value so tests can assert on substrings.

- Functions affected (named exports in src/lib/main.js):
  - fizzBuzz(n): validate n <= MAX_N (n may be 0..MAX_N per existing rules).
  - fizzBuzzSingle(n): validate n <= MAX_N (n must still be >= 1 per canonical rules).
  - Additive helpers (fizzBuzzFormatted, fizzBuzzStats, fizzBuzzGenerator, fizzBuzzWithWords, etc.) must reuse the canonical validation and therefore inherit the MAX_N check; helpers should not reimplement their own independent upper-bound checks.

- Export visibility and usage
  - Export MAX_N as a named export so tests and examples can reference the authoritative limit.
  - README examples should reference MAX_N when discussing limits and performance considerations.

Testing guidance

- Unit tests (tests/unit/):
  - Import { MAX_N, fizzBuzz, fizzBuzzSingle } from src/lib/main.js.
  - Assert that calling fizzBuzz(MAX_N + 1) throws RangeError and that the thrown message contains the substring 'must be <=' and the numeric MAX_N value.
  - Assert that calling fizzBuzzSingle(MAX_N + 1) throws RangeError with the same substring constraints.
  - Assert that callers can still call fizzBuzz(0) and fizzBuzzSingle(1) successfully (do not require creating a huge array in tests).
  - Avoid tests that allocate arrays of size MAX_N; instead assert the validation behaviour for values just above MAX_N.

- Behaviour tests / examples:
  - README and examples/simple-run.js should document MAX_N and show usage for small sample n (eg. 15) while referencing the exported MAX_N constant when discussing upper bounds.

Acceptance criteria

- A named export MAX_N exists and equals 10000000 by default.
- Calling fizzBuzz with n > MAX_N throws RangeError with a message that contains '<=' and the MAX_N value.
- Calling fizzBuzzSingle with n > MAX_N throws RangeError with a message that contains '<=' and the MAX_N value.
- Additive helpers reuse canonical validation and therefore inherit the upper bound behaviour (no helper returns a different upper-bound error type or message).
- README mentions MAX_N and points consumers to the exported constant for programmatic discovery.

Implementation notes

- Implement MAX_N as a constant near the top of src/lib/main.js and export it as a named export; reuse it in the centralised validation helper so messages are stable and tests remain deterministic.
- Keep the validation order: finiteness/integer/lower-bound checks first (per canonical rules), then the upper bound check against MAX_N so error messages remain predictable for tests.
- Do not change canonical behaviours of fizzBuzz or fizzBuzzSingle other than adding the upper-bound check and the MAX_N export; tests for core functional behaviour should remain unchanged.

Rationale

Making the maximum allowed n explicit and exported reduces ambiguity across the codebase and tests; it also enables tests to verify upper-bound enforcement without attempting costly allocations or long-running operations.
