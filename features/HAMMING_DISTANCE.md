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
- Description: Compute the number of differing bits between two inputs. Supported input combinations fall into three modes:
  a) Integer mode: both x and y are Number or BigInt representing non-negative integers. Mixed Number/BigInt calls are allowed; Numbers are coerced to BigInt when either operand is BigInt.
  b) Buffer mode: both x and y are Buffer, Uint8Array, or ArrayBuffer. In this mode the function computes per-byte XOR and sums per-byte popcounts.
  c) Fixed-width integer arrays may be represented as Uint8Array/ArrayBuffer and are handled by buffer mode.
- Returns: number — count of bit positions that differ across the operands.
- Validation and errors:
  - If types do not match one of the supported modes, throw TypeError describing the supported signatures (Number/BigInt or Buffer/Uint8Array/ArrayBuffer).
  - Integer mode:
    - Accept Number or BigInt. If either operand is a Number and Number.isSafeInteger(value) is false, throw RangeError suggesting use of BigInt for large integers.
    - After coercion, if either integer is negative, throw RangeError.
  - Buffer mode:
    - Accept Buffer, Uint8Array, or ArrayBuffer. Convert ArrayBuffer to Uint8Array view when necessary.
    - If the two buffers have different byte lengths, throw RangeError.
- Behavior examples:
  - hammingDistanceBits(1, 4) returns 2 (binary: 001 vs 100)
  - hammingDistanceBits(1n, 4n) returns 2
  - hammingDistanceBits(0, 0) returns 0
  - hammingDistanceBits(new Uint8Array([0b10100000]), new Uint8Array([0b00100001])) returns 3
- Implementation notes:
  - Integer mode:
    - Prefer Number-based bit operations when both operands are Numbers within safe integer range for performance.
    - If BigInt is involved (or Numbers coerced due to size), use BigInt XOR and count set bits with an adapted Brian Kernighan algorithm for BigInt: while (xor !== 0n) { xor &= xor - 1n; count++; }.
  - Buffer mode:
    - Iterate bytes, compute byteXor = byteA ^ byteB, and use a small constant-time popcount table or Brian Kernighan on Numbers (0-255) to sum differing bits.
  - Keep code paths separate to preserve performance for common Number-based use cases, while providing correct behavior for BigInt and buffer inputs.

Exports

- Export both functions as named exports from src/lib/main.js so other modules can import { hammingDistance, hammingDistanceBits } from the library.

# Tests and Examples

Unit tests must be comprehensive and live under tests/unit/ per repository conventions. Tests should cover:

- String cases:
  - Typical ASCII strings and multi-codepoint characters (emoji, combining accents)
  - Normalization examples where equivalent sequences compare equal (e.g., e + combining accent vs precomposed é)
  - Unequal-length strings raising RangeError and wrong types raising TypeError
- Integer cases:
  - Number-based examples including 1 vs 4, 0 vs 0, large safe integers
  - BigInt examples and mixed Number/BigInt combinations
  - Negative integers and non-integer numbers should raise RangeError/TypeError as appropriate
  - Numbers greater than Number.MAX_SAFE_INTEGER should throw RangeError unless caller uses BigInt
- Buffer cases:
  - Equal-length buffers with expected differing bit counts
  - Different-length buffers should raise RangeError
  - Accept Buffer, Uint8Array and ArrayBuffer

Provide README examples showing usage, NFC-normalization note, BigInt guidance, and buffer-based examples.

# Acceptance Criteria

The feature is complete when the following are satisfied and testable:

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistance("e\u0301", "é") returns 0 (normalization)
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(1n, 4n) returns 2
- hammingDistanceBits(1, 4n) returns 2 (mixed coercion)
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits(new Uint8Array([1,2,3]), new Uint8Array([1,2,3])) returns 0
- Passing Number > Number.MAX_SAFE_INTEGER without BigInt throws RangeError
- Negative inputs throw RangeError
- Non-numeric/non-buffer inputs throw TypeError
- Both functions are exported as named exports from src/lib/main.js
- All unit tests pass

# Implementation notes and constraints

- Implementation fits entirely in src/lib/main.js and tests in tests/unit/. Do not add new runtime dependencies.
- Keep code clear and minimal; prefer branching on input types and implementing small, well-tested helpers for popcount and buffer handling.
- Update README.md with usage examples and API documentation reflecting normalization and BigInt/buffer support.
