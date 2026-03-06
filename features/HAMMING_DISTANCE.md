# HAMMING_DISTANCE

# Overview

Canonical specification for the library's Hamming distance utilities. This feature defines two named exports, hammingDistance and hammingDistanceBits, with strict input validation, Unicode-safe string comparison (by code points and NFC-normalized), and flexible bit-distance computation supporting Numbers, BigInts and byte-sequence buffers. The goal is a single authoritative feature that covers typical string use, integer-based bit comparison, and byte-buffer comparisons used for binary data.

# Specification

Functions

1. hammingDistance(a, b)

- Signature: hammingDistance(a: string, b: string) -> number
- Description: Compute the Hamming distance between two strings of equal length measured in Unicode code points after normalizing both inputs to Unicode Normalization Form C (NFC).
- Parameters:
  - a: string — first input string
  - b: string — second input string
- Returns: number — count of positions where the code points differ
- Validation and errors:
  - If either a or b is not a string, throw TypeError with a clear message describing the expected types.
  - Normalize both strings using String.prototype.normalize('NFC') before comparison.
  - Compare strings by Unicode code points (use Array.from or for-of over the normalized string) rather than UTF-16 code units.
  - If the two strings do not have the same number of code points, throw RangeError.
- Behavior examples:
  - hammingDistance("karolin", "kathrin") returns 3
  - hammingDistance("", "") returns 0
  - hammingDistance('e\u0301', 'é') returns 0 (combining sequence equals precomposed character after NFC)
- Implementation notes:
  - Iterate code points using for-of or Array.from(normalized) to ensure correct Unicode handling.
  - Use a single pass comparison and avoid building large intermediate arrays when possible; for clarity tests may use Array.from.

2. hammingDistanceBits(x, y)

- Signature: hammingDistanceBits(x, y) -> number
- Description: Compute the number of differing bits between two non-negative integer values or between two equal-length byte sequences.

- Supported input types and coercion rules:
  - Numbers (JavaScript Number): must be integers, non-negative, and safe integers (Number.isSafeInteger). Two Number inputs take the fast Number path which uses 32-bit chunk operations for performance while remaining correct up to Number.MAX_SAFE_INTEGER.
  - BigInt: supports arbitrary non-negative integers beyond Number.MAX_SAFE_INTEGER. When either input is a BigInt, the other may be a Number — if the Number is a safe integer it will be coerced to BigInt; if the Number is unsafe a RangeError is thrown and the caller should use BigInt values explicitly.
  - Byte sequences (Uint8Array or ArrayBuffer): legacy behavior preserved — compare byte-by-byte and count differing bits using a popcount table. Buffer instances (Node) are supported via the Uint8Array subtype handling.

- Validation and errors:
  - Non-numeric, non-byte-sequence inputs throw TypeError.
  - Negative values (Number < 0 or any negative BigInt) throw RangeError.
  - Number values greater than Number.MAX_SAFE_INTEGER (unsafe) must be passed as BigInt; attempting to pass an unsafe Number throws RangeError.
  - For byte-sequence inputs, lengths must match or a RangeError is thrown.

- Return value:
  - Always returns a finite Number (JavaScript Number) representing the count of differing bits.

- Examples:
  - hammingDistanceBits(1, 4) -> 2
  - hammingDistanceBits(1n, 4n) -> 2
  - hammingDistanceBits(1, 4n) -> 2 (Number coerced to BigInt)
  - hammingDistanceBits(0n, 0n) -> 0
  - hammingDistanceBits(new Uint8Array([0b00000001]), new Uint8Array([0b00000100])) -> 2

- Implementation notes:
  - Fast Number path splits 64-bit Number range into 32-bit chunks and uses a precomputed POPCOUNT table for bytes to avoid performance regressions.
  - BigInt path uses Kernighan's algorithm adapted for BigInt: while (v !== 0n) { v &= v - 1n; count++; }
  - The API intentionally enforces explicitness around unsafe Numbers to avoid silent precision bugs — prefer BigInt for very large integers.
