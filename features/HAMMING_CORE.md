# HAMMING_CORE

Summary

A focused library feature that implements the repository mission: two named exports that compute Hamming distance between equal-length Unicode strings and between non-negative integers at the bit level. This feature prioritizes correctness, Unicode-safety, small surface area, and comprehensive tests and documentation.

Motivation

Provide a small, well-tested, dependency-free JavaScript library that other projects can import to calculate Hamming distances for text and integer bit patterns. Correct handling of Unicode code points and strict validation remove a common source of subtle bugs.

Specification

- Expose two named exports from src/lib/main.js: hammingDistance and hammingDistanceBits.
- hammingDistance accepts two string arguments and returns an integer count of code point positions where the strings differ. Input validation must throw TypeError if either argument is not a string, and RangeError if the strings have different lengths measured in Unicode code points.
- hammingDistance must compare Unicode code points (not UTF-16 code units) so combining characters and astral symbols are treated correctly per code point semantics.
- hammingDistanceBits accepts two non-negative integers and returns the number of differing bits. Input validation must throw TypeError for non-integers and RangeError for negative values.
- Both functions must be exported as named exports from src/lib/main.js and be documented in README.md.
- Unit tests must be placed in tests/unit/ covering normal, edge, and error cases, including empty strings, zero values, large integers, and Unicode code point cases.

Validation and testing

- All behaviors must be verified by unit tests that assert return values and thrown error types. Tests must pass under the existing test script.
- README must include API documentation and usage examples that show expected results for representative inputs.

Acceptance criteria

- hammingDistance("karolin", "kathrin") returns 3.
- hammingDistance("", "") returns 0.
- hammingDistance where string lengths differ throws RangeError.
- hammingDistance handles Unicode code points: comparing strings that contain astral code points or composed characters is done per code point, not per UTF-16 code unit.
- hammingDistanceBits(1, 4) returns 2.
- hammingDistanceBits(0, 0) returns 0.
- hammingDistanceBits throws TypeError for non-integer inputs and RangeError for negative integers.
- Both functions are named exports from src/lib/main.js and are documented in README.md.
- Unit tests cover normal, edge, and error cases and all tests pass.

Notes

This feature is the repository's primary feature and must be implemented with minimal external dependencies and with clear, small functions that are easy to test and reason about.