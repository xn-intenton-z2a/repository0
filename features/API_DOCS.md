# API_DOCS

Summary

Documents the public API, usage examples, and README-level expectations so the library is easy to adopt and test. This feature ties implementation, tests, and the web demo to a single, stable public contract.

Public API (named exports)

- hammingDistanceStrings(a, b)
  - Compute Hamming distance between two strings using Unicode code points.
- hammingDistanceBits(a, b)
  - Compute Hamming distance between two non-negative integers by counting differing bits.

Usage examples (to appear in README and tests)

- hammingDistanceStrings("karolin", "kathrin") // => 3
- hammingDistanceStrings("", "") // => 0
- hammingDistanceBits(1, 4) // => 2
- hammingDistanceBits(0, 0) // => 0

Acceptance criteria (testable)

1. README contains copy-paste usage examples that call hammingDistanceStrings and hammingDistanceBits and show the exact results above.
2. src/lib/main.js exports named functions hammingDistanceStrings and hammingDistanceBits (ES module named exports).
3. Unit tests import the named exports and verify all acceptance criteria described in STRING_HAMMING, BIT_HAMMING, and UNICODE_SUPPORT feature files.

Notes

- Keep examples minimal and copyable.
- The README examples must use the exported names above; earlier inconsistent names were corrected to match implementation.

Mission mapping

This feature ensures the library's public surface satisfies the mission acceptance criteria and is discoverable by users and tests.