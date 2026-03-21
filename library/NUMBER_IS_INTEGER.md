NUMBER_IS_INTEGER

NORMALISED EXTRACT

Table of contents:
- Signature
- Semantics
- Edge cases
- Usage guidance

Signature:
- Number.isInteger(value): boolean

Semantics:
- Returns true if value is of type number, is finite, and the mathematical floor equals the value (i.e., value is an integer in IEEE-754 double form).
- Returns false for NaN, Infinity and non-number types, and for non-integer numeric values (e.g., 3.1).
- Does not coerce strings or other types: Number.isInteger('3') -> false.

Edge cases and related APIs:
- For safe integer checks (limits of integer precision) use Number.isSafeInteger.
- Number.isInteger does not check numeric safety (2^53 - 1); it simply verifies integerness of a Number value.

REFERENCE DETAILS
- API signature: Number.isInteger(value: any): boolean
- Implementation summary: equivalent to (typeof value === 'number') && isFinite(value) && Math.floor(value) === value
- Return type: boolean

DETAILED DIGEST (source content summary)
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger (retrieved 2026-03-21)
  - Primary points: Number.isInteger is the standard, non-coercing test for integerness in JS; returns false for NaN/Infinity and for non-numeric types.
  - Retrieval date: 2026-03-21
  - Bytes retrieved during crawl: 154170

ATTRIBUTION
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- Retrieved: 2026-03-21
- Bytes crawled: 154170
