# UNICODE_SUPPORT

Summary

Defines expectations for correct handling of Unicode when computing Hamming distances between strings. The goal is to ensure comparisons operate on user-perceived characters (Unicode code points) rather than UTF-16 code units, avoiding surrogate-pair and astral-plane bugs.

Behavior

- All string-based APIs (hammingString) must operate on Unicode code points.
- Implementations should split strings into code points prior to length and position-based comparisons (Array.from or spread operator is recommended).
- Tests must include examples with characters outside the Basic Multilingual Plane (astral symbols) and with emoji to ensure surrogate pairs are treated as single code points.

Acceptance criteria (testable)

1. hammingString("a𝄞c", "a𝄟c") returns 1 where 𝄞 and 𝄟 are different astral musical symbols.
2. hammingString("😀", "😁") returns 1 for differing emoji (grinning vs grinning with smiling eyes).
3. hammingString("💩", "x") throws RangeError when code point counts differ and TypeError if non-strings provided.

Examples for tests

- const a = Array.from("a𝄞c"); // ensures length === 3
- assert.hammingString("a😀", "a😁") === 1

Notes for implementer

- Avoid using string indexing by code unit (str[i]) without first normalizing to an array of code points.
- Consider an explicit note that combining marks and grapheme clusters may be outside scope; the feature requires correctness at the code point granularity, not grapheme cluster equivalence, unless future features expand scope.
