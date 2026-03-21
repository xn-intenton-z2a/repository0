MDN_NUMBER_ISINTEGER

TABLE OF CONTENTS
- Normalised extract: behavior summary
- API signature and parameters
- Return values and semantics
- Edge cases and interoperability
- Implementation notes
- Detailed digest (retrieved content)
- Attribution and data size

NORMALISED EXTRACT: BEHAVIOR SUMMARY
- Number.isInteger(value) returns true only if value is a JavaScript Number value that is a finite integer (no fractional component).
- It does not coerce non-number types; e.g., Number.isInteger('3') -> false.
- For NaN and Infinity: returns false.

API SIGNATURE
- Number.isInteger(value): boolean
  - value: any
  - return: boolean — true if typeof value === 'number' and value is finite and has zero fractional part.

RETURN VALUES AND SEMANTICS
- True for values like 3, -0, 0, 3.0.
- False for 3.1, NaN, Infinity, and non-number types.
- Use as validation predicate before operations that require integer inputs.

EDGE CASES AND INTEROPERABILITY
- Object wrappers (new Number(3)) are objects; Number.isInteger(new Number(3)) -> false.
- For cross-environment portability, treat BigInt separately; Number.isInteger does not accept BigInt.

IMPLEMENTATION NOTES
- Equivalent implementation for validation purposes: typeof v === 'number' && isFinite(v) && Math.floor(v) === v
- Use this predicate to decide whether to throw TypeError for non-integers when API contract requires integers.

DETAILED DIGEST (crawled section)
- Essential details: exact semantics for integer detection, non-coercive behaviour, and examples demonstrating true/false returns.
- Retrieved: 2026-03-21
- Data size obtained: 154170 bytes

ATTRIBUTION
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- Bytes fetched: 154170
