NORMALISED EXTRACT
- Signature: Number.isInteger(value) -> boolean
- Purpose: Returns true if the argument is of the Number type and is an integer (no fractional component), false otherwise.
- Behavior specifics: returns false for NaN, Infinity, non-number types and numeric strings; returns true for negative integers and zero.

TABLE OF CONTENTS
1. Syntax and return value
2. Semantics and edge cases
3. Usage patterns for validation
4. Implementation notes for FizzBuzz

1. Syntax and return value
- Number.isInteger(value)
- Returns: true if typeof value === "number" and is finite and Math.trunc(value) === value; otherwise false.

2. Semantics and edge cases
- Number.isInteger(1) -> true
- Number.isInteger(1.0) -> true
- Number.isInteger(1.1) -> false
- Number.isInteger(NaN) -> false
- Number.isInteger("3") -> false
- Use to validate n before iterating for FizzBuzz.

3. Usage patterns for validation
- if (!Number.isInteger(n)) throw new TypeError('n must be an integer');
- if (n < 0) throw new RangeError('n must be non-negative');

4. Implementation notes for FizzBuzz
- Use Number.isInteger to enforce input type strictly; do not coerce string numbers.

SUPPLEMENTARY DETAILS
- This method is part of ECMAScript 2015 (ES6) standard.
- Equivalent conceptual check: typeof v === 'number' && isFinite(v) && Math.floor(v) === v (but prefer Number.isInteger for clarity).

REFERENCE DETAILS
- Full signature: Number.isInteger(value) -> Boolean
- Parameter: value (any) — the value to be tested for being an integer.
- Returns: boolean.

DETAILED DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Retrieved: 2026-03-21
Data size (bytes): 154170
Extracted technical lines: "Number.isInteger() determines whether the passed value is an integer." (MDN title/lead)

ATTRIBUTION
Content derived from MDN Web Docs (Number.isInteger); retrieved 2026-03-21; data size: 154170 bytes.