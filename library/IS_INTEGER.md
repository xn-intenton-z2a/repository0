NORMALISED EXTRACT

Table of Contents:
1. Number.isInteger behavior
2. Edge cases and special numeric values
3. Implementation notes
4. Recommended usage patterns

1. Number.isInteger behavior
- JavaScript global Number.isInteger(value) returns true if value is of the Number type and is an integer (no fractional component).
- Returns false for non-number types, NaN, Infinity, and values with fractional parts.

2. Edge cases and special numeric values
- Number.isInteger(1) -> true
- Number.isInteger(1.0) -> true
- Number.isInteger(1.1) -> false
- Number.isInteger(NaN) -> false
- Number.isInteger(Infinity) -> false
- Number.isInteger(new Number(1)) -> false because the type is object, not primitive number

3. Implementation notes
- Implementation uses ECMAScript ToNumber conversion only when the input is already of type Number; does not coerce other types.
- Implementation pattern: typeof value === 'number' && isFinite(value) && Math.floor(value) === value
- For large integers beyond 2^53-1, Number.isInteger may still return true for IEEE-754 representable integers; beware of precision loss

4. Recommended usage patterns
- Use Number.isInteger to validate integer inputs rather than coercing silently
- Combine with range checks (e.g., value >= 1) to validate API parameters

DETAILED DIGEST

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Retrieved: 2026-03-09
Extracted technical content: exact truth table for typical values, implementation predicate pattern, non-coercion behavior
Data size obtained: ~6 KB
Attribution: MDN Web Docs, Mozilla
