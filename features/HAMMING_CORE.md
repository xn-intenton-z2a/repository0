# HAMMING_CORE

Summary

Provide a clear, testable implementation of the Hamming distance core library functions and their validation rules so the repository exports a small, correct, well-tested JavaScript library.

Motivation

The repository's mission is to supply Hamming distance operations for strings and integers. A single, authoritative feature specification ensures implementers and tests align on behavior, Unicode handling, validation, and edge cases.

Specification

1. Public API
- Export two named functions from src/lib/main.js: hammingDistance(a, b) and hammingDistanceBits(x, y).

2. hammingDistance(a, b)
- Inputs: a and b must be strings. If either input is not a string, throw TypeError.
- Unicode correctness: Compare by Unicode code points, not UTF-16 code units. Implement using a reliable code point iterator (for example, Array.from or equivalent) so multi-code-unit characters count as one position.
- Length validation: If the two strings contain different numbers of code points, throw RangeError.
- Behavior: Return a non-negative integer equal to the number of positions where the corresponding code points differ.
- Examples: hammingDistance("karolin", "kathrin") -> 3; hammingDistance("", "") -> 0.

3. hammingDistanceBits(x, y)
- Inputs: x and y must be non-negative integers. Accept JavaScript Number integers and BigInt; if an input is not a number or bigint, throw TypeError.
- Range validation: If either input is negative, throw RangeError.
- Behavior: Compute the number of differing bits between x and y. Implementation should convert numbers to BigInt for bitwise reliability on large integers, perform XOR, and count set bits (e.g., Brian Kernighan algorithm adapted for BigInt).
- Examples: hammingDistanceBits(1, 4) -> 2; hammingDistanceBits(0, 0) -> 0.

4. Error types
- Use TypeError for invalid argument types (not string, not number/bigint).
- Use RangeError for unequal-length strings and negative integer inputs.

5. Implementation constraints
- Implement in a single source file: src/lib/main.js, exported as named exports using ES modules.
- Keep implementation minimal and dependency-free.
- Ensure Node 24+ compatibility.

6. Tests
- Add comprehensive unit tests under tests/unit/ covering:
  - Typical cases (strings of same length with differences, integers with differing bits)
  - Edge cases: empty strings, zero, large integers, multi-byte Unicode characters (e.g., emoji), surrogate pairs
  - Error cases: non-string arguments, unequal-length strings, non-integer inputs, negative integers

Implementation notes

- For Unicode-safe string length and indexing, iterate with Array.from to obtain code point arrays or use for...of to iterate code points. Do not rely on string.length.
- For bit counting use BigInt XOR and a loop that counts set bits until the value is zero.

Acceptance criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- Functions are exported as named exports from src/lib/main.js
- Unit tests cover normal, edge, and error cases and pass in CI
- README includes usage examples and API documentation related to these functions
