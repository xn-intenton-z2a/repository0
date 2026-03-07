# HAMMING_CORE

Feature name: HAMMING_CORE

Summary

A single-file implementation of the hamming-distance primitives in src/lib/main.js that exports hammingDistance, hammingDistanceBits, and hammingDistanceBytes as named ES module exports. Each function performs strict validation and throws TypeError or RangeError for invalid inputs.

Behavior and Validation

- hammingDistance(a, b)
  - Both inputs must be strings otherwise throw TypeError.
  - Compare by Unicode code points (use Array.from or for...of). If code point lengths differ throw RangeError.
  - Return the integer count of positions where code points differ.

- hammingDistanceBits(x, y)
  - Accept Number (integer) or BigInt for each argument. For Number inputs require Number.isInteger, otherwise throw TypeError.
  - Reject negative inputs with RangeError.
  - Coerce to BigInt and compute xor, then count bits using a loop (Wegner's method) returning an integer popcount.

- hammingDistanceBytes(a, b)
  - Accept ArrayBuffer-backed types and Node Buffer. For unsupported types throw TypeError.
  - Normalize to Uint8Array views without copying where possible.
  - If byte lengths differ throw RangeError.
  - Iterate in moderate chunks (64KiB) and count differing byte positions; return integer count.

Implementation Notes

- All implementation lives in src/lib/main.js as synchronous named exports so CLI and web demo may import them directly.
- Avoid silent coercions; be explicit about supported input forms and error types.
- Keep code dependency-free and simple for easy testability.

Tests (tests/unit)

Required test cases (concise):
- Strings: karolin vs kathrin -> 3; empty vs empty -> 0; mismatched lengths throws RangeError; non-string throws TypeError; astral char comparison counts code points.
- Bits: 1 vs 4 -> 2; 0 vs 0 -> 0; BigInt and mixed Number/BigInt cases; non-integer Number throws TypeError; negative values throw RangeError.
- Bytes: TypedArray and Buffer comparisons; equal empty buffers -> 0; mismatched lengths throw RangeError; unsupported types throw TypeError; large-buffer chunked comparison with a few mismatches.
- CLI integration: string and bits canonical invocations succeed and print expected results.

Acceptance Criteria

- hammingDistance("karolin","kathrin") === 3
- hammingDistance("","") === 0
- hammingDistance("a","bb") throws RangeError
- hammingDistanceBits(1,4) === 2
- hammingDistanceBits(0,0) === 0
- hammingDistanceBits(1n,4n) === 2
- hammingDistanceBits(9007199254740993n,9007199254740993n) === 0
- Mixed Number/BigInt cases work and match expectations
- Negative numeric inputs produce RangeError; non-integer Numbers produce TypeError
- hammingDistanceBytes(new Uint8Array([1,2,3]), new Uint8Array([1,0,3])) === 1
- All listed unit tests pass and README includes usage examples and references to examples/cli-output.md
