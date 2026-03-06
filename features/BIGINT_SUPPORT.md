# BIGINT_SUPPORT

# Overview

Add explicit BigInt support to hammingDistanceBits so the library can accurately compute bitwise Hamming distances for integers beyond Number.MAX_SAFE_INTEGER. This feature keeps the API backwards compatible, accepts Number or BigInt inputs, and uses efficient BigInt bit operations for correctness and performance.

# Specification

- Name: BIGINT_SUPPORT
- Goal: Enable hammingDistanceBits to accept and correctly compute Hamming distances when either or both operands are BigInt values, while preserving current behavior for Number inputs.
- Scope: Single-file change to src/lib/main.js plus unit tests in tests/unit/ to validate BigInt behavior and mixed-type handling. README should document limits and migration notes.

# API Changes

- hammingDistanceBits(x, y)
  - Accepts x and y as either Number or BigInt.
  - If both are Numbers, previous behavior is retained (Numbers must be safe integers).
  - If either is BigInt, both values are treated as BigInt and computation uses BigInt XOR and BigInt popcount.

# Validation and Errors

- If x or y is neither a Number nor a BigInt, throw TypeError.
- If a Number is provided but not a safe integer (Number.isSafeInteger returns false), throw RangeError instructing to use BigInt for larger integers.
- If either value (after coercion) is negative, throw RangeError.
- Preserve existing TypeError and RangeError messages shape so tests remain clear.

# Behavior Examples

- hammingDistanceBits(1n, 4n) returns 2
- hammingDistanceBits(1, 4n) returns 2 (mixed Number and BigInt coerced to BigInt)
- hammingDistanceBits(0n, 0n) returns 0
- hammingDistanceBits(9007199254740992n, 9007199254740993n) returns 1

# Tests and Acceptance Criteria

Add unit tests covering the following acceptance criteria:

- hammingDistanceBits(1n, 4n) returns 2
- hammingDistanceBits(1, 4n) returns 2
- hammingDistanceBits(0n, 0n) returns 0
- hammingDistanceBits(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) returns 0
- Passing a Number greater than MAX_SAFE_INTEGER should throw RangeError and suggest BigInt
- Passing a negative BigInt or negative Number should throw RangeError
- Passing non-integer types (strings, objects, floats) should throw TypeError

# Implementation Notes

- Implementation fits entirely in src/lib/main.js. When BigInt support is required, coerce Number to BigInt with BigInt(number) and compute xor = x ^ y using BigInt operators.
- Count set bits using Brian Kernighan algorithm adapted for BigInt: while (xor !== 0n) { xor &= xor - 1n; count++; }.
- Keep Number-based path unchanged for performance when neither argument is BigInt.

# Migration Notes

- Consumers using integers larger than Number.MAX_SAFE_INTEGER should switch to BigInt to avoid RangeError; mixed Number/BigInt calls are supported and will coerce Number to BigInt.

# Acceptance Criteria (checkable)

- hammingDistanceBits(1n, 4n) returns 2
- hammingDistanceBits(1, 4n) returns 2
- hammingDistanceBits(0n, 0n) returns 0
- Passing Number > Number.MAX_SAFE_INTEGER throws RangeError
- Negative inputs throw RangeError
- Non-numeric inputs throw TypeError

# Notes

This feature is distinct from the base HAMMING_DISTANCE feature by explicitly codifying BigInt handling and error semantics; it is implementable within the existing single source file and test suite.
