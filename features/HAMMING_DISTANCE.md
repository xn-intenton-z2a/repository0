# HAMMING_DISTANCE

Status: IMPLEMENTED — core library functions are exported from src/lib/main.js and verified by unit tests.

Purpose
Provide the canonical Hamming distance API for two complementary use cases:
- Unicode-aware equal-length string comparison (compare code points, not UTF-16 code units)
- Bit-level integer comparison (supporting Number integers and BigInt values)

Scope
- Public named exports in src/lib/main.js:
  - hammingDistanceString(a, b)
  - hammingDistanceInt(a, b)
- Implementations must validate inputs and throw appropriate errors for incorrect usage.
- This feature covers behavior used by the CLI, examples, web demo, and unit tests.

API
- hammingDistanceString(a, b)
  - Description: Compute the Hamming distance between two strings of equal length by comparing Unicode code points.
  - Inputs: two strings
  - Output: non-negative integer (count of differing code-point positions)
  - Errors:
    - TypeError if either argument is not a string
    - RangeError if the strings differ in code-point length

- hammingDistanceInt(a, b)
  - Description: Compute the bit-level Hamming distance by XORing inputs and counting set bits.
  - Inputs: two non-negative integers; accepts Number (integer) and BigInt; mixing Number and BigInt is supported.
  - Output: non-negative integer (count of differing bits)
  - Errors:
    - TypeError for non-integer Number or unsupported types
    - RangeError for negative values

Edge cases
- Empty strings: both empty => 0
- Zero integers: 0 vs 0 => 0
- Unicode: multi-code-unit characters (emoji, combined glyphs) are compared by code point
- Large integers: BigInt is used internally to support values beyond Number.MAX_SAFE_INTEGER

Testing
- Unit tests exist in tests/unit/hamming.test.js and must assert normal cases, edge cases, and error cases.

Acceptance Criteria (testable)
- Hamming distance between "karolin" and "kathrin" is 3
- Hamming distance between "" and "" is 0
- Hamming distance between strings of different lengths throws RangeError
- Bit-level Hamming distance between 1 and 4 is 2
- Bit-level Hamming distance between 0 and 0 is 0
- Bit-level Hamming distance between 1n and 4n is 2
- Mixing Number and BigInt yields the same numeric count (e.g., 3 and 3n => 0)
- All public API is exported as named exports from src/lib/main.js
- README contains usage examples for hammingDistanceString and hammingDistanceInt (including BigInt examples)

Notes
- This file consolidates BigInt behaviour and integer/Unicode guidance so other feature files do not duplicate the same acceptance criteria.
