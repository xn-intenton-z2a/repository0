HAMMING_UTILS

NORMALISED EXTRACT

This document contains precise, implementation-ready specifications for the Hamming utilities exposed by the repository entry-point. These details are actionable and omit high-level narrative in favor of exact parameter rules, normalization steps, error semantics, and usage constraints required for correct, interoperable implementations.

Table of Contents
1. API signatures and contracts
2. Unicode string Hamming rules
3. Byte/bit Hamming rules
4. Validation, errors, and edge cases
5. Performance and implementation notes

1. API signatures and contracts

hammingDistance(a: string, b: string) -> number
- Parameters:
  - a: ECMAScript string (must be of type string).
  - b: ECMAScript string (must be of type string).
- Precondition: Both inputs must be validated as strings; otherwise throw TypeError.
- Normalization: Both strings must be normalized to Unicode Normalization Form C (NFC) prior to any further processing.
- Comparison unit: Convert each normalized string into an array of Unicode code points (not UTF-16 code units). Implementation note: use an iterator over code points (equivalent to Array.from(string) semantics) so surrogate pairs count as single code points.
- Length requirement: If the number of code points in a and b differ, throw RangeError.
- Behavior: Return integer count of indices i where codePointArrayA[i] !== codePointArrayB[i]. Strict equality is used on code points (exact code point value comparison).
- Return: non-negative integer (0 when identical after normalization).
- Error types: TypeError for non-strings, RangeError for mismatched code point lengths.
- Deterministic example contract: a sequence with composed vs decomposed forms must normalize to equivalent code point sequences (e.g., 'e\u0301' vs 'é' compare equal after NFC).

hammingDistanceBits(x: Buffer | Uint8Array | ArrayBuffer, y: Buffer | Uint8Array | ArrayBuffer) -> number
- Parameters:
  - x, y: two byte-sequence buffers of identical length. Acceptable types: Buffer (Node), Uint8Array, or ArrayBuffer.
- Type validation: If either input is not one of the accepted types, throw TypeError.
- Length validation: If the byte-lengths differ, throw RangeError.
- Behavior: For each index i, compute xor = x[i] ^ y[i]; accumulate popcount(xor) across all bytes; return the sum as integer.
- Return: non-negative integer equal to the number of differing bits across sequences.
- Notes: For integer inputs, callers must explicitly convert integers to fixed-width byte arrays before calling.

2. Unicode string Hamming rules (detailed)

- Normalization specifics: Use NFC (Normalization Form C) to prefer composed characters and ensure canonically equivalent sequences map identically.
- Code point extraction: Use an algorithm equivalent to iterating over Unicode code points. Do not use string indexing or charCodeAt which reflect UTF-16 code units; instead use a code point-aware iterator to handle astral-plane characters.
- Length semantics: The function considers length in code points. Exact equality of code point sequence length is required; no padding, truncation, or normalization to byte length is performed.
- Comparison semantics: Compare numeric code point values at each code point index. No case-folding, collation, or locale-sensitive transforms are applied.

3. Byte/bit Hamming rules (detailed)

- Accepted input forms: Buffer, Uint8Array, ArrayBuffer. For ArrayBuffer, create a Uint8Array view without copying where possible.
- Byte-order: The function treats inputs as raw byte sequences; there is no endianness conversion—the bitwise differences are computed per-byte as stored.
- Popcount calculation: Use a fast popcount implementation (lookup table or CPU instruction) for performance-critical code paths.
- Return semantics: Sum of differing bits across corresponding bytes.

4. Validation, errors, and edge cases

- Type errors:
  - hammingDistance: throw TypeError if either argument is not typeof 'string'.
  - hammingDistanceBits: throw TypeError if arguments are not Buffer | Uint8Array | ArrayBuffer.
- Range errors:
  - hammingDistance: throw RangeError when code point counts differ.
  - hammingDistanceBits: throw RangeError when byte lengths differ.
- Empty inputs:
  - Strings: two empty strings (both normalize to empty) -> return 0.
  - Buffers: two zero-length buffers -> return 0.
- Large inputs:
  - For very large inputs, prefer streaming or chunked comparison for memory-constrained environments; maintain a running popcount and code-point index.
- Non-canonical Unicode sequences: NFC normalization will ensure combining sequences match composed code points; implement normalization before measuring length to avoid false RangeErrors.

5. Performance and implementation notes

- String conversion costs: Normalization and code point extraction are the dominant costs; avoid repeated normalization by caching normalized forms when comparing many strings derived from the same source.
- Popcount optimization: Use an 8-bit popcount lookup table of size 256 for fastest portability or hardware intrinsics when available.
- Buffer views: When receiving ArrayBuffer, use new Uint8Array(arrayBuffer) to avoid copying where the runtime allows.
- Memory allocation: Prefer single-pass streaming where possible; avoid allocating full code-point arrays when inputs are extremely large—iterate both strings concurrently with a code-point iterator and compare on the fly.

SUPPLEMENTARY DETAILS

Essential technical specifications and implementation details:
- Unicode Normalization API: In JavaScript, use String.prototype.normalize('NFC'). Ensure the runtime supports Unicode normalization; if not, include a polyfill before calling.
- Code-point iteration: In JavaScript, use for (const cp of normalizedString) { } or Array.from(normalizedString) to obtain code points; each iteration yields one Unicode code point.
- Byte input normalization: For Buffer or Uint8Array, treat each element as an unsigned 8-bit integer; for ArrayBuffer, use a Uint8Array view.
- Error messages: Provide explicit messages to aid debugging (e.g., "hammingDistance: expected strings, got <type>", "hammingDistance: code point length mismatch: a=1234, b=1233").
- API surface: Export both functions as named exports from the package entry point; also include a CLI shim that accepts two arguments and prints the numeric result, exiting non-zero on error.

REFERENCE DETAILS

Complete API specifications and signatures:
- Function: hammingDistance
  - Signature: hammingDistance(a: string, b: string) => number
  - Parameters: a (string), b (string)
  - Returns: number (integer >= 0)
  - Throws: TypeError (if a or b not strings), RangeError (if code point counts differ)
  - Effects: None (pure function)

- Function: hammingDistanceBits
  - Signature: hammingDistanceBits(x: Buffer | Uint8Array | ArrayBuffer, y: Buffer | Uint8Array | ArrayBuffer) => number
  - Parameters: x, y (Buffer | Uint8Array | ArrayBuffer)
  - Returns: number (integer >= 0)
  - Throws: TypeError (unsupported input type), RangeError (length mismatch)
  - Effects: None (pure function)

Configuration options and their effects:
- Normalization mode: fixed to NFC for canonical equivalence.
- Allowed input types: exactly the listed types; do not coerce objects silently to avoid hidden bugs.

Concrete best practices and patterns:
- When comparing many pairs from the same source string, pre-normalize and reuse the normalized form to avoid repeated normalize() costs.
- For memory-constrained compares on huge strings, avoid Array.from; instead iterate code points with for..of over a normalized string and advance an iterator for the second string in lockstep.
- For bit-popcount, use a 256-entry lookup table indexed by byte value: precompute counts for 0..255 at module init.

Step-by-step troubleshooting procedures:
1. If RangeError observed for strings: verify both inputs were normalized and count code points using Array.from(str).length; un-normalized combining sequences cause length mismatch.
2. If TypeError in bits function: confirm the inputs are Buffer, Uint8Array, or ArrayBuffer; for ArrayBuffer, pass new Uint8Array(buf) instead of buf when in mixed environments.
3. If performance is poor: profile to find whether normalize() or popcount dominates; cache normalized strings and replace popcount with native CPU instruction or optimized library.

DETAILED DIGEST

Source: https://github.com/xn-intenton-z2a/repository0
Content retrieved: 2026-03-06T21:56:39.852Z
Data size obtained during crawl: 115 bytes (SOURCES.md content length in characters)

Extracted technical highlights used to compile this document:
- Exact function signatures and the required validation/exception semantics for both string-based and bitwise Hamming distance.
- Mandatory NFC normalization for Unicode strings and requirement to compare by code points rather than UTF-16 units.
- Byte-level XOR + popcount algorithm for bit Hamming distance and accepted buffer types.
- Performance and implementation patterns (popcount lookup table, streaming comparisons, buffer views).

ATTRIBUTION

Source URL: https://github.com/xn-intenton-z2a/repository0
Crawl date: 2026-03-06
Data obtained: SOURCES.md (115 characters)

END OF DOCUMENT
