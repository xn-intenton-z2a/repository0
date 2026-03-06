DOCUMENT: HAMMING_UTILS

NORMALISED EXTRACT

Table of contents
1. Function signatures and types
2. Hamming distance for sequences (hammingDistance)
3. Hamming distance for integers/bits (hammingDistanceBits)
4. Error conditions and thrown exceptions
5. Operational details and implementation patterns
6. Performance characteristics

1. Function signatures and types
export function hammingDistance(a, b)
- Parameters:
  a: string | Buffer | Uint8Array | ArrayLike
  b: string | Buffer | Uint8Array | ArrayLike
- Returns: number (count of differing positions)
- Behaviour: For strings, comparison is by Unicode code points using Array.from(a) and Array.from(b). For Buffer, Uint8Array, or other array-like values, comparison iterates over numeric elements. Inputs must be equal length; otherwise a RangeError is thrown. Unsupported types cause a TypeError.

export function hammingDistanceBits(x, y)
- Parameters:
  x: number | bigint
  y: number | bigint
- Returns: number (count of differing bits)
- Behaviour: Accepts Numbers (treated as unsigned 32-bit via >>>0) and BigInts. If either argument is BigInt, both are compared as BigInt (Numbers coerced by Number(x) >>> 0 then BigInt). Negative BigInt causes RangeError. Only Number or BigInt allowed; otherwise TypeError is thrown.

2. Hamming distance for sequences (hammingDistance)
- Input normalization:
  - Strings: split into Unicode code points via Array.from to ensure grapheme code point accuracy for multi-byte characters.
  - Binary/array-like: use length and numeric index access (a[i]) to compare elements.
- Length requirement: Both inputs must have identical length; mismatch results in RangeError("Inputs must be the same length").
- Difference count algorithm: single pass linear scan increments counter when element mismatch is found.
- Supported types: string, Buffer (Node.js Buffer.isBuffer), Uint8Array, and any object with numeric length property (array-like). Strings are detected via typeof v === "string"; Buffer via Buffer.isBuffer when Buffer exists.
- Failure modes: If types are mixed but both are array-like (e.g., Array and Uint8Array), algorithm compares index-wise values; if types are unsupported (e.g., object without length), throws TypeError('Unsupported input types for hammingDistance. Use strings, Buffer, Uint8Array or array-like.').

3. Hamming distance for integers/bits (hammingDistanceBits)
- Numbers handling: Numbers coerced to unsigned 32-bit using Number(x) >>> 0; equality / xor computed on 32-bit values.
- BigInt handling: When either operand is BigInt, both are represented as BigInt; Number values are coerced to BigInt(Number >>> 0). Negative BigInts are rejected with RangeError.
- Bit-differ count algorithm: use bitwise XOR to get differing bits, then Kernighan's algorithm (diff &= diff - 1) in a loop to count set bits. For BigInt use BigInt operations (diff &= diff - 1n) and count with integer loop.
- Mixing Number and BigInt is supported via coercion of Number to unsigned 32-bit then to BigInt.

4. Error conditions and thrown exceptions
- RangeError("Inputs must be the same length") raised when sequence lengths differ in hammingDistance or when comparing negative BigInt in hammingDistanceBits.
- TypeError raised when passed unsupported types to either function (e.g., non-numeric non-BigInt for hammingDistanceBits or non-string/non-array-like for hammingDistance).

5. Operational details and implementation patterns
- String comparison by Unicode code points: Use Array.from to ensure surrogate pairs and combined code points are treated as single entries.
- Array-like detection: check for presence of length property and numeric indexing rather than relying on Array.isArray, to accept typed arrays and Buffer.
- Buffer detection: use typeof Buffer !== 'undefined' && Buffer.isBuffer(v) to safely operate in environments where Buffer may be unavailable.
- Bit counting: Kernighan's algorithm used for O(k) where k is number of set bits; worst-case complexity O(w) where w is word width (32 for numbers, length of BigInt in bits otherwise).

6. Performance characteristics
- hammingDistance: time O(n) where n is sequence length; constant extra space excluding input normalization for strings (Array.from creates arrays proportional to string length). For very large strings, prefer pre-normalized code point arrays to avoid double memory.
- hammingDistanceBits: time proportional to number of set bits in xor result; worst-case bounded by word size (32 loops for Number, proportional to bit-length for BigInt).

SUPPLEMENTARY DETAILS

A. Implementation constraints
- Node.js environment recommended for Buffer support; functions also work in browser environments for string and Uint8Array.
- Node engine requirement in repository package.json: node >= 24.0.0. Package type is module.

B. Security and correctness notes
- Unicode: Array.from yields code points; does not perform grapheme cluster segmentation. For user-visible grapheme equality, normalize with Intl.Segmenter or a grapheme library before comparison.
- BigInt negative check: code rejects negative BigInt to avoid ambiguous interpretations for bit-width and two's complement behavior.

C. Integration patterns
- Exported as ESM from src/lib/main.js. Import via "import { hammingDistance } from './src/lib/main.js'".
- CLI entrypoint: main(args) exists to print run arguments and is invoked when script executed directly. main is side-effect free beyond console.log.

REFERENCE DETAILS (API SPECIFICATIONS and exact signatures)

1) hammingDistance(a, b)
Signature: export function hammingDistance(a, b)
Parameters:
- a: string | Buffer | Uint8Array | ArrayLike
- b: string | Buffer | Uint8Array | ArrayLike
Returns: number (integer >= 0)
Throws:
- RangeError("Inputs must be the same length") when lengths differ.
- TypeError('Unsupported input types for hammingDistance. Use strings, Buffer, Uint8Array or array-like.') for unsupported types.
Exact algorithm:
- If both typeof === 'string':
  - pa = Array.from(a); pb = Array.from(b)
  - if pa.length !== pb.length -> throw RangeError
  - iterate i from 0 to pa.length - 1; if pa[i] !== pb[i] increment diff
  - return diff
- Else if both are Buffer/Uint8Array/array-like:
  - la = a.length; lb = b.length; if la !== lb -> throw RangeError
  - iterate i and compare a[i] !== b[i] to count differences
- Else: throw TypeError

2) hammingDistanceBits(x, y)
Signature: export function hammingDistanceBits(x, y)
Parameters:
- x: number | bigint
- y: number | bigint
Returns: number (integer >= 0)
Throws:
- TypeError('hammingDistanceBits accepts only Number or BigInt') if inputs not Number/BigInt
- RangeError('Negative BigInt is not allowed') when BigInt argument < 0n
Exact algorithm:
- Determine isBigInt(x) or isBigInt(y)
- If either operand is BigInt:
  - ax = isBigInt(x) ? x : BigInt(Number(x) >>> 0)
  - ay = isBigInt(y) ? y : BigInt(Number(y) >>> 0)
  - if ax < 0n || ay < 0n -> throw RangeError
  - diff = ax ^ ay
  - count set bits by while(diff) { diff &= diff - 1n; count++ }
  - return count
- Else (both Numbers):
  - ux = Number(x) >>> 0; uy = Number(y) >>> 0
  - v = ux ^ uy
  - c = 0; while(v) { v &= v - 1; c++ }
  - return c

BEST PRACTICES and USAGE PATTERNS
- For long strings where memory matters, avoid calling hammingDistance directly on raw long strings; pre-convert to code-point arrays once and reuse.
- For comparing user-visible text, normalize Unicode form (NFC/NFD) before comparison to avoid false differences due to canonical decomposition.
- When comparing large integer spaces, prefer BigInt usage to avoid implicit 32-bit truncation when that is not intended.

TROUBLESHOOTING
- Symptom: RangeError Inputs must be the same length. Fix: verify inputs have identical lengths after the normalization step used (Array.from for strings). If comparing grapheme clusters, pre-segment and compare segment arrays.
- Symptom: Unexpected TypeError for hammingDistance in browser. Cause: Buffer not defined; ensure inputs are strings, Uint8Array, or array-like; or polyfill Buffer if needed.
- Symptom: hammingDistanceBits returns larger-than-expected bit differences for Numbers. Cause: Number input coerced to unsigned 32-bit via >>>0; if comparing full 64-bit semantics, use BigInt explicitly.

DETAILED DIGEST (most valuable technical content extracted)
- Extracted the repository entry point implementing two utilities: hammingDistance and hammingDistanceBits with precise type handling and explicit error conditions.
- hammingDistance uses Unicode code point array conversion for strings and index-wise numeric comparison for binary/array-like inputs. Throws RangeError for length mismatches and TypeError for unsupported types.
- hammingDistanceBits supports Number and BigInt, coercing Numbers to unsigned 32-bit; when BigInt is used, Numbers are coerced to BigInt(Number >>> 0). Uses XOR + Kernighan bit-count algorithm for set-bit counting. Negative BigInt is disallowed.
- Exported ESM functions; package.json declares module type and Node engine >= 24.0.0.

Source retrieval details
- Sources crawled: https://github.com/xn-intenton-z2a/repository0
- Files retrieved locally and byte sizes:
  - src/lib/main.js: 3173 bytes
  - README.md: 792 bytes
  - package.json: 583 bytes
  - tests/unit/main.test.js: 315 bytes
  - docs.md: 0 bytes
  - Total retrieved: 4863 bytes
- Retrieval date: 2026-03-06T23:58:30.645Z

ATTRIBUTION
- Source repository: https://github.com/xn-intenton-z2a/repository0
- Author/maintainers: project repository (see package.json for declared package and license MIT)
- Data size obtained during crawl: 4863 bytes

END OF DOCUMENT
