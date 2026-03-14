# UNICODE_SUPPORT

Summary

Ensure string comparison is correct for full Unicode code points rather than UTF-16 code units. This feature defines expected behavior for surrogate pairs, astral symbols, and grapheme-like sequences when computing Hamming distance by code point position.

Specification

- The library must compare strings by Unicode code points. Splitting strings into arrays of code points using a standard JS technique (for example, Array.from or spread over string) is acceptable.
- The function must treat each Unicode code point as a single position even when it is encoded as a surrogate pair in UTF-16.
- Combining marks are considered separate code points and therefore occupy positions in the length check and comparison.

Test cases (representative)

- Single astral emoji: hammingDistanceStrings('\u{1F600}', '\u{1F601}') equals 1.
- Surrogate vs composed: comparing strings which differ only by a combining mark should count the combining mark as a differing position.
- Length validation uses code point length; two strings that have equal UTF-16 unit length but different code point counts are treated by their code point lengths and may raise RangeError if not equal.

Acceptance criteria

- Code point-aware comparisons are used for all string comparisons in the library.
- Representative unit tests for astral symbols and combining mark scenarios are present in tests/unit and pass.
- hammingDistanceStrings uses code point splitting and throws RangeError when code point lengths differ.
