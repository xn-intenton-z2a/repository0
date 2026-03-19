# UNICODE_SUPPORT

Purpose

Ensure string comparisons operate on Unicode code points so characters outside the BMP (astral symbols, emoji, surrogate pairs) are treated as single positions when computing string Hamming distances.

Behavior

- All string-related functions (stringHamming) must operate on Unicode code points rather than UTF-16 code units.
- Length checks and per-position comparisons must be performed in code point units.

Examples (for tests)

- Let s1 be the single astral code point U+1F600 (grinning face) and s2 be another single astral code point; stringHamming(s1, s2) should be 1 when code points differ.
- A surrogate-pair-backed character must count as a single position when testing equal length.

Acceptance criteria

- Library treats astral characters as single code points for length and position comparisons; tests with emoji or U+1Dxxx characters must pass.
- Tests demonstrate that surrogate-pair characters are not double-counted when checking equal length.

Implementation notes

- Use Array.from or for-of iteration to obtain code points when measuring length and comparing positions.
- Avoid implementations that rely on String.prototype.length for code point counts.
