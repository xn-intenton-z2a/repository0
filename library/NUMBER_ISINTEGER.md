NORMALISED EXTRACT
Definition
Number.isInteger(value) returns true if value is of type Number and is a mathematical integer (no fractional component) and is finite.

Table of contents
1. Signature and return semantics
2. Comparison to global isFinite/typeof checks
3. Implementation and polyfill details
4. Examples and pitfalls

Detailed information
1. Signature
- Number.isInteger(value) -> boolean
- Returns true iff typeof value === 'number' and isFinite(value) and Math.floor(value) === value (equivalently value % 1 === 0 for finite non-NaN values).

2. Comparison
- Unlike global isFinite, Number.isInteger does not coerce non-number types; Number.isInteger('2') === false while Number.isFinite('2') === false (global isFinite coerces strings and may return true).
- NaN and Infinity return false.

3. Implementation/polyfill
- Polyfill:
  function isInteger(value) { return typeof value === 'number' && isFinite(value) && Math.floor(value) === value; }
- Alternatively use value === Math.trunc(value) for environments with Math.trunc.

4. Pitfalls
- Large integers beyond Number.MAX_SAFE_INTEGER may be integers numerically but cannot be represented exactly; Number.isInteger treats them as integers if they have no fractional part in IEEE-754 representation, but equality semantics may be surprising.

SUPPLEMENTARY DETAILS
- For exact-integer semantics beyond 2^53-1, prefer BigInt types and BigInt detection; Number.isInteger specifically targets IEEE-754 Number values.

REFERENCE DETAILS
- Exact function: Number.isInteger(value) returns boolean as specified above.

DETAILED DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Retrieved: 2026-03-14
Extracted content: signature, coercion-free semantics, polyfill, and relation to safe integer range. Data size retrieved: ~154.6 KB.

ATTRIBUTION
Content derived from MDN Web Docs (Mozilla); crawl size ~154.6 KB.