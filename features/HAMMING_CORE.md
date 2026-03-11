# HAMMING_CORE

## Summary

Implement the core Hamming-distance feature: two named exports from src/lib/main.js, hammingDistance and hammingDistanceBits, with full input validation, correct Unicode code point handling, and comprehensive unit tests and README examples.

## Motivation

This feature completes the library's mission by providing robust, tested, and documented Hamming distance utilities that work correctly for Unicode strings and integer bit comparisons.

## Specification

1. Exports
   - Export hammingDistance(a, b) and hammingDistanceBits(x, y) as named exports from src/lib/main.js.

2. hammingDistance(a, b)
   - Accepts two arguments a and b.
   - If either argument is not a string, throw TypeError.
   - Compare strings by Unicode code points (not UTF-16 code units). Use a code-point-aware iteration (for example, Array.from or equivalent) to create comparable sequences of code points.
   - If the sequences differ in length, throw RangeError.
   - Return a non-negative integer equal to the number of positions where the corresponding code points differ.

3. hammingDistanceBits(x, y)
   - Accepts two arguments x and y.
   - If either argument is not a number or BigInt representing a non-negative integer, throw TypeError.
   - If either argument is negative, throw RangeError.
   - Treat both values as non-negative integers; compute the bitwise XOR and count the number of set bits in the result efficiently (e.g., Kernighan's algorithm or a language builtin) and return that count as a non-negative integer.

4. Errors
   - Type errors must be thrown as TypeError with helpful messages.
   - Range errors must be thrown as RangeError with helpful messages.

5. Documentation and examples
   - Update README.md to show import examples and usage for both functions, including the core acceptance examples:
     - hammingDistance("karolin", "kathrin") -> 3
     - hammingDistance("", "") -> 0
     - calling hammingDistance("a", "bb") throws RangeError
     - hammingDistanceBits(1, 4) -> 2
     - hammingDistanceBits(0, 0) -> 0

6. Tests
   - Add or update tests in tests/unit/main.test.js to cover:
     - Normal cases (example strings, integers).
     - Edge cases: empty strings, zero values, large integers, strings containing astral plane characters and combining sequences.
     - Error cases: non-string inputs, unequal-length strings, negative integers, non-integer numbers when integers are expected.
   - Tests must assert exact return values and thrown error types.

## Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- Unicode surrogate pairs and astral characters are handled by hammingDistance as single code points
- TypeError is thrown for non-string or non-integer arguments where specified
- RangeError is thrown for unequal-length strings and negative integers
- README contains clear usage examples for both functions
- Unit tests cover normal, edge, and error cases and pass

## Implementation notes

- Use Array.from to iterate code points for strings so that surrogate pairs are treated as single code points.
- For bit counting, use a simple loop over x ^ y with Kernighan's algorithm or Number.prototype.toString(2).split('1').length - 1 if clarity is preferred in tests.
- Keep error messages concise but specific to aid debugging and test assertions.

## Files to change

- src/lib/main.js  - implement and export the two functions
- tests/unit/main.test.js - add/adjust tests to satisfy the acceptance criteria
- README.md - add usage examples and API documentation
- examples/ (optional) - add small examples demonstrating both functions for the website
- package.json - no dependency changes required unless a test helper is necessary

## Test cases (representative)

- hammingDistance("karolin", "kathrin") => 3
- hammingDistance("1011101", "1001001") => 2
- hammingDistance("", "") => 0
- hammingDistance("\u{1F600}", "\u{1F601}") => 1  (two different emoji code points)
- hammingDistance("a\u0301", "á") => 0 or 1 depending on normalization policy; the implementation must compare code points as-is and tests should assert the chosen behavior; prefer code-point-as-is (so differ unless inputs are pre-normalized)
- hammingDistanceBits(1, 4) => 2
- hammingDistanceBits(0, 0) => 0
- hammingDistanceBits(255, 256) => number of differing bits across representation
- Errors for invalid types and ranges as described above


## Notes on normalization

The feature intentionally compares raw code points; if normalization is desired later, add a follow-up feature NORMALIZATION to offer canonicalization options. For now, document that combining sequences and precomposed characters are treated as distinct code point sequences.
