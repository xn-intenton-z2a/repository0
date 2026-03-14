# UNICODE_SUPPORT

Overview

Ensure Hamming distance of strings compares Unicode code points rather than UTF-16 code units. This prevents incorrect results for characters represented by surrogate pairs, emoji, and other multi-code-unit code points.

Deliverables

- Implementation uses code point-aware iteration (for...of or Array.from) when measuring length and comparing positions.
- Unit tests covering surrogate pairs and multi-code-unit characters, including emoji and some composed characters.
- A short explanation in README explaining why code point iteration is required.

Behavior details

- The string comparison must treat each user-perceived character (code point) as a single position. For example, a single emoji like smiling face must be counted as one position even if it occupies two UTF-16 code units.
- When strings are equal in code point count, compare corresponding code points and count differing positions.

Acceptance Criteria

- Strings containing surrogate-pair characters are compared by code point and not by UTF-16 unit index.
- A test case comparing two different emoji of the same position must return 1.
- Composition differences that change code points must be detectable; tests should include a composed and decomposed pair where code points differ and assert the distance accordingly.

Notes

Recommend using Array.from(string) or spread operator on strings to produce arrays of code points for deterministic indexing.