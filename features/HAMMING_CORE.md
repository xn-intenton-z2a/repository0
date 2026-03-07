# HAMMING_CORE

Summary

Implement and document the library's core Hamming distance functions: named exports hammingDistance and hammingDistanceBits in src/lib/main.js. The functions must be small, pure, and correct: Unicode-aware code point comparison for strings and correct bitwise comparison for Numbers and BigInts with strict input validation.

Motivation

Deliver the single-responsibility core of this repository: reliable Hamming distance computations that other features and users can depend on (CLI, batch helpers, BigInt support). The implementation must be suitable for unit testing and easy to reuse.

Specification

API

- hammingDistance(a, b)
  - Parameters: a (string), b (string)
  - Returns: number (non-negative integer)
  - Behavior:
    - Use Unicode code points for comparison (use Array.from or equivalent) so that astral symbols are treated as single positions.
    - If either argument is not a string, throw TypeError with a descriptive message.
    - If the two strings have different code-point lengths, throw RangeError with a descriptive message.
    - Otherwise return the count of positions where corresponding code points differ.

- hammingDistanceBits(x, y)
  - Parameters: x (Number|BigInt), y (Number|BigInt)
  - Returns: number (non-negative integer)
  - Behavior:
    - Accept Number or BigInt. If either operand is BigInt, perform comparison in BigInt space to avoid precision loss (coerce Number to BigInt safely).
    - Throw TypeError when an argument is not a Number or BigInt.
    - Throw RangeError when either numeric argument is negative.
    - Compute differing bits using x ^ y and count set bits efficiently; use BigInt-aware bit operations when needed. Return the bit-difference count as a Number.

Validation and Errors

- Use precise exception types: TypeError for invalid types, RangeError for invalid ranges (unequal string lengths or negative integers).
- Error messages should be short and actionable (e.g., "hammingDistance: inputs must be strings", "hammingDistanceBits: negative value not allowed").

Implementation Notes

- Keep implementations pure and free of side effects so they can be used in other modules and in tests.
- For Unicode string handling, use Array.from to obtain code points. Avoid operating on UTF-16 code units.
- For Numbers, use safe bitwise operations when both operands fit into 32-bit unsigned space; otherwise, coerce to BigInt and use BigInt operations to compute x ^ y and count set bits.
- Convert the final bit count to a JavaScript Number (it will be small for test cases and practical inputs).
- Do not add external runtime dependencies.

Tests

- Add or update tests in tests/unit/main.test.js to cover:
  - Basic string case: hammingDistance("karolin", "kathrin") => 3
  - Empty strings: hammingDistance("", "") => 0
  - Unequal-length strings: hammingDistance("a", "bb") throws RangeError
  - Unicode astral characters: hammingDistance("𝌆a", "𝌇a") correct counting (astral code points count as single positions)
  - Basic bit case: hammingDistanceBits(1, 4) => 2
  - Zeros: hammingDistanceBits(0, 0) => 0
  - BigInt values: hammingDistanceBits(1n, 4n) => 2 and large BigInt differences
  - Negative numbers/BigInts: hammingDistanceBits(-1, 1) throws RangeError
  - Type errors: passing non-string to hammingDistance or non-number/BigInt to hammingDistanceBits throws TypeError

Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits(1n, 4n) returns 2
- Both functions are exported as named exports from src/lib/main.js
- Unit tests are present in tests/unit/main.test.js and pass with npm test

Examples

- hammingDistance("abc", "abd") => 1
- hammingDistance("𝌆a", "𝌆b") => 1 (astral character treated correctly)
- hammingDistanceBits(3, 5) => 2
- hammingDistanceBits(9007199254740993n, 9007199254740995n) returns the correct bit difference

Compatibility and Scope

- Implementation fits entirely within src/lib/main.js and unit tests. This feature is intentionally limited to core computation and validation; CLI, batch, and BigInt-specific documentation live in their respective feature specs and will reuse these functions.
- Follow CONTRIBUTING.md for concise changes, tests first, and minimal diffs.
