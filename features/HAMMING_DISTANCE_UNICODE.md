# HAMMING_DISTANCE_UNICODE

Specification

Ensure `hammingDistance(a, b)` compares strings by Unicode code points (not UTF-16 code units) so supplementary characters are treated as single positions.

Acceptance Criteria

- `hammingDistance("karolin", "kathrin")` returns `3`.
- `hammingDistance("\u{1F600}", "\u{1F601}")` (two distinct emoji code points) returns `1`.
- `hammingDistance("\uD83D\uDE0D", "\uD83D\uDE0D")` (surrogate-pair representation of the same code point) returns `0`.
- `hammingDistance("", "")` returns `0`.

Notes

Tests should use `Array.from()` or `for...of` to iterate code points; acceptance requires unit tests that exercise supplementary-plane characters.
