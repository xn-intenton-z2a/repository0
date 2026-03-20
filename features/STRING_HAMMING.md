# String Hamming Distance

Goal
----
Provide a feature to compute the Hamming distance between two strings in terms of Unicode code points (not bytes or code units). Align with MISSION.md by being small, testable, and well-documented.

Behavior & API
--------------
- Function: `stringHamming(a: string, b: string): number`
- Inputs: two strings `a` and `b`.
- Output: non-negative integer representing the number of positions at which the corresponding Unicode code points are different.
- Precondition: strings must have equal code point length; otherwise, function throws an `Error` with message `"unequal-length"`.
- The function operates on Unicode code points (characters), so surrogate pairs and combining sequences are counted per code point as reported by iterating over the string with for..of or using Array.from(str).

Acceptance Criteria (Testable)
------------------------------
1. Exact match: stringHamming('abc', 'abc') === 0
2. Single difference: stringHamming('açd', 'acd') === 1 (ç vs c)
3. Emoji difference: stringHamming('a😀b', 'a😁b') === 1
4. Unequal lengths: stringHamming('ab', 'abc') throws Error('unequal-length')
5. Combining characters: stringHamming('é', 'e\u0301') === 1 if inputs are not normalized; caller may normalize to treat as equal

Tests to include
----------------
- Unit tests for basic ASCII strings
- Tests with emoji and characters outside BMP (use literal emojis like '😀' and '😁')
- Tests that verify error is thrown for unequal lengths
- Tests that demonstrate behavior with combining marks vs precomposed characters (e.g., 'é' vs 'e' + combining acute)

Implementation Notes
--------------------
- Use Array.from(a) and Array.from(b) or [...a] to iterate code points.
- If lengths differ after code point split, throw `Error('unequal-length')`.
- Count positions where codePointArrayA[i] !== codePointArrayB[i].
- Keep API small and pure; no side effects.
- Document edge cases: normalization (NFC vs NFD) is not performed by default; callers should normalize if they expect canonical equivalence.
- Align with MISSION.md: small, well-documented, test-driven, and platform-neutral.
