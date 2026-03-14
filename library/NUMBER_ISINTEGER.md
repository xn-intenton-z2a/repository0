NUMBER_ISINTEGER

Table of contents
- Signature
- Behavior and semantics
- Edge cases
- Polyfill and compatibility notes
- Implementation-level details
- Usage examples (concise forms)
- Digest and attribution

Signature
- Number.isInteger(value) -> Boolean

Behavior and semantics
- Returns true if and only if typeof value is "number" and value is a finite integer (no fractional component).
- Returns false for NaN, Infinity, -Infinity, non-number types (including numeric strings), and numbers with fractional part.

Edge cases
- Number.isInteger(3) -> true
- Number.isInteger(3.0) -> true
- Number.isInteger(3.1) -> false
- Number.isInteger(NaN) -> false
- Number.isInteger(Infinity) -> false
- Number.isInteger('3') -> false (no coercion)

Polyfill and compatibility notes
- A safe polyfill: check typeof value === 'number' && isFinite(value) && Math.floor(value) === value
- Use the polyfill only when Number.isInteger is not present in the runtime

Implementation-level details
- Must not perform type coercion; behavior is intentionally strict about number type
- Uses IEEE-754 semantics for "number"; very large integers beyond safe integer range may still be considered integer by this predicate if they have no fractional part but be wary of precision limitations

Digest
- Source: MDN: Number.isInteger
- Retrieved: 2026-03-14

Attribution and data size
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- Crawl size: 158283 bytes
