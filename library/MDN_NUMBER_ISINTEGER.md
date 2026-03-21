MDN_NUMBER_ISINTEGER

Table of contents:
1. Purpose and signature
2. Behaviour and return values
3. Type and coercion rules
4. Implementation notes for validation

1. Purpose and signature
- Name: Number.isInteger(value)
- Returns true if value is of type Number and is an integer (no fractional part).

2. Behaviour and return values
- Number.isInteger(3) -> true
- Number.isInteger(3.0) -> true
- Number.isInteger(3.1) -> false
- Number.isInteger('3') -> false (no coercion)
- Number.isInteger(NaN) -> false

3. Type and coercion rules
- Does not coerce strings or other types; only returns true for numeric primitive integers.
- Use this to validate inputs before running integer-only algorithms.

4. Implementation notes for validation
- For mission: reject non-integers by throwing TypeError when Number.isInteger(n) === false (and the value is not a Number), or if typeof n !== 'number' throw TypeError.

Reference digest: MDN Number.isInteger page retrieved 2026-03-21
Attribution: MDN content (retrieved HTML). Size: ~155KB (fetched)
