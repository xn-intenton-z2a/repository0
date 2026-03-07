# HAMMING_CORE

Specification

## Feature name
HAMMING_CORE

## Summary

A focused, single-file implementation of Hamming distance primitives in src/lib/main.js with precise typed errors, thorough unit tests, and README examples. Expose three named, synchronous exports: hammingDistance, hammingDistanceBits, and hammingDistanceBytes. Keep the implementation compact and dependency-free so the CLI and web demo can import it directly.

## Goals

- Correct Unicode-aware string comparisons measured in code points.
- Robust integer bit comparisons supporting Number and BigInt with clear validation.
- Safe, zero-copy byte-wise comparison supporting common buffer-like inputs and large buffers via chunked iteration.
- Complete unit test coverage for normal, edge, and error cases and README examples demonstrating library and CLI usage.

## API (named exports)

- hammingDistance(a, b)
- hammingDistanceBits(x, y)
- hammingDistanceBytes(a, b)

All functions are named exports from src/lib/main.js and throw TypeError or RangeError according to the validation rules below.

## Behaviour and Validation

hammingDistance(a, b)
- Inputs: both must be strings. TypeError if not.
- Comparison semantics: iterate by Unicode code points (for...of or Array.from) so surrogate pairs count as a single position; grapheme clusters are intentionally out of scope.
- Length validation: compute lengths in code points and throw RangeError if unequal.
- Return: integer count of code point positions where the values differ.

hammingDistanceBits(x, y)
- Inputs: accept Number (integer) or BigInt. Mixed Number/BigInt is allowed; Number inputs must satisfy Number.isInteger and fit safe integer semantics only for validation—comparison is performed after coercion to BigInt.
- Validation: TypeError for non-number/non-BigInt or non-integer Number; RangeError for negative inputs (Number < 0 or BigInt < 0n).
- Algorithm: coerce to BigInt, compute xor = aBig ^ bBig, then count set bits using Wegner's loop: while (xor) { xor &= xor - 1n; ++count; }.
- Return: integer count of differing bits.

hammingDistanceBytes(a, b)
- Supported inputs: Uint8Array, Uint8ClampedArray, ArrayBuffer, DataView, Buffer (Node.js), and other array-buffer-backed views. TypeError for unsupported inputs.
- Normalisation: create a Uint8Array view without copying when possible (new Uint8Array(arg) or new Uint8Array(arg.buffer, arg.byteOffset, arg.byteLength)).
- Length validation: throw RangeError if byte lengths differ.
- Algorithm: iterate over the buffers in moderate-sized chunks (suggested 64 * 1024 bytes) to avoid large allocations; compare bytes and accumulate differing positions.
- Return: integer count of differing bytes.

Error semantics
- TypeError: invalid argument types
- RangeError: unequal lengths (strings or byte sequences) or negative numeric inputs
- No silent coercions that mask programmer errors; callers and the CLI/web demo will map these to user-friendly messages.

## Implementation notes

- Keep all implementation in src/lib/main.js as named ES module exports.
- For strings: use Array.from(a) or for...of to iterate code points and to compute lengths.
- For numbers: validate Number.isInteger(n) for Number inputs, then coerce via BigInt(n) prior to xor.
- For bytes: prefer new Uint8Array(arg) where arg is ArrayBuffer/TypedArray/Buffer/DataView; if Buffer exists (Node.js), handle it without extra copy.
- Chunk size: 65536 (64KiB) is recommended for slice iteration; correctness over micro-optimisations.
- Keep code synchronous and side-effect free.

## Tests

Location: tests/unit/

Required unit test cases (must be implemented):
- hammingDistance
  - hammingDistance("karolin", "kathrin") === 3
  - hammingDistance("", "") === 0
  - hammingDistance("a", "bb") throws RangeError
  - TypeError when either argument is not a string
  - Astral characters: hammingDistance("a\u{1F600}", "a\u{1F601}") === 1 (ensure each emoji counted as one code point)

- hammingDistanceBits
  - hammingDistanceBits(1, 4) === 2
  - hammingDistanceBits(0, 0) === 0
  - hammingDistanceBits(1n, 4n) === 2
  - hammingDistanceBits(9007199254740993n, 9007199254740993n) === 0
  - Mixed Number/BigInt: hammingDistanceBits(1, 4n) === 2
  - Non-integer Number (e.g., 1.5) throws TypeError
  - Negative Number or BigInt throws RangeError

- hammingDistanceBytes
  - hammingDistanceBytes(new Uint8Array([1,2,3]), new Uint8Array([1,0,3])) === 1
  - hammingDistanceBytes(Buffer.from([1,2]), new Uint8Array([1,3])) === 1 (Node environment)
  - hammingDistanceBytes(new ArrayBuffer(0), new ArrayBuffer(0)) === 0
  - Differing byte lengths throw RangeError
  - Unsupported types throw TypeError
  - Large buffer: compare two 1e6-length buffers with a few mismatches to assert chunked loop works without huge allocations

- CLI integration tests (small integration tests spawn node src/lib/main.js)
  - node src/lib/main.js string karolin kathrin prints 3 and exits 0
  - node src/lib/main.js bits 1 4 prints 2 and exits 0
  - node src/lib/main.js bytes hex 010203 010003 prints 1 and exits 0 (covered by CLI_BYTES feature)

## README and Examples

README must contain concise API docs and usage examples for:
- Strings: show Unicode/astral example and the karolin/kathrin canonical example
- Bits: Number and BigInt examples, plus mixed Number/BigInt example
- Bytes: show TypedArray and Buffer examples and refer to examples/cli-output.md for CLI outputs
- CLI: brief usage summary and examples for string, bits, and bytes modes

Examples
- Provide examples/cli-output.md containing canonical CLI outputs for tests: karolin vs kathrin, empty vs empty, 1 vs 4, 0 vs 0, bytes hex example.

## Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits(1n, 4n) returns 2
- hammingDistanceBits(9007199254740993n, 9007199254740993n) returns 0
- hammingDistanceBits(1, 4n) returns 2
- Negative Number or BigInt arguments throw RangeError
- Non-integer Number inputs throw TypeError
- hammingDistanceBytes(new Uint8Array([1,2,3]), new Uint8Array([1,0,3])) returns 1
- hammingDistanceBytes(Buffer.from([1,2]), new Uint8Array([1,3])) returns 1
- hammingDistanceBytes(new ArrayBuffer(0), new ArrayBuffer(0)) returns 0
- Differing byte lengths throw RangeError
- Unsupported byte input types throw TypeError
- Unit tests for all APIs pass and README contains usage examples and references to examples/cli-output.md

## Notes

- This spec retains the previously described hammingDistanceBytes functionality while tightening validation rules and test requirements.
- Implementation must remain in a single source file to keep the library easy to import in the CLI and web demo.
- Keep the public API stable; tests and docs must demonstrate correct Unicode handling and BigInt support.
