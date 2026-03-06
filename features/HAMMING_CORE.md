# HAMMING_CORE

Feature: HAMMING_CORE

Summary

Provide a precise, minimal, and testable implementation of the Hamming distance core library. The feature delivers two named exports that compute Hamming distances for Unicode strings and for integer bit representations, with strict validation and documented behavior.

Motivation

The project mission is to expose correct Hamming distance utilities. This feature defines exact input validation rules, Unicode semantics, numeric handling, implementation constraints, and the tests required to confirm correctness and compatibility with Node 24+.

Specification

1. Public API
- Export two named functions from src/lib/main.js: hammingDistance(a, b) and hammingDistanceBits(x, y).

2. hammingDistance(a, b)
- Types: Both a and b must be strings; otherwise throw TypeError.
- Unicode correctness: Compare by Unicode code points, not UTF-16 code units. Use Array.from or for...of to iterate code points so surrogate pairs and combined graphemes count as single code points for position correspondence.
- Length validation: If the two strings contain different numbers of code points, throw RangeError.
- Semantics: Return a non-negative integer equal to the number of positions where the corresponding code points differ.
- Determinism: Comparison is positional by code point index (no normalization). Consumers who require normalization should normalize inputs before calling the function.

3. hammingDistanceBits(x, y)
- Types: Accept JavaScript Number integers and BigInt for x and y; otherwise throw TypeError.
- Range validation: If either input is negative, throw RangeError.
- Implementation: Convert numeric inputs to BigInt, compute XOR, then count set bits using a loop (Brian Kernighan style adapted for BigInt) until the value is zero.
- Semantics: Return the number of differing bits between the two non-negative integers; leading zeros are not considered (XOR covers differing bit positions up to the highest set bit).

4. Errors and messages
- TypeError for wrong types (non-string for hammingDistance, non-number/non-bigint for hammingDistanceBits).
- RangeError for unequal-length strings or negative integers.
- Error messages should be short and actionable (e.g., "hammingDistance: arguments must be strings").

5. Implementation constraints
- Single file implementation at src/lib/main.js using ES module named exports.
- No external dependencies.
- Keep functions small, well-documented, and Node 24+ compatible.

6. Tests
- Add unit tests under tests/unit/ that cover:
  - Typical cases: ASCII strings with differences, integers with differing bits.
  - Edge cases: empty strings, zero values, very large integers (BigInt), emoji and non-BMP characters, surrogate pairs.
  - Error cases: non-string inputs, unequal-length strings, non-integer numeric inputs (e.g., 1.5), negative integers.
  - Deterministic behavior: ensure Unicode code point iteration counts positions as intended.

Acceptance criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- Both functions are exported as named exports from src/lib/main.js and callable by examples and tests
- Unit tests exist in tests/unit/, cover normal/edge/error cases, and pass in CI
- README contains usage examples that match the tests and show Unicode handling and numeric examples

Notes

- Keep normalization out of scope. The library compares code points exactly as provided. If callers need normalized text, they should perform normalization before calling the functions.
- Prefer clarity and correctness over micro-optimizations.
