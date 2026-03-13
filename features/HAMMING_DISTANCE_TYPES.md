# HAMMING_DISTANCE_TYPES

Specification

Define and test input validation and error semantics for both API functions.

Acceptance Criteria

- `hammingDistance` throws `TypeError` when either argument is not a string.
- `hammingDistance` throws `RangeError` when strings differ in length measured in Unicode code points (e.g., `"a"` vs `"bb"`).
- `hammingDistanceBits` throws `TypeError` for non-integer Number inputs (e.g., `1.5`) or non-number/BigInt types.
- `hammingDistanceBits` throws `RangeError` for negative integer inputs.
- Valid inputs (strings of equal length, non-negative integer Numbers or BigInts) return numeric distances.

Notes

Unit tests should assert specific error types and messages where appropriate to avoid ambiguity.
