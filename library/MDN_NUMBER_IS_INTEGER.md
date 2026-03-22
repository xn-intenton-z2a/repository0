MDN_NUMBER_IS_INTEGER

Table of contents:
- Signature
- Semantics and return conditions
- Edge cases
- Usage for input validation
- Detailed digest and retrieval info

NORMALISED EXTRACT
Signature
Number.isInteger(value) -> boolean

Semantics and return conditions
- Returns true only if the argument's type is Number and the value is an integer (no fractional component). Internally this equates to: typeof value === 'number' and isFinite(value) and Math.floor(value) === value (or equivalently value % 1 === 0).
- Does not perform type coercion: Number.isInteger('3') returns false.

Edge cases
- NaN -> false
- Infinity/-Infinity -> false
- Non-number types -> false
- Large integers within Number safe range are handled; outside safe integer range result may be misleading for very large values due to IEEE-754 limitations.

Usage for input validation
- Use Number.isInteger(n) to assert the integer-ness of n before proceeding; combine with a range check (e.g., n >= 0) to implement mission rules that require throwing RangeError for negative values and TypeError for non-integers.

DETAILED DIGEST
Extracted technical content retrieved: 2026-03-22
- MDN specifies that Number.isInteger is the recommended standard built-in to test integer-ness without coercion and documents behavior for NaN, Infinity and non-number inputs.

ATTRIBUTION AND CRAWL SIZE
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Retrieved: 2026-03-22
Bytes downloaded during crawl: 154170