# UNICODE_SUPPORT

Purpose

Ensure the library compares strings by Unicode code points (grapheme clusters are out of scope) so that characters outside the BMP (astral symbols, emoji) are treated as single logical characters when computing string Hamming distances.

Behavior

- All string-related functions (stringHamming and any public string API) must operate on Unicode code points rather than UTF-16 code units.
- Length checks and per-position comparisons must be performed in code point units.

Examples (for tests)

- Let s1 be the string composed of the single astral code point U+1F600 (grinning face) and s2 be another single astral code point; stringHamming(s1, s2) should compute 1 if code points differ.
- Multi-code-unit characters (such as characters represented by surrogate pairs) must count as a single position.

Acceptance criteria

- Library treats astral characters as single code points for length and position comparisons; tests with emoji or U+1Dxxx characters must pass.
- Tests demonstrate that a surrogate-pair-backed character is not double-counted when checking equal length.

Notes for implementation

- Use for-of iteration or Array.from to obtain arrays of code points when measuring length and comparing positions.
- Avoid implementations that rely on String.prototype.length for code point counts.
