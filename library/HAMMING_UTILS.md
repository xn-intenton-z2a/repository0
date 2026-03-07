DOCUMENT: HAMMING_UTILS

NORMALISED EXTRACT

Table of contents
1. API signatures and types
2. Sequence Hamming distance (hammingDistance)
3. Integer/bit Hamming distance (hammingDistanceBits)
4. Errors and validations
5. Implementation patterns and algorithms
6. Performance and memory characteristics

1. API signatures and types
- hammingDistance(a, b)
  - Parameters: a: string | Buffer | Uint8Array | ArrayLike, b: string | Buffer | Uint8Array | ArrayLike
  - Returns: number (integer >= 0) — count of differing positions
  - Throws: RangeError when lengths differ; TypeError for unsupported types
- hammingDistanceBits(x, y)
  - Parameters: x: number | bigint, y: number | bigint
  - Returns: number (integer >= 0) — count of differing bit positions
  - Throws: TypeError for non-number/non-BigInt inputs; RangeError for negative BigInt

2. Sequence Hamming distance (hammingDistance)
- Input normalization: strings are converted using Array.from to produce code point arrays; typed arrays and Buffers are used as-is.
- Length check: if normalized lengths differ, throw RangeError("Inputs must be the same length").
- Comparison algorithm: single-pass index-wise comparison; increment counter when element mismatch detected. For strings comparison uses strict equality of code points.
- Supported inputs: string, Buffer (if Buffer exists), Uint8Array, and any array-like object exposing numeric length and index access.
- Environment notes: Buffer detection uses typeof Buffer !== 'undefined' && Buffer.isBuffer(v) to remain compatible between Node and browser.

3. Integer/bit Hamming distance (hammingDistanceBits)
- Number handling: Number values are coerced to unsigned 32-bit via Number(x) >>> 0 before XOR.
- BigInt handling: If either operand is BigInt, both operands are compared as BigInt. Coercion: Number -> BigInt(Number >>> 0). Negative BigInt values are rejected to avoid ambiguous two's-complement semantics.
- Bit-diff algorithm: compute diff = ax ^ ay, then count set bits using Kernighan's algorithm: while(diff) { diff &= diff - 1; count++ } (use BigInt variants when operands are BigInt).
- Mixing Number and BigInt: allowed; Number is coerced to unsigned 32-bit then to BigInt.

4. Errors and validations
- RangeError("Inputs must be the same length") thrown by hammingDistance when lengths mismatch.
- TypeError('Unsupported input types for hammingDistance. Use strings, Buffer, Uint8Array or array-like.') thrown for invalid sequence inputs.
- TypeError('hammingDistanceBits accepts only Number or BigInt') thrown for invalid numeric types.
- RangeError('Negative BigInt is not allowed') thrown when a BigInt < 0n is provided.

5. Implementation patterns and algorithms
- Unicode-safe string comparison: Array.from(string) to get code points; does not perform grapheme cluster segmentation — use a grapheme library or Intl.Segmenter if needed for user-visible clusters.
- Array-like acceptance: prefer checking for length property and numeric indexing rather than Array.isArray to accept typed arrays and Buffer.
- Buffer safety: check for Buffer existence before calling Buffer.isBuffer to avoid ReferenceError in browser contexts.
- Bit counting: Kernighan's algorithm for set-bit counting gives iteration proportional to number of set bits rather than bit-width.

6. Performance and memory characteristics
- hammingDistance: O(n) time where n is the sequence length. For string inputs, Array.from creates an intermediate array of size n — consider precomputing code point arrays for repeated comparisons to save memory and time.
- hammingDistanceBits: time proportional to number of differing bits (Kernighan), worst-case bounded by word size (32 for Number) or bit-length for BigInt.

SUPPLEMENTARY DETAILS

Essential implementation and runtime specifications
- Module type: ESM; exported from src/lib/main.js as named exports.
- Node engine requirement: package.json specifies node >= 24.0.0.
- CLI entry: main(args) prints JSON stringified args and is executed when script run directly (process.argv detection using fileURLToPath(import.meta.url)).

Security, correctness, and interoperability notes
- Unicode normalization: Input strings should be normalized to a consistent Unicode normalization form (NFC/NFD) prior to Hamming comparison when user-visible equivalence matters.
- Grapheme clusters: Array.from yields code points; to compare grapheme clusters exactly use Intl.Segmenter or a dedicated grapheme library and compare the resulting segments.
- BigInt semantics: Negative BigInt is refused to avoid implicit two's-complement width assumptions; if negative values must be compared by bit pattern, pre-normalize to unsigned BigInt representation explicitly.

Integration and usage patterns
- Importing: import { hammingDistance, hammingDistanceBits } from './src/lib/main.js'
- Prefer using Uint8Array or Buffer for binary data comparisons to avoid string normalization overhead.
- When comparing many pairs against the same base sequence, pre-normalize the base once (Array.from for strings or reuse typed array) and reuse it to avoid repeated allocations.

REFERENCE DETAILS (API specifications, signatures, options, patterns)

API: hammingDistance(a, b)
- Signature: export function hammingDistance(a, b)
- Parameters:
  - a: string | Buffer | Uint8Array | ArrayLike — must support length and numeric index access; strings are accepted and normalized via Array.from.
  - b: same types as a
- Return: number — non-negative integer count of differing positions
- Throws:
  - RangeError("Inputs must be the same length") if lengths differ
  - TypeError('Unsupported input types for hammingDistance. Use strings, Buffer, Uint8Array or array-like.') for invalid types
- Exact implementation pattern:
  - if typeof a === 'string' && typeof b === 'string':
    - pa = Array.from(a); pb = Array.from(b)
    - if (pa.length !== pb.length) throw RangeError
    - diff = 0; for i in 0..pa.length-1 if pa[i] !== pb[i] diff++
  - else if both are array-like (Buffer/Uint8Array/array-like):
    - if lengths differ throw RangeError
    - index-wise numeric comparison and count mismatches
  - else throw TypeError

API: hammingDistanceBits(x, y)
- Signature: export function hammingDistanceBits(x, y)
- Parameters:
  - x: number | bigint
  - y: number | bigint
- Return: number — non-negative integer count of differing bits
- Throws:
  - TypeError('hammingDistanceBits accepts only Number or BigInt') for invalid types
  - RangeError('Negative BigInt is not allowed') for negative BigInt inputs
- Exact implementation pattern:
  - determine if either operand is BigInt
  - if BigInt-mode:
    - ax = isBigInt(x) ? x : BigInt(Number(x) >>> 0)
    - ay = isBigInt(y) ? y : BigInt(Number(y) >>> 0)
    - if ax < 0n || ay < 0n throw RangeError
    - diff = ax ^ ay
    - count = 0; while (diff) { diff &= diff - 1n; count++ }
    - return count
  - else (Numbers):
    - ux = Number(x) >>> 0; uy = Number(y) >>> 0
    - v = ux ^ uy
    - c = 0; while (v) { v &= v - 1; c++ }
    - return c

Configuration options and effects
- Node version: node >= 24. Using older Node may fail due to ESM and modern language features.
- Buffer behavior: In browser environments Buffer may be undefined; ensure data uses Uint8Array or polyfill Buffer for cross-environment consistency.

Best practices and implementation examples (pattern descriptions)
- High-volume comparisons: convert repeated input strings to code-point arrays once and reuse those arrays for each comparison to avoid O(n) allocation per call.
- Unicode-safe comparisons: normalize using string.normalize('NFC') before Array.from to remove canonical equivalence differences.
- Choosing numeric type: when comparing values that may exceed 32-bit semantics (e.g., 64-bit identifiers), use BigInt consistently to avoid truncation.

Step-by-step troubleshooting
- Error: RangeError("Inputs must be the same length")
  - Verify both inputs are the same type after normalization. For strings, compare Array.from(a).length === Array.from(b).length. If comparing grapheme clusters, segment both inputs uniformly first.
- Error: TypeError('Unsupported input types for hammingDistance...')
  - Ensure inputs are strings, Buffer, Uint8Array, or array-like. In browsers, replace Buffer with Uint8Array or provide a Buffer polyfill.
- Unexpected large bit-difference from hammingDistanceBits
  - Confirm whether Number inputs were intended as 32-bit unsigned; if not, use BigInt inputs to preserve full-width semantics.

DETAILED DIGEST (most valuable technical content extracted)
- The repository exposes two precise utilities: hammingDistance for sequences and hammingDistanceBits for integer bit comparisons. Both export ESM functions with explicit type handling and strict validation.
- hammingDistance uses Array.from for strings to operate on Unicode code points and index-wise comparisons for array-like data. It enforces equal length and throws clear errors on misuse.
- hammingDistanceBits supports Numbers (unsigned 32-bit coercion) and BigInts, using XOR and Kernighan's algorithm for efficient set-bit counting; negative BigInt is rejected.
- Integration notes: ESM exports, Node >=24 requirement, Buffer checks for cross-environment compatibility, and a minimal CLI entrypoint.

SOURCE AND RETRIEVAL
- Source: https://github.com/xn-intenton-z2a/repository0 (local clone used)
- Files read locally during extraction: src/lib/main.js, README.md, SOURCES.md
- Data size retrieved: approximately 4863 bytes
- Retrieval date: 2026-03-07

ATTRIBUTION
- Repository: xn-intenton-z2a/repository0 (MIT licensed code)
- Maintainers: see repository package.json
- Crawl data size: ~4863 bytes

END OF DOCUMENT
