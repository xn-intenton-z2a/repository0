# HAMMING_DISTANCE

# Overview

Provide a concise, high-impact feature that implements the core Hamming distance functions required by the library mission. The feature defines two named exports, hammingDistance and hammingDistanceBits, with strict input validation, Unicode-safe string comparison (code points, not UTF-16 code units), and fast bit-distance computation for non-negative integers.

# Specification

Functions

1. hammingDistance(a, b)

- Description: Compute the Hamming distance between two strings of equal length measured in Unicode code points.
- Parameters:
  - a: string — first input string
  - b: string — second input string
- Returns: number — count of positions where the code points differ
- Validation and errors:
  - If either a or b is not a string, throw TypeError with a clear message.
  - Compare strings by Unicode code points (for-of or Array.from) not by UTF-16 code units.
  - If the two strings do not have the same number of code points, throw RangeError.
- Behavior examples:
  - hammingDistance("karolin", "kathrin") returns 3
  - hammingDistance("", "") returns 0
- Implementation notes:
  - Iterate code points using for-of or Array.from to ensure correct Unicode handling.
  - Use a single pass comparison and avoid building large intermediate arrays when possible.

2. hammingDistanceBits(x, y)

- Description: Compute the number of differing bits between two non-negative integers.
- Parameters:
  - x: integer (Number) — non-negative integer
  - y: integer (Number) — non-negative integer
- Returns: number — count of bit positions that differ
- Validation and errors:
  - If either x or y is not a Number or not an integer, throw TypeError.
  - If either is negative, throw RangeError.
  - For safety, validate integers are within Number.isSafeInteger range; if values exceed safe integer bounds, the implementation may accept BigInt optionally or throw RangeError — define chosen behavior in tests and README.
- Behavior examples:
  - hammingDistanceBits(1, 4) returns 2 (binary: 001 vs 100)
  - hammingDistanceBits(0, 0) returns 0
- Implementation notes:
  - Use XOR (x ^ y) to get differing bits and Brian Kernighan's algorithm or builtin popcount (if available) to count set bits efficiently.
  - Prefer Number-based implementation to keep the code simple; document limits related to Number.MAX_SAFE_INTEGER in README.

Exports

- Export both functions as named exports from src/lib/main.js so other modules can import { hammingDistance, hammingDistanceBits } from the library.

# Tests and Examples

Unit tests must be comprehensive and live under tests/unit/ as per repository conventions. Tests should cover:

- Normal cases: typical short strings, typical integers
- Edge cases: empty strings, zero, maximum safe integers, strings with multi-code-point characters (emoji, accented characters), very long strings
- Error cases: wrong types (objects, null, undefined, arrays, floats for integer functions), unequal-length strings, negative integers, non-integer numbers for hammingDistanceBits

Provide README examples showing basic usage and documenting Unicode handling and integer limits.

# Acceptance Criteria

The feature is complete when the following are satisfied and testable:

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- The library exports both functions as named exports from src/lib/main.js
- All new unit tests covering normal, edge and error cases are present and pass
- README contains usage examples and documents Unicode code point comparison and integer limits

# Implementation notes and constraints

- Keep the implementation contained to src/lib/main.js and tests in tests/unit/. Do not add new top-level dependencies.
- Prefer simple, well-documented code that meets validation and Unicode requirements.
- If Small follow-ups are needed (BigInt support or performance micro-optimizations), add them as separate incremental features later.
