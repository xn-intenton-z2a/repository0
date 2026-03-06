# BIGINT_SUPPORT

Summary

Extend hammingDistanceBits to accept BigInt inputs so callers can compute Hamming distances for integers larger than JavaScript Number.MAX_SAFE_INTEGER. This feature complements HAMMING_CORE and enables practical usage on large integer identifiers.

Motivation

Some users compare large numeric identifiers, hashes, or bitmasks that exceed safe integer range; supporting BigInt broadens applicability and prevents incorrect results or lossy conversions.

Specification

- hammingDistanceBits should accept Number or BigInt for each argument.
- When both inputs are Numbers, existing behavior is unchanged.
- If either input is a BigInt, both operands are coerced to BigInt for the bitwise comparison path.
- Type validation:
  - Throw TypeError if an argument is neither a Number nor a BigInt.
  - Throw RangeError for negative numbers (both Number and BigInt).
- Implementation details:
  - Use an algorithm that iterates over bits using BigInt-aware operations (e.g., x ^ y and x & -x patterns adapted for BigInt) to count set bits.
  - Ensure performance remains reasonable for typical sizes used in tests and examples.

Tests

- Add tests for BigInt inputs: hammingDistanceBits(1n, 4n) => 2, hammingDistanceBits(0n, 0n) => 0.
- Test large values near and above Number.MAX_SAFE_INTEGER to ensure correctness.
- Reuse existing edge case and error tests from HAMMING_CORE.

Acceptance Criteria

- hammingDistanceBits(1n, 4n) returns 2
- hammingDistanceBits(9007199254740993n, 9007199254740995n) returns correct bit differences
- Negative BigInt inputs throw RangeError
- Tests covering BigInt cases are added and pass with npm test

Notes

- This feature maintains backward compatibility with Number inputs.
- Document BigInt support in README examples and API docs (README.md update in the same iteration).
