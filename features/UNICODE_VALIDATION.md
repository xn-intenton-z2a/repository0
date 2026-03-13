# UNICODE_VALIDATION

Status: pending

Ensure Unicode correctness and robust input validation for the Hamming distance functions.

Scope

- `hammingDistance` must compare by Unicode code points so that supplementary-plane characters (emoji, rare scripts) count as a single position.
- Input validation rules:
  - Throw `TypeError` if either argument to `hammingDistance` is not a string.
  - Throw `RangeError` if the strings have unequal lengths (in code points).
  - For `hammingDistanceBits`, throw `TypeError` if inputs are not integers (Number with no fractional part or BigInt), and `RangeError` if negative.

Acceptance Criteria

- `hammingDistance("\u{1F600}", "\u{1F601}")` returns `1`.
- `hammingDistance("\uD83D\uDE0D", "\uD83D\uDE0D")` returns `0` (surrogate-pair equality).
- `hammingDistance("a", "bb")` throws `RangeError`.
- Non-string inputs (e.g., `null`, `42`) cause `TypeError`.
- Negative integers to `hammingDistanceBits` cause `RangeError` and non-integers cause `TypeError`.