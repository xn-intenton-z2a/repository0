# HAMMING_CORE

Feature: HAMMING_CORE

Summary

Provide a precise, minimal, and fully testable implementation of Hamming distance utilities as the library core. Deliver two named exports from src/lib/main.js: hammingDistance and hammingDistanceBits, each with strict input validation, clear error semantics, Unicode-correct behaviour, and comprehensive unit tests.

Motivation

The repository mission is to expose correct Hamming distance utilities. Consumers need a small, dependency-free library that correctly handles Unicode code points and arbitrary-size integers (BigInt) for bit comparisons and fails fast on invalid input.

Specification

1. Public API

- Export two named functions from src/lib/main.js: hammingDistance and hammingDistanceBits.
- Use ES module named exports. Do not provide a default export.

2. hammingDistance(a, b)

- Types: Both a and b MUST be strings. If not, throw TypeError with a short message starting with "hammingDistance:".
- Unicode correctness: Compare by Unicode code points, not UTF-16 code units. Iterate using for...of or Array.from so surrogate pairs and non-BMP characters count as single positions.
- Length validation: If the two strings have different numbers of Unicode code points, throw RangeError with a message starting with "hammingDistance:".
- Behavior: Return a non-negative integer equal to the number of positions where corresponding code points differ.
- Normalization: Do NOT perform Unicode normalization; callers must normalize before calling if required.

3. hammingDistanceBits(x, y)

- Types: Accept Number integers and BigInt values. If an argument is neither a Number nor a BigInt, throw TypeError with a message starting with "hammingDistanceBits:".
- Range validation: If either input is negative, throw RangeError.
- Integer verification: If a Number is provided, it must be an integer (Number.isInteger); non-integer Numbers throw TypeError.
- Implementation: Convert inputs to BigInt and compute XOR. Count set bits using a loop adapted for BigInt (Brian Kernighan algorithm using value &= value - 1) until the value is zero.
- Behavior: Return the count of differing bits between the two non-negative integers. Leading zeros are irrelevant because XOR produces the meaningful bit-range.

4. Errors and messages

- Use TypeError for wrong types and RangeError for negative integers or unequal-length strings.
- Error messages should be short, actionable, and prefixed by the function name (for example, "hammingDistance: arguments must be strings").

5. Implementation constraints

- Single-file implementation located at src/lib/main.js using ES module named exports.
- No external dependencies; coded for Node 24+ and modern browsers where BigInt is available.
- Keep functions small and well-documented; prefer concise inline comments only where clarifying.

6. Tests

- Add unit tests under tests/unit/ covering:
  - Typical cases: ASCII strings with known distances and small integers with known bit differences.
  - Edge cases: empty strings, zero values, very large integers (BigInt), emoji and non-BMP characters, surrogate pairs.
  - Error cases: non-string inputs, unequal-length strings, non-integer numeric inputs (for hammingDistanceBits), negative integers.
  - Determinism: ensure Unicode code point iteration counts positions as intended.
- Tests must assert exact return values and that errors are thrown with the correct error type. Test messages need not be asserted but may be checked for presence of the function name prefix.

Acceptance criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- Both functions are exported as named exports from src/lib/main.js
- Unit tests exist under tests/unit/ and cover normal, edge, and error cases
- README contains usage examples consistent with the tests

Notes

- Keep Unicode normalization out of scope; document this explicitly in the README.
- Prefer clarity and correctness over micro-optimizations; BigInt arithmetic is acceptable for large integers.
