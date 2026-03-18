ECMASCRIPT_NUMBER_ISINTEGER

Normalised extract (key technical points)

- Signature: Number.isInteger(value) -> Boolean.
- Behavior: Returns true if Type(value) is Number and value is finite and the mathematical value is an integer (no fractional part). Otherwise returns false.
- Implementation rule: false for NaN, +Infinity, -Infinity, and non-number types. For numbers, integerness is determined by value === Math.trunc(value) (truncation toward zero).

Table of contents

1. Signature and type check
2. Numeric tests (finite and integral)
3. Edge cases and examples
4. Implementation notes

Detailed technical content

1. Signature and type check
- Number.isInteger(value): performs Type(value) === Number check first; if false, return false immediately.

2. Numeric tests (finite and integral)
- If value is NaN or value is +Infinity or -Infinity return false.
- Otherwise if floor/ceil/trunc(value) equals value then return true; else false.

3. Edge cases and examples
- Number.isInteger(3) -> true
- Number.isInteger(3.0) -> true
- Number.isInteger(3.1) -> false
- Number.isInteger(NaN) -> false
- Number.isInteger('3') -> false (type is not Number)

4. Implementation notes
- Use Number.isFinite(value) to check finiteness before integer test if implementing manually.
- This is a reliable, fast, spec-defined guard when validating numeric function arguments that must be integers.

Reference details (spec-level)

- Method: Number.isInteger(value) -> Boolean
- Parameter: value (any)
- Returns: Boolean (true only if Type(value) is Number and value is an integer in mathematical sense)

Detailed digest

- Source: https://262.ecma-international.org/13.0/#sec-number.isinteger
- Retrieved: 2026-03-18
- Bytes fetched during crawl: 7181011 bytes
- Extracted: exact type and finiteness checks and the integerness definition used by the spec.

Attribution

- ECMAScript 2022 (ECMA-262) — Section: Number.isInteger
- URL: https://262.ecma-international.org/13.0/#sec-number.isinteger
- Data retrieved on 2026-03-18; raw HTML saved for auditing.
