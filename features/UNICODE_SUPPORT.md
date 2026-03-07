# UNICODE_SUPPORT

Specification

Ensure the library handles Unicode correctly by comparing Unicode code points rather than UTF-16 code units. This feature clarifies expected behavior, test cases, and examples that specifically exercise surrogate pairs, astral-plane characters, and common emoji.

Behavioral notes

- The library will compare Unicode code points by using code point iteration (for example, via Array.from or equivalent). Grapheme cluster normalization is intentionally out of scope for this feature; the implementation compares raw code points.
- Document this behavior clearly in README and tests so consumers understand when to apply normalization externally.

Required tests

- Surrogate pair characters count as one position: hammingDistance(emojiA, emojiB) where emojiA and emojiB are single emoji should return 1 when they are different.
- Astral characters: hammingDistance('𝔘', '𝔛') returns 1 (both are single code points even though they occupy surrogate pairs in UTF-16).
- Combining sequences: demonstrate that 'a' plus combining acute accent is considered different from the single composed character 'á' because comparison is by code points.
- Non-string argument validation: TypeError when inputs are not strings.

Acceptance Criteria

- hammingDistance('😄', '🙂') returns 1
- hammingDistance('a01', 'á') demonstrates a non-zero distance and tests assert the behavior (code points differ)
- Tests demonstrate that surrogate pairs are treated as single positions
- README contains a Unicode section that explains code point comparison semantics and suggests normalization when needed
