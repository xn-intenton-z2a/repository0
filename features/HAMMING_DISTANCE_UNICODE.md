# HAMMING_DISTANCE_UNICODE

Status: implemented and pruned

This feature ensured `hammingDistance(a, b)` compares strings by Unicode code points, treating supplementary characters as single positions. Unit tests exercise supplementary-plane characters and emoji.

Acceptance Criteria (verified)

- `hammingDistance("karolin", "kathrin")` returns `3`. (Verified)
- `hammingDistance("\u{1F600}", "\u{1F601}")` (two distinct emoji code points) returns `1`. (Verified)
- `hammingDistance("\uD83D\uDE0D", "\uD83D\uDE0D")` (surrogate-pair representation of the same code point) returns `0`. (Verified)
- `hammingDistance("", "")` returns `0`. (Verified)

Notes

Feature pruned; implementation uses Array.from() to iterate code points.