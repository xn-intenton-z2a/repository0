# UNICODE_SUPPORT

Feature name: UNICODE_SUPPORT

Summary

Ensure the library and CLI compare strings by Unicode code points rather than UTF-16 code units and provide clear validation and tests for astral characters, surrogate pairs, combining marks and normalization edge cases. This feature documents expected behavior and prescribes tests and examples to guarantee correct handling of multi-code-unit characters and common Unicode pitfalls.

Behavior

- Comparison contract
  - hammingDistance(a, b) must iterate by Unicode code points (not UTF-16 code units). Implementations should use Array.from or for...of to obtain code point sequences.
  - If the number of code points differs between inputs, hammingDistance must throw RangeError.
  - The comparison is strict on code points: different composite sequences (precomposed vs decomposed) are treated as different code point sequences unless normalized by the caller.

- Validation and errors
  - Non-string inputs must throw TypeError with a clear message indicating the expected type.
  - RangeError messages must indicate code point length mismatch and include both lengths in the message for easier debugging.

- Documentation and examples
  - README must include examples demonstrating: simple ASCII comparisons, emoji vs emoji sequence comparisons (surrogate pairs), and an example showing that NFC and NFD forms compare as different code point sequences unless normalized explicitly.
  - Provide a short note describing how callers can normalize strings (String.prototype.normalize) when they want canonical equivalence rather than code point equality.

Tests and examples

- Unit tests to include:
  - karolin vs kathrin -> 3
  - empty vs empty -> 0
  - mismatched code-point lengths: "a" vs "bb" throws RangeError
  - astral character test: compare "\u{1F600}" (grinning face) with an equivalent surrogate-pair representation and assert correct behavior when both are provided as JS strings; comparison should count code points correctly.
  - combining mark test: 'e\u0301' (e + combining acute) vs 'é' (precomposed) should be treated as different code point sequences and not coerced to equal; include assert demonstrating this and a second assertion showing normalization makes them equal when normalized to NFC.
  - non-string input tests: passing null, undefined, 123 must throw TypeError.

Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError whose message includes both code point lengths
- hammingDistance("\u{1F600}", "\uD83D\uDE00") treats the inputs as single code points and computes distances accordingly (no surrogate-unit mismatch)
- hammingDistance("e\u0301", "é") treats inputs as different code point sequences; after normalizing both to NFC the hammingDistance result is 0
- README includes a Unicode section with examples showing surrogate-pair, combining-mark, and normalization guidance
