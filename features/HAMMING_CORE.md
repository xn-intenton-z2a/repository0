# HAMMING_CORE

## Summary

Provide the core Hamming-distance library API: two named exports from src/lib/main.js — hammingDistance and hammingDistanceBits — with strict input validation, correct Unicode code-point handling, thorough unit tests, and clear README examples.

## Motivation

This feature directly fulfils the project mission by delivering small, well-tested utilities for comparing textual and integer data using Hamming distance semantics. The library must behave predictably for Unicode strings and non-negative integers and be easy to verify via unit tests.

## Specification

1. API
   - Export named functions: hammingDistance(a, b) and hammingDistanceBits(x, y) from src/lib/main.js.
   - Each function must be pure and synchronous.

2. hammingDistance(a, b)
   - Signature: hammingDistance(a: string, b: string) => number
   - Validation:
     - If a or b is not a string, throw TypeError with message containing the word "string".
     - Compare strings by Unicode code points. Use Array.from or equivalent to iterate code points so surrogate pairs (astral characters) are treated as single positions.
     - If the code-point sequences have different lengths, throw RangeError with a message mentioning "length" or "equal".
   - Behaviour:
     - Return an integer >= 0 equal to the count of positions where corresponding code points differ.
     - Empty strings are valid and return 0 when both are empty.
     - The function compares raw code points; it does not perform Unicode normalization.

3. hammingDistanceBits(x, y)
   - Signature: hammingDistanceBits(x: number|BigInt, y: number|BigInt) => number
   - Validation:
     - If x or y is not a number or BigInt, throw TypeError with message containing "integer" or "number".
     - If x or y is negative, throw RangeError mentioning "non-negative" or "negative".
     - Non-integer numbers (e.g., 1.5) are invalid and should cause TypeError.
   - Behaviour:
     - Treat inputs as non-negative integers (Number or BigInt). Compute XOR and count set bits in the result using an efficient method (e.g., Kernighan's algorithm). Return the set-bit count as a non-negative integer.
     - Support values up to the limits of Number safely for tests; BigInt may be accepted and handled where appropriate.

4. Errors
   - Use TypeError for invalid types and RangeError for invalid numeric ranges or unequal string lengths.
   - Error messages should be concise but allow tests to assert on error type and presence of a keyword (e.g., "string", "length", "non-negative").

5. Documentation
   - Update README.md with a short API section describing both functions, their signatures, validation rules, and short inline examples demonstrating expected results. Examples must include the core acceptance examples.

6. Tests
   - Update or add tests in tests/unit/main.test.js to cover:
     - Normal cases: typical strings and integers
     - Edge cases: empty strings, zero, large integers, astral-plane characters (emoji), combining sequences
     - Error cases: non-string inputs, unequal-length strings, negative integers, non-integer numbers
   - Tests must assert exact values or thrown error types (TypeError or RangeError) and check keywords in messages where useful.

## Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- Unicode surrogate pairs and astral characters are treated as single code points by hammingDistance
- TypeError is thrown for invalid argument types
- RangeError is thrown for unequal-length strings and negative integers
- README contains API docs and examples for both functions
- Unit tests in tests/unit/main.test.js cover normal, edge, and error cases and pass

## Implementation notes

- For string code points, use Array.from(string) or spread into [...string] to iterate code points rather than UTF-16 code units.
- For bit counting, implement Kernighan's algorithm for clarity and performance when using Number; handle BigInt variants by adapting the same loop logic.
- Keep implementation small and dependency-free to remain a single-file library export.

## Files to change

- src/lib/main.js: implement and export hammingDistance and hammingDistanceBits
- tests/unit/main.test.js: add unit tests matching the acceptance criteria
- README.md: document API and show examples
- examples/: optional small demo for the website, but not required for initial acceptance

## Test cases (representative)

- hammingDistance("karolin", "kathrin") => 3
- hammingDistance("1011101", "1001001") => 2
- hammingDistance("", "") => 0
- hammingDistance("\u{1F600}", "\u{1F601}") => 1 (different emoji code points; treated as single code points)
- hammingDistance("a\u0301", "á") => differs (combining sequence vs precomposed) because no normalization is applied
- hammingDistanceBits(1, 4) => 2
- hammingDistanceBits(0, 0) => 0
- hammingDistanceBits(255, 256) => specific integer result asserted in tests

## Notes on normalization

This feature intentionally compares raw code points. A future NORMALIZATION feature may add optional canonicalization (NFC/NFD) if users request canonical equivalence handling.
