RANGE_ERROR

Table of contents
1. Constructor and identity
2. When to throw RangeError (exact conditions)
3. Usage patterns and recommended messages
4. Detection, testing, and troubleshooting
5. Supplementary implementation details
6. Reference details (API signatures, parameter types, returns)
7. Digest and retrieval metadata
8. Attribution and data size

1. Constructor and identity
- RangeError(message?) -> constructs a RangeError instance derived from Error.
- Signature: new RangeError(message?: string) -> RangeError
- Properties on the returned object: name = 'RangeError'; message = provided string or empty string; stack = host-defined stack trace string (when available).
- instanceof checks: (value instanceof RangeError) must return true for RangeError instances; (value instanceof Error) must also return true.
- RangeError is the canonical error type to represent numeric range or value out-of-range violations as per ECMAScript semantics.

2. When to throw RangeError (exact conditions)
- Use RangeError for numeric parameter violations where the type is Number but the numeric value is outside the allowed domain (examples below are canonical patterns to implement exactly):
  - Input integer bounds: throw new RangeError('n must be an integer') when Number.isInteger(n) === false.
  - Lower bound violation: throw new RangeError('n must be >= 1') when n < 1.
  - Upper bound violation: throw new RangeError('n must be <= ' + MAX_N) when n > MAX_N.
  - Non-finite numeric values: throw new RangeError('n must be finite') when Number.isFinite(n) === false.
- Do NOT use RangeError for type mismatches that are not numeric (use TypeError for wrong types); prefer RangeError only when the numeric value is out of domain.

3. Usage patterns and recommended messages
- Message conventions:
  - Use short, machine-parseable messages starting with the parameter name, then the constraint: e.g., "n must be an integer", "offset must be >= 0", "limit must be <= 10000000".
  - Avoid verbose sentences; rely on the message to be precise for programmatic assertion and human readability.
- Throwing pattern (verbatim form to use): new RangeError(message) -> RangeError instance.
- Validation order recommendation for robust APIs:
  1) If typeof value !== 'number' -> throw TypeError('param must be a number')
  2) If Number.isInteger(value) === false -> throw new RangeError('param must be an integer')
  3) If !Number.isFinite(value) -> throw new RangeError('param must be finite')
  4) If value < MIN -> throw new RangeError('param must be >= ' + MIN)
  5) If value > MAX -> throw new RangeError('param must be <= ' + MAX)
- Prefer performing Number.isInteger checks before range comparisons to avoid implicit coercion issues.

4. Detection, testing, and troubleshooting
- Detection methods:
  - Use instanceof RangeError to identify RangeError objects.
  - Use error.name === 'RangeError' to match across realms when instanceof may fail.
  - Inspect error.message for programmatic matching of the exact constraint violated.
- Test patterns (plain descriptions, no code blocks):
  - Assert that the function throws a RangeError when passing a fractional number, NaN, Infinity, or an out-of-range integer.
  - Assert that the thrown error instanceof RangeError and that error.message equals the expected canonical message.
- Troubleshooting steps when RangeError arises unexpectedly:
  1) Verify the value type using typeof and Number.isFinite; confirm the input wasn't a string or BigInt.
  2) Check numeric conversion paths (parseInt/Number) for precision loss or inadvertent Infinity/NaN.
  3) Confirm bounds constants (MIN, MAX) and that comparisons use <= and >= correctly.
  4) When tests fail intermittently, inspect for floating point precision issues near boundary values (e.g., values close to Number.MAX_SAFE_INTEGER).

5. Supplementary implementation details
- Performance: Number.isInteger is a constant-time operation; prefer it over manual Math.floor comparisons for clarity and correctness.
- Stack traces: message and stack contents are host environment specific; do not rely on stack formatting in program logic.
- Interoperability: When throwing across workers or between frames, prefer checking error.name === 'RangeError' instead of instanceof.
- Internationalization: Keep canonical messages ASCII and machine-parseable; provide separate localized messages only for end-user surfaces.

6. Reference details (API signatures, parameter types, return types, examples)
- Constructor signature (ECMAScript): new RangeError([message]) where message is coerced to String when provided; returns a RangeError instance with .name === 'RangeError' and .message === string.
- Typical usage patterns exactly:
  - new RangeError('n must be an integer') -> RangeError
  - new RangeError('n must be >= 1') -> RangeError
  - new RangeError('n must be <= ' + MAX_N) -> RangeError
- Detection predicates:
  - value instanceof RangeError -> boolean
  - error.name === 'RangeError' -> boolean
- Throwing effects: throwing a RangeError exits the current execution until the exception is caught by nearest enclosing try/catch or the host process terminates the call stack.

7. Digest and retrieval metadata
- Source references used to construct this document: MDN RangeError page (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) and related JavaScript language references listed in SOURCES.md.
- Retrieval date: 2026-03-08T23:09:41.750Z

8. Attribution and data size
- Attribution: content collected and condensed from MDN Web Docs (RangeError) and repository SOURCES.md links: Wikipedia FizzBuzz, MDN JavaScript modules, MDN Number.isInteger, NPM fizzbuzz, Vitest guide.
- Data size obtained during crawling: 6 source URLs referenced in SOURCES.md; total retrieved content size not recorded in the crawl metadata.
