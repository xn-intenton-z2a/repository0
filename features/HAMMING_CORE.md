# HAMMING_CORE

Summary

Define and specify the library's core API for computing Hamming distances for strings and non-negative integers. This feature describes the named exports, input validation rules, and exact behavior so implementation and tests can be written against a stable contract.

Specification

API exports

- hammingDistanceStrings(a, b): number
- hammingDistanceBits(a, b): number

Behavior

- hammingDistanceStrings compares two strings by Unicode code points and returns the number of differing code point positions.
- hammingDistanceBits compares two non-negative integers and returns the number of differing bits in their binary representation.
- Both functions return a non-negative integer (zero when inputs are identical under the chosen metric).

Validation

- If hammingDistanceStrings receives non-string arguments, it throws TypeError.
- If the two strings are not the same length in code points, it throws RangeError.
- If hammingDistanceBits receives non-integer or negative arguments, it throws TypeError for non-integer types and RangeError for negative integers.

Performance and edge cases

- Implementations should operate correctly for empty inputs (empty strings return 0, zero integers return 0) and large integers within JavaScript safe integer bounds.
- Use an algorithm appropriate for typical JS usage; readability and correctness prioritized over micro-optimizations.

Acceptance criteria

- Hamming distance between karolin and kathrin is 3.
- Hamming distance between empty string and empty string is 0.
- hammingDistanceStrings throws RangeError when input strings differ in length (by code points).
- Bit-level hamming distance between 1 and 4 is 2.
- Bit-level hamming distance between 0 and 0 is 0.
- All API functions are exported as named exports from src/lib/main.js.
- Implementation validated by unit tests in tests/unit/ covering normal, edge and error cases.
