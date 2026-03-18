MDN_NUMBER_ISINTEGER

Table of contents
- Purpose
- Syntax
- Behavior and return value
- Edge cases
- Implementation notes and usage patterns
- Examples (plain-text)
- Digest and retrieval metadata
- Attribution

Purpose
Number.isInteger tests whether a value is an integer of the JavaScript Number type (not BigInt or string). It is a precise guard for converting Number inputs where integer-valued numbers are required.

Syntax
- Number.isInteger(value) -> boolean
  - value: any JavaScript value
  - returns: true if value is of type 'number', is finite, and has no fractional component; otherwise false.

Behavior and return value
- Equivalent boolean condition: typeof value === 'number' && isFinite(value) && Math.trunc(value) === value
- Returns false for NaN, Infinity, and non-number types (including string '3').
- Accepts numeric values that are integer-valued even if represented with a decimal point (e.g., 3.0 is an integer).

Edge cases
- Number.isInteger(3) -> true
- Number.isInteger(3.0) -> true
- Number.isInteger(3.1) -> false
- Number.isInteger(NaN) -> false
- Number.isInteger(Infinity) -> false
- Number.isInteger('3') -> false

Implementation notes and usage patterns
- Use Number.isInteger to validate Number inputs before converting to BigInt or performing integer-only operations.
- To accept BigInt values as integers for Hamming distance, check typeof value === 'bigint' separately.
- For untrusted inputs: if typeof value === 'number' and Number.isInteger(value) is true, it is safe to use BigInt(value) to convert for big-bit operations; otherwise reject or throw TypeError/RangeError per API contract.

Digest and retrieval metadata
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- Retrieved: 2026-03-18T21:45:18.698Z
- Bytes downloaded during crawl: 154164 bytes

Attribution
Content distilled from MDN Web Docs (Number.isInteger) which documents the ECMAScript semantics for integer detection on Number values.
