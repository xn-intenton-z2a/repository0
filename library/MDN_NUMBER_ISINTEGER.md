MDN_NUMBER_ISINTEGER

Table of Contents
- Purpose
- Algorithmic definition
- Edge cases
- Example usage guidance
- Reference details
- Detailed digest (retrieved: 2026-03-19)
- Attribution and data size

Normalised extract
Purpose
- Number.isInteger(value) returns true if the given value is of the Number type and is an integer (no fractional part).

Algorithmic definition
- Equivalent to: typeof value === 'number' && isFinite(value) && Math.floor(value) === value
- Returns false for NaN, Infinity, -Infinity, and non-number types.

Edge cases
- Number.isInteger(1.0) -> true
- Number.isInteger(1.1) -> false
- Number.isInteger('1') -> false

Example usage guidance
- Use to validate integer inputs where integers are required (e.g., bit counts, array indices).
- For large integer checks beyond Number precision use BigInt type checks instead.

Reference details
- Function signature: Number.isInteger(value) -> Boolean
- Throws: none

Detailed digest
Source: MDN "Number.isInteger"
Retrieved: 2026-03-19
Data obtained: HTML snapshot from MDN (see SOURCES.md)

Attribution
Original source: MDN Web Docs — Number.isInteger

