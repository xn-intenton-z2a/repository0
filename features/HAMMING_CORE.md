# HAMMING_CORE

Specification

## Summary

Provide a single-file, well-tested, Unicode-correct Hamming distance implementation in src/lib/main.js and update tests and README examples. The feature delivers three named exports: hammingDistance, hammingDistanceBits, and hammingDistanceBytes, each with strict validation semantics and clear behaviour documented for consumers and the web demo.

## API

Named exports (from src/lib/main.js):

- hammingDistance(a, b)
- hammingDistanceBits(x, y)
- hammingDistanceBytes(a, b)

Each function must be implemented as an ES module named export and documented in README with concise usage examples.

## Behaviour

hammingDistance
- Compare two strings by Unicode code points (iterate with for...of or Array.from) so surrogate-pair characters count as one position.
- Return the number of code point positions where a and b differ.
- Throw TypeError if either argument is not a string.
- Throw RangeError if the strings have different lengths measured in code points.

hammingDistanceBits
- Accept Number integers (within safe integer range) and BigInt values; mixed-type calls are permitted and coerced to BigInt for comparison.
- Return the population count of the XOR of the two integer values (number of differing bits).
- Throw TypeError if an input is not an integer Number or a BigInt.
- Throw RangeError if an input is negative.
- Must support arbitrarily large BigInt values correctly.

hammingDistanceBytes
- Accept binary sequence inputs of equal byte length: Uint8Array, Uint8ClampedArray, ArrayBuffer, DataView, Buffer (Node), or other byte-viewable inputs.
- Normalize inputs to lightweight Uint8Array views without unnecessary copying and compare bytes to count differing positions.
- Throw TypeError for unsupported types.
- Throw RangeError if byte lengths differ.
- Iterate in slices for very large buffers to avoid large intermediate allocations.

## Validation and Errors

- Preserve the library-wide error semantics: throw TypeError for incorrect types, RangeError for length/negative-value problems.
- The CLI and web demo will map these thrown errors to user-friendly messages but must not change the thrown error types in the library API.

## Tests and Examples

- Add or update unit tests under tests/unit/ to cover normal, edge, and error cases for each API:
  - hammingDistance: typical strings, empty strings, astral-plane characters and surrogate pairs, combining sequences, TypeError and RangeError cases.
  - hammingDistanceBits: Number vs Number, BigInt vs BigInt, mixed Number/BigInt, zero and identical large BigInt values, non-integer Number TypeError, negative RangeError.
  - hammingDistanceBytes: comparisons across TypedArray, ArrayBuffer, DataView and Buffer inputs, empty buffers, differing-length RangeError, unsupported-type TypeError, and a large buffer case that verifies slice iteration strategy.
- Update README.md to include a Hamming Core section documenting the three functions with short examples for strings, bits (including BigInt examples) and bytes (TypedArray and Buffer examples).
- Ensure examples/cli-output.md and the web demo reference canonical examples (karolin vs kathrin, empty vs empty, 1 vs 4, 0 vs 0) and include expected outputs for CLI tests.

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

## Implementation notes

- Use code point iteration for strings (for...of or Array.from) to satisfy Unicode requirements; grapheme cluster normalization is out of scope but must be documented.
- For hammingDistanceBits, coerce Number inputs to BigInt when necessary, compute XOR, and use an efficient popcount algorithm on BigInt (e.g., while (x) { x &= x - 1; count++; }).
- For hammingDistanceBytes, normalize to Uint8Array views (avoid copies when possible) and iterate either by bytes or by aligned words when safe; ensure correctness first.
- Keep the implementation self-contained in src/lib/main.js so library imports and the web demo remain simple.

## Notes

- This file is the authoritative core feature spec: preserve its tests and README obligations when adding complementary features such as the CLI or web demo.
Implement the canonical Hamming distance API and tests in src/lib/main.js. Export the following named exports: hammingDistance, hammingDistanceBits, and hammingDistanceBytes. Implementations must be idiomatic ES modules and must not change the repository public file layout.

Overview

This feature covers three complementary APIs:
- hammingDistance(a, b): Unicode-aware string Hamming distance (code point comparison).
- hammingDistanceBits(x, y): numeric bitwise Hamming distance for Number and BigInt values.
- hammingDistanceBytes(a, b): byte-wise Hamming distance for binary sequences (ArrayBuffer, TypedArray, Node Buffer, DataView).

Behavior

- hammingDistance(a, b)
  - Accepts two string arguments and returns the number of positions with differing Unicode code points.
  - Must iterate over Unicode code points (for example, for...of or Array.from) so that surrogate-pair characters count as a single position.
  - Throws TypeError if either argument is not a string.
  - Throws RangeError if strings have different lengths when measured in code points.

- hammingDistanceBits(x, y)
  - Accepts two non-negative integers or BigInt values and returns the number of differing bits in their binary representation (population count of XOR).
  - Accept Number integers (within safe integer range) and BigInt values; mixed-type calls (Number and BigInt) are allowed and are coerced into BigInt for bitwise comparison.
  - Throws TypeError if either argument is not an integer Number or a BigInt.
  - Throws RangeError if either numeric argument is negative.
  - Must work correctly for arbitrarily large BigInt values beyond Number.MAX_SAFE_INTEGER.

- hammingDistanceBytes(a, b)
  - Accepts two binary sequence inputs of the same length and returns the number of differing bytes between them.
  - Supported input types: Uint8Array, Uint8ClampedArray, ArrayBuffer, DataView, Buffer (Node.js), and any object that can be viewed as a byte sequence; mixed view types are permitted but lengths must match.
  - Normalise inputs to Uint8Array views over bytes for comparison (do not copy unless necessary).
  - Throws TypeError if either argument is not a supported binary sequence type.
  - Throws RangeError if the byte lengths differ.
  - Behaviour for very large buffers: implementations should iterate in slices to avoid large intermediate allocations; streaming/stream-compatible APIs are out of scope but permitted as future extensions.

Exports

- Export hammingDistance, hammingDistanceBits, and hammingDistanceBytes as named exports from src/lib/main.js.

Tests and Examples

- Add comprehensive unit tests under tests/unit/ covering:
  - hammingDistance: normal cases, empty strings, surrogate-pair and astral characters, TypeError and RangeError cases.
  - hammingDistanceBits: Number and BigInt inputs, mixed Number/BigInt calls, zero and large BigInt identities, non-integer Number TypeError, negative RangeError.
  - hammingDistanceBytes: Uint8Array vs Uint8Array, ArrayBuffer vs Buffer, DataView vs Uint8Array, empty buffers, differing-length RangeError, TypeError for unsupported types, and a large buffer case (e.g., 1e6 bytes) to assert performance-friendly operation.
- Update README with usage examples for all three functions, including BigInt numeric examples and examples using TypedArray and Buffer.
- Ensure examples/cli-output.md or web demo examples reference the byte-wise API where relevant.

Implementation notes

- hammingDistance should operate over Unicode code points using for...of or Array.from.
- hammingDistanceBits should coerce Number to BigInt when necessary and compute XOR followed by a popcount on the BigInt result. Use an efficient popcount approach for BigInt (e.g., loop with x &= x - 1) to support very large values.
- hammingDistanceBytes should create lightweight Uint8Array views over inputs (for ArrayBuffer/DataView/Buffer) and iterate by bytes; consider word-wise comparisons (Uint32/BigUint64) when alignment and environment permit for performance, but correctness across all supported types is required first.
- Preserve TypeError and RangeError semantics; do not silently coerce invalid types.

Acceptance Criteria

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

Notes

- This feature extends the original core API to cover binary data sequences in addition to strings and numeric bitwise comparisons, keeping the library compact and single-file implementable in src/lib/main.js.
- Streaming or chunked APIs are out of scope for this change but the implementation should not preclude adding them later.
