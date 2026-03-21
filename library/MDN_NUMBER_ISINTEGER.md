MDN_NUMBER_ISINTEGER

1) Normalised extract

Table of contents:
- Signature
- Behavior
- Edge cases
- Use in input validation for FizzBuzz

Signature:
- Number.isInteger(value) -> boolean

Behavior:
- Returns true only when the operand is of type 'number', is finite, and the numeric value has no fractional component (i.e., floor(value) === value).
- Returns false for NaN, Infinity, non-number types, and values with fractional parts.

Edge cases and examples:
- Number.isInteger(3) => true
- Number.isInteger(3.0) => true
- Number.isInteger(3.1) => false
- Number.isInteger(NaN) => false
- Number.isInteger(Infinity) => false

Use in FizzBuzz input validation:
- Validate n with Number.isInteger(n) before using modulo operations: if (!Number.isInteger(n)) throw new TypeError('n must be an integer');
- Depend on this exact predicate rather than loose parsing to avoid accepting string-numbers or floats.

2) Supplementary details
- Number.isInteger is part of ES2015 and is available in modern Node versions (project specifies Node >= 24).
- Implementation detail: it performs a numeric type test plus a finite/integer check; it will not coerce strings or other types.

3) Reference details
- Method signature: Number.isInteger(value: any) -> boolean
- Parameters: value — any JavaScript value
- Returns: boolean — true if value is a number and an integer, false otherwise
- Usage in validators: use as the canonical integer check for numeric inputs in this project.

4) Detailed digest
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- Retrieved: 2026-03-21
- Data size fetched: 154170 bytes
- Extracted content: MDN documents the exact semantics of Number.isInteger, its return values for NaN/Infinity, and usage recommendations for input validation.

5) Attribution
- Attribution: MDN Web Docs; retrieved 2026-03-21; raw HTML captured during crawl: 154170 bytes.
