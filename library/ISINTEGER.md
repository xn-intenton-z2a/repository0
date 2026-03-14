TITLE: ISINTEGER

TABLE OF CONTENTS
1. Purpose
2. Definition and algorithm
3. Edge cases
4. JavaScript reference implementation
5. Reference details (signature)
6. Detailed digest (source: MDN — Number.isInteger) — retrieved 2026-03-14
7. Attribution and data size

NORMALISED EXTRACT
1. Purpose
Number.isInteger(value) determines whether the provided value is an integer number without coercion.

2. Definition and algorithm
- Returns true if typeof value === 'number', isFinite(value), and Math.floor(value) === value (or value % 1 === 0).
- Does not coerce non-number types (e.g., '2' returns false).

3. Edge cases
- NaN and Infinity return false.
- Negative zero is considered an integer (Number.isInteger(-0) === true) because -0 === 0 in numeric equality.
- BigInt values are not numbers and return false.

4. JavaScript reference implementation
function isInteger(value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

REFERENCE DETAILS
- Signature: Number.isInteger(value) -> boolean
- Use when validating numeric input where integer semantics are required; prefer over legacy coercing checks.

DETAILED DIGEST
Source: MDN — Number.isInteger — retrieved 2026-03-14
Data obtained: exact specification semantics, edge cases and recommended usage.

ATTRIBUTION
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger — retrieved 2026-03-14. Data size retrieved: ~154 KB (HTML). License: MDN content (Creative Commons/MDN policies).