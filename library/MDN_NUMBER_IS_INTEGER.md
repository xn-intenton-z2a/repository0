NORMALISED EXTRACT

Table of contents
- Purpose and semantics
- Return conditions
- Use cases for validation

Purpose and semantics
- Number.isInteger(value) returns true only if the argument is of the number primitive type and is a finite integer (no fractional part).
- It does not coerce strings or other types; Number.isInteger('3') returns false.

Return conditions (precise)
- True when typeof value === 'number' and isFinite(value) and Math.floor(value) === value.
- False for NaN, Infinity, -Infinity, numeric strings, and non-number types.

Use cases for validation
- Validate parameter n for fizzBuzz and fizzBuzzSingle: if (!Number.isInteger(n)) throw new TypeError('n must be an integer').
- Accepts whole-number floats such as 3.0 because they are mathematically integers.

SUPPLEMENTARY DETAILS
- Behavior differences with global isInteger polyfills: prefer built-in Number.isInteger for clarity and reliability.

REFERENCE DETAILS
- Signature: Number.isInteger(value) -> boolean
- Parameters: value (any) — returns true only for JS number primitives that are whole numbers.

DETAILED DIGEST
- MDN description of Number.isInteger documents the exact behaviour, examples and caveats (no coercion, NaN/Infinity handling).
- Retrieval date: 2026-03-21
- Data size obtained during crawling: 154170 bytes

ATTRIBUTION
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- Retrieved: 2026-03-21
- Content-Length (reported by server): 154170 bytes
