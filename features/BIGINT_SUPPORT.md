# BIGINT_SUPPORT

# Overview

Add and formalize explicit BigInt support and clear integer coercion rules for the repository's hammingDistanceBits API so callers can compute bitwise Hamming distances for arbitrarily large non-negative integers safely and predictably. This feature documents calling conventions, validation rules, and examples, and requires tests and README examples demonstrating BigInt and mixed-type usage.

# Specification

Purpose
- Ensure hammingDistanceBits accepts and correctly processes BigInt inputs alongside Number and byte-sequence inputs.
- Define coercion and error rules when mixing Number and BigInt inputs, and when Number inputs exceed safe integer limits.
- Provide tests and README examples covering BigInt, mixed-type, and byte-sequence scenarios.

API behavior
- Signature: hammingDistanceBits(x, y) -> number
- Supported input types:
  - BigInt: arbitrary non-negative integer values; preferred for very large integers.
  - Number: integer Numbers which must be non-negative and safe integers (Number.isSafeInteger).
  - Byte-sequence: Uint8Array, ArrayBuffer, or Buffer of equal length.
- Coercion rules:
  - If either x or y is a BigInt, coerce the other to BigInt where possible: safe Number values are converted to BigInt automatically.
  - If a Number is provided that is not a safe integer (Number.isSafeInteger returns false), throw RangeError and require the caller to pass a BigInt instead.
  - Byte-sequence inputs are not coerced to integers; they must be both byte sequences and of equal length.

Validation and errors
- TypeError: when inputs are not one of the supported types (BigInt, Number, Uint8Array/ArrayBuffer/Buffer).
- RangeError: when any numeric input is negative, when Numbers are unsafe and not coercible, or when byte-sequence lengths differ.
- Behavior must be deterministic and explicit: do not silently truncate or accept unsafe Numbers.

Algorithm and performance notes
- BigInt path: use repeated v &= v - 1n (Kernighan) on the XOR result to count set bits; loop until zero to count differing bits.
- Number path: when both operands are Numbers and safe integers, use fast 32/53-bit chunking or convert to Uint8Array and use a popcount table for bytes; ensure correctness up to Number.MAX_SAFE_INTEGER.
- Byte-sequence path: XOR each byte pair and sum popcount results using a small precomputed 256-entry table.
- Always return a JavaScript Number representing the count of differing bits.

Examples
- hammingDistanceBits(1, 4) -> 2
- hammingDistanceBits(1n, 4n) -> 2
- hammingDistanceBits(1, 4n) -> 2 (Number coerced to BigInt)
- hammingDistanceBits(9007199254740993, 9007199254740994) throws RangeError (Number unsafe; use BigInt)
- hammingDistanceBits(9007199254740993n, 9007199254740994n) -> valid result
- hammingDistanceBits(new Uint8Array([1]), new Uint8Array([4])) -> 2

Acceptance criteria
- hammingDistanceBits accepts BigInt inputs and returns correct bit-difference counts for large integers beyond Number.MAX_SAFE_INTEGER.
- Passing an unsafe Number (beyond safe integer range) throws RangeError with a clear message advising to use BigInt.
- Mixing BigInt and safe Number works by coercing Number to BigInt and returning the correct result.
- Byte-sequence behavior is unchanged and still throws RangeError for unequal lengths.
- Unit tests cover BigInt-only, mixed BigInt/Number, unsafe Number rejection, and byte-sequence scenarios.

Tests and files to update
- Update or add tests/unit/main.test.js to include cases:
  - BigInt inputs (large values beyond Number.MAX_SAFE_INTEGER)
  - Mixed BigInt and safe Number
  - Unsafe Number inputs causing RangeError
  - Byte-sequence comparisons unchanged
- Update README.md to document BigInt usage and mixed-type rules with short examples.

Implementation notes
- Make the minimal implementation changes in src/lib/main.js: add BigInt coercion logic, explicit unsafe Number checks, and reuse existing byte-sequence handling code path.
- Keep external dependencies nil; use only built-in JavaScript and Node APIs.
- Use clear, actionable error messages (TypeError for types, RangeError for domain violations) matching the repository's existing conventions.

Compatibility with mission
- Directly advances the mission by enabling accurate bitwise Hamming computations on arbitrarily large integers while preserving Unicode-safe string behavior and existing byte-sequence semantics.

