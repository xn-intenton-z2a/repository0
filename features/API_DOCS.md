# API_DOCS

Summary

Documents the public API, usage examples, and the README-level requirements so the library is easy to adopt and test. This feature ties the implementation to visible documentation and examples used by unit tests and the web demo.

Public API (named exports)

- hammingDistanceStrings(a, b): compute Hamming distance between two strings (code-point aware).
- hammingDistanceBits(a, b): compute Hamming distance between two non-negative integers.

Usage examples (README and tests)

- Example: hammingDistanceStrings("karolin", "kathrin") // => 3
- Example: hammingDistanceBits(1, 4) // => 2

Acceptance criteria (testable)

1. README contains usage examples that call the named exports and show expected results.
2. src/lib/main.js exports named functions hammingDistanceStrings and hammingDistanceBits.
3. Unit tests import named exports and verify the acceptance criteria in STRING_HAMMING, BIT_HAMMING, and UNICODE_SUPPORT.

Notes for implementer

- Keep examples minimal and copyable: one-line examples for both string and bit APIs.
- Ensure README includes a short description, installation snippet (npm install), and the API examples above.

# Mission acceptance mapping

This section maps the mission's acceptance criteria to the API and testable expectations enforced by the feature files.

Acceptance checklist (must be verified by unit tests):

- Hamming distance between "karolin" and "kathrin" is 3 (string API: hammingDistanceStrings("karolin", "kathrin") === 3).
- Hamming distance between "" and "" is 0 (string API: hammingDistanceStrings("", "") === 0).
- Hamming distance between strings of different lengths throws RangeError (e.g., hammingDistanceStrings("a", "ab") throws RangeError).
- Bit-level Hamming distance between 1 and 4 is 2 (bit API: hammingDistanceBits(1, 4) === 2).
- Bit-level Hamming distance between 0 and 0 is 0 (hammingDistanceBits(0, 0) === 0).
- Unicode handling: hammingDistanceStrings operates on Unicode code points, not UTF-16 code units (see UNICODE_SUPPORT for astral and emoji tests).
- Input validation: TypeError is thrown for wrong types; RangeError for negative or unequal-length string inputs as specified in STRING_HAMMING and BIT_HAMMING.
- README demonstrates usage with the named exports and shows expected results.

When these items are covered by unit tests and documented in the README, the mission acceptance criteria are satisfied.
