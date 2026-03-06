# HAMMING_DISTANCE

# Overview

Authoritative feature specification for the repository's Hamming distance utilities. Provides two named exports: hammingDistance and hammingDistanceBits. The emphasis is correctness, Unicode-safe handling, explicit validation, and predictable behavior for large integers and byte-sequences.

# Goals

- Provide a Unicode-correct Hamming distance for strings (compare code points, normalize with NFC).
- Provide a bitwise Hamming distance for integers and byte sequences with explicit BigInt support and coercion rules.
- Enforce clear, actionable validation errors (TypeError, RangeError).
- Include precise acceptance criteria and tests suitable for automated verification.

# API

1) hammingDistance(a, b)

- Signature: hammingDistance(a: string, b: string) -> number
- Description: Count differing positions between two strings of identical length measured in Unicode code points after normalizing both inputs to NFC.
- Behavior:
  - Both parameters must be strings; otherwise throw TypeError.
  - Normalize inputs with String.prototype.normalize('NFC').
  - Compare sequences of Unicode code points (use an iterator or Array.from on the normalized string) so surrogate pairs and combined characters are treated correctly.
  - If code point counts differ, throw RangeError.
  - Return a non-negative integer equal to the number of code-point positions where the two inputs differ.

2) hammingDistanceBits(x, y)

- Signature: hammingDistanceBits(x, y) -> number
- Description: Count differing bits between two non-negative integers or between two equal-length byte sequences.
- Supported inputs and coercion rules:
  - Number: must be an integer, non-negative, and Number.isSafeInteger must be true. Two Number inputs follow the fast Number path.
  - BigInt: any non-negative BigInt is accepted. If one operand is BigInt and the other is Number, the Number is coerced to BigInt only if it is a safe integer. If the Number is unsafe, throw RangeError and require BigInt.
  - Byte sequences: Uint8Array, ArrayBuffer, or Buffer (Node) are supported. Both inputs must be byte sequences of equal length. Byte sequences are not coerced to integers.
- Validation and errors:
  - TypeError: if inputs are not among supported types (string for hammingDistance; Number/BigInt/byte-sequence for hammingDistanceBits).
  - RangeError: for unequal-length strings (by code points), unequal-length byte sequences, negative numeric inputs, or unsafe Number values where BigInt is required.
- Return: always a finite JavaScript Number representing the count of differing bits.

# Validation Examples (contract)

- hammingDistance('karolin', 'kathrin') -> 3
- hammingDistance('', '') -> 0
- hammingDistance('a', 'bb') -> throws RangeError (code point length mismatch)
- hammingDistance('e\u0301', 'é') -> 0 (NFC-normalized equality)

- hammingDistanceBits(1, 4) -> 2
- hammingDistanceBits(1n, 4n) -> 2
- hammingDistanceBits(1, 4n) -> 2 (safe Number coerced to BigInt)
- hammingDistanceBits(0, 0) -> 0
- hammingDistanceBits(new Uint8Array([1]), new Uint8Array([4])) -> 2
- Passing Number > Number.MAX_SAFE_INTEGER -> throws RangeError (use BigInt)

# Implementation Notes

- hammingDistance: iterate code points via for-of or Array.from(normalizedString) to avoid UTF-16 unit issues; perform a single pass and count mismatches without allocating large arrays where possible.
- hammingDistanceBits:
  - Byte-sequence path: iterate bytes, XOR each pair, and sum popcount using a 256-entry lookup table for performance.
  - Number path: when both operands are Numbers, process in 32-bit chunks or convert to byte arrays and use the same popcount lookup for correctness up to Number.MAX_SAFE_INTEGER.
  - BigInt path: compute xorResult = BigInt(x) ^ BigInt(y) and use Kernighan's algorithm with BigInt: while (xorResult !== 0n) { xorResult &= xorResult - 1n; count++; }.
  - Always return a Number (safe JS integer) for the popcount result. For extremely large BigInt inputs where the differing bit count exceeds Number.MAX_SAFE_INTEGER, the function should still return a Number but callers are expected to avoid such cases; throw RangeError if result cannot be represented as a safe Number (implementation preference: this library will assume inputs produce counts representable as safe Number).

# Tests and Acceptance Criteria

Each acceptance criterion below should have a corresponding unit test in tests/unit/main.test.js.

Acceptance criteria:
- hammingDistance('karolin', 'kathrin') returns 3
- hammingDistance('', '') returns 0
- hammingDistance('a', 'bb') throws RangeError
- hammingDistance('e\u0301', 'é') returns 0 after NFC normalization
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits(1n, 4n) returns 2
- hammingDistanceBits(1, 4n) returns 2 (Number coerced to BigInt)
- hammingDistanceBits(new Uint8Array([1]), new Uint8Array([4])) returns 2
- Passing an unsafe Number (> Number.MAX_SAFE_INTEGER) into hammingDistanceBits without using BigInt throws RangeError
- Negative numeric inputs (Number < 0 or negative BigInt) throw RangeError

Test guidance:
- Cover normal cases, edge cases (empty strings, zero, single-character, large integers), and error cases (type errors, range errors).
- Use Node Buffer only in Node-specific tests; prefer Uint8Array in portable tests.
- Ensure Unicode tests include composed and decomposed forms to verify NFC normalization.

# Compatibility and Scope

This feature is aligned with MISSION.md and is implementable entirely within src/lib/main.js along with unit tests and README examples. The feature does not introduce external dependencies and aims for deterministic, well-documented behavior.
