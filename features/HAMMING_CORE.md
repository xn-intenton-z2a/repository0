# HAMMING_CORE

Specification

## Summary

Provide a single-file, well-tested, Unicode-correct Hamming distance implementation in src/lib/main.js and update tests, examples, and README. The feature must export three named functions: hammingDistance, hammingDistanceBits and hammingDistanceBytes. Implementations must be idiomatic ES modules, preserve the library's error semantics, and be small enough to remain in one source file so the web demo and CLI can import them easily.

## API (named exports)

- hammingDistance(a, b)
- hammingDistanceBits(x, y)
- hammingDistanceBytes(a, b)

All functions are named exports from src/lib/main.js and must throw typed errors as described below rather than returning sentinel values.

## Behaviour

1) hammingDistance(a, b)
- Purpose: compute the Hamming distance between two text sequences measured in Unicode code points.
- Inputs: both arguments must be strings.
- Comparison: iterate over Unicode code points (for...of or Array.from) so surrogate-pair characters count as a single position. Grapheme clusters are out of scope and compared as raw code points.
- Return: number of positions where code points differ.
- Errors: throw TypeError if either argument is not a string; throw RangeError if code point lengths differ.

2) hammingDistanceBits(x, y)
- Purpose: compute the number of differing bits between two non-negative integers.
- Inputs: accept Number integers (safe integer range) and BigInt values. Mixed Number/BigInt calls are allowed and coerced to BigInt for comparison.
- Algorithm: coerce to BigInt, compute xor = bigintX ^ bigintY, then compute popcount via an efficient loop (while (xor) { xor &= xor - 1n; count++; }).
- Return: integer count of set bits in xor.
- Errors: throw TypeError if inputs are not integer Number or BigInt; throw RangeError if any numeric input is negative.

3) hammingDistanceBytes(a, b)
- Purpose: compute the byte-wise Hamming distance between two binary sequences of equal byte length.
- Supported inputs: Uint8Array, Uint8ClampedArray, ArrayBuffer, DataView, Buffer (Node.js), and other array-buffer-backed views. Mixed combinations are permitted.
- Normalization: create lightweight Uint8Array views over inputs without copying when possible (e.g., new Uint8Array(bufferOrView)).
- Algorithm: iterate in moderate-sized slices (for example, 64KiB) to avoid large intermediate allocations; compare bytes and count differing positions. Correctness takes priority over micro-optimizations.
- Return: number of differing bytes.
- Errors: throw TypeError for unsupported types; throw RangeError when byte lengths differ.

## Validation and Error Semantics

- TypeError for invalid argument types (non-string for hammingDistance; non-integer/non-BigInt for hammingDistanceBits; unsupported binary inputs for hammingDistanceBytes).
- RangeError for length mismatches (strings or byte sequences) or negative numeric values.
- Functions must not silently coerce invalid inputs; the CLI and web demo will translate these errors into friendly messages but the library API must keep the typed exceptions.

## Tests and Examples

- Unit tests location: tests/unit/
- Tests must cover normal, edge, and error cases for each function.

Required test cases (indicative list):
- hammingDistance:
  - hammingDistance("karolin", "kathrin") === 3
  - hammingDistance("", "") === 0
  - hammingDistance with astral characters (surrogate pairs) treated as single positions
  - hammingDistance("a", "bb") throws RangeError
  - TypeError when non-strings are passed
- hammingDistanceBits:
  - hammingDistanceBits(1, 4) === 2
  - hammingDistanceBits(0, 0) === 0
  - hammingDistanceBits(1n, 4n) === 2
  - hammingDistanceBits(9007199254740993n, 9007199254740993n) === 0
  - Mixed Number/BigInt: hammingDistanceBits(1, 4n) === 2
  - Non-integer Number (e.g., 1.5) throws TypeError
  - Negative numbers throw RangeError
- hammingDistanceBytes:
  - hammingDistanceBytes(new Uint8Array([1,2,3]), new Uint8Array([1,0,3])) === 1
  - hammingDistanceBytes(Buffer.from([1,2]), new Uint8Array([1,3])) === 1
  - hammingDistanceBytes(new ArrayBuffer(0), new ArrayBuffer(0)) === 0
  - Differing byte lengths throw RangeError
  - Unsupported types throw TypeError
  - Large buffer case (e.g., 1e6 bytes) verifies slice-based iteration doesn't allocate a single giant buffer or crash

- README.md must include concise examples for each function: strings (including an astral example), bits (including BigInt examples), and bytes (TypedArray and Buffer examples). Also include a short CLI usage section referencing examples/cli-output.md.

## CLI and Web Integration

- The CLI (node src/lib/main.js) and the web demo (src/web/...) must import these named exports and preserve the error semantics. They will map thrown TypeError and RangeError to user-friendly messages.
- The library implementation must remain synchronous and side-effect free so it is safe to call from the demo and tests.

## Implementation notes and constraints

- Keep implementation in a single file: src/lib/main.js. Keep exported function names and signatures stable.
- For strings, use Array.from or for...of to iterate code points; do not use .length for length checks.
- For bits, convert Number to BigInt with BigInt(n) after validating integerness: Number.isInteger(n) is required for Number inputs.
- For bytes, derive a Uint8Array view without copying when possible; use new Uint8Array(arg) for ArrayBuffer / TypedArray / Buffer / DataView.
- Slice size for large buffers should be conservative (e.g., 64KiB) to avoid high memory peaks while still being efficient.

## Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits(1n, 4n) returns 2
- hammingDistanceBits(9007199254740993n, 9007199254740993n) returns 0
- hammingDistanceBits(1, 4n) returns 2 (mixed Number/BigInt allowed)
- Negative Number or BigInt arguments throw RangeError
- Non-integer Number or non-BigInt/Number types throw TypeError
- hammingDistanceBytes(new Uint8Array([1,2,3]), new Uint8Array([1,0,3])) returns 1
- hammingDistanceBytes(Buffer.from([1,2]), new Uint8Array([1,3])) returns 1
- hammingDistanceBytes(new ArrayBuffer(0), new ArrayBuffer(0)) returns 0
- hammingDistanceBytes called with differing byte lengths throws RangeError
- hammingDistanceBytes called with unsupported types throws TypeError
- Unit tests for all APIs pass and README contains examples demonstrating string, bits, and byte APIs

## Notes

- This feature focuses on correctness, clear error semantics, and minimal surface area so the library remains easy to test and embed in the web demo and CLI. Performance optimizations (word-wise comparisons, SIMD) are acceptable later but are explicitly out of scope for the first implementation.
