# API_DOCS

Summary

Documents the public API, usage examples, and the README-level requirements so the library is easy to adopt and test. This feature ties the implementation to visible documentation and examples used by unit tests and the web demo.

Public API (named exports)

- hammingString(a, b): compute Hamming distance between two strings (code-point aware).
- hammingBits(a, b): compute Hamming distance between two non-negative integers.

Usage examples (README and tests)

- Example: hammingString("karolin", "kathrin") // => 3
- Example: hammingBits(1, 4) // => 2

Acceptance criteria (testable)

1. README contains usage examples that call the named exports and show expected results.
2. src/lib/main.js exports named functions hammingString and hammingBits.
3. Unit tests import named exports and verify the acceptance criteria in STRING_HAMMING, BIT_HAMMING, and UNICODE_SUPPORT.

Notes for implementer

- Keep examples minimal and copyable: one-line examples for both string and bit APIs.
- Ensure README includes a short description, installation snippet (npm install), and the API examples above.
