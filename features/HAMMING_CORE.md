# HAMMING_CORE

Feature: HAMMING_CORE

Summary

Provide a precise, minimal, and testable implementation of the Hamming distance core library. Deliver two named exports that compute Hamming distances for Unicode strings and integer bit representations, with strict validation, clear error semantics, and unit tests.

Motivation

The project mission is to expose correct Hamming distance utilities. Consumers need a small, dependency-free library that correctly handles Unicode code points and arbitrary-size integers (BigInt) for bit comparisons and that fails fast on invalid input.

Specification

1. Public API
- Export two named functions from src/lib/main.js: hammingDistance and hammingDistanceBits.

2. hammingDistance(a, b)
- Types: Both a and b MUST be strings. If not, throw TypeError with a brief message starting with "hammingDistance:".
- Unicode correctness: Compare by Unicode code points, not UTF-16 code units. Iterate using Array.from or for...of so non-BMP characters (emoji, surrogate pairs) count as single code points.
- Length validation: If the two strings have different numbers of code points, throw RangeError with a message starting with "hammingDistance:".
- Behavior: Return a non-negative integer equal to the number of positions where corresponding code points differ.
- Normalization: Do NOT perform Unicode normalization; callers must normalize before calling if required.

3. hammingDistanceBits(x, y)
- Types: Accept Number integers and BigInt values. If an argument is neither a Number nor a BigInt, throw TypeError with a message starting with "hammingDistanceBits:".
- Range validation: If either input is negative, throw RangeError.
- Integer verification: If a Number is provided, it must be an integer (Number.isInteger); non-integer Numbers throw TypeError.
- Implementation: Convert inputs to BigInt and compute XOR; count set bits using a loop (Brian Kernighan algorithm adapted for BigInt) until the value is zero.
- Behavior: Return the count of differing bits between the two non-negative integers; leading zeros are irrelevant since XOR covers the meaningful bit range.

4. Errors and messages
- Use TypeError for wrong types and RangeError for negative integers or unequal-length strings.
- Messages should be short and actionable, prefixed by the function name (e.g., "hammingDistance: arguments must be strings").

5. Implementation constraints
- Single-file implementation at src/lib/main.js using ES module named exports.
- No external dependencies; Node 24+ compatible.
- Keep functions small and well-documented with inline comments only where clarifying.

6. Tests
- Add unit tests under tests/unit/ that cover:
  - Typical cases: ASCII strings with known distances, small integers with known bit differences.
  - Edge cases: empty strings, zero values, very large integers (BigInt), emoji and non-BMP characters, surrogate pairs.
  - Error cases: non-string inputs, unequal-length strings, non-integer numeric inputs (e.g., 1.5), negative integers.
  - Determinism: ensure Unicode code point iteration counts positions as intended.
- Tests should assert exact return values and that errors are thrown with appropriate types.

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

- Keep normalization out of scope. The library compares code points exactly as provided.
- Prioritize clarity and correctness over micro-optimizations.