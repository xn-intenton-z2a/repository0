# HAMMING_CORE

Feature name: HAMMING_CORE

Summary

A single-file implementation of the hamming-distance primitives in src/lib/main.js that exports hammingDistance, hammingDistanceBits, and hammingDistanceBytes as named ES module exports. Each function performs strict validation and throws TypeError or RangeError for invalid inputs. hammingDistance gains an optional normalization option so callers can request canonical Unicode normalization before comparison.

Behavior and Validation

- hammingDistance(a, b, options)
  - Signature: hammingDistance(a, b, options = {}) where options may include:
    - normalize: boolean (default false) — when true, normalize both input strings before comparing.
    - form: string ("NFC" | "NFD" | "NFKC" | "NFKD", default "NFC") — normalization form passed to String.prototype.normalize when normalize is true.
  - Both a and b must be strings otherwise throw TypeError.
  - If options.normalize is true, call a = a.normalize(form) and b = b.normalize(form) before iterating by Unicode code points.
  - Compare by Unicode code points (use Array.from or for...of). If code point lengths differ throw RangeError.
  - Return the integer count of positions where code points differ.
  - RangeError and TypeError messages should be clear and include relevant lengths or types to aid debugging.

- hammingDistanceBits(x, y)
  - Accept Number (integer) or BigInt for each argument. For Number inputs require Number.isInteger, otherwise throw TypeError.
  - Reject negative inputs with RangeError.
  - Coerce to BigInt and compute xor, then count bits using a loop (Wegner's method) returning an integer popcount.
  - Accept mixed Number and BigInt by coercing Numbers to BigInt after validation.

- hammingDistanceBytes(a, b)
  - Accept ArrayBuffer-backed types and Node Buffer. For unsupported types throw TypeError.
  - Normalize to Uint8Array views without copying where possible.
  - If byte lengths differ throw RangeError.
  - Iterate in moderate chunks (64KiB) and count differing byte positions; return integer count.

Implementation Notes

- All implementation lives in src/lib/main.js as synchronous named exports so CLI and web demo may import them directly.
- Avoid silent coercions; be explicit about supported input forms and error types.
- Keep code dependency-free and simple for easy testability.
- Normalization is optional and must not be applied implicitly; callers who need canonical equivalence should set options.normalize to true. This keeps default behaviour strict on code points and consistent with UNICODE_SUPPORT guidance.

Tests (tests/unit)

Required test cases (concise):
- Strings: karolin vs kathrin -> 3; empty vs empty -> 0; mismatched lengths throws RangeError; non-string throws TypeError; astral char comparison counts code points.
- Normalization: 'e\u0301' vs 'é' should be different without normalization and equal (distance 0) when compared with options.normalize = true and form = 'NFC'. Include tests for explicit form selection (NFD).
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
- hammingDistance('e\u0301','é') without normalization returns non-zero distance; hammingDistance('e\u0301','é', { normalize: true, form: 'NFC' }) === 0
- All listed unit tests pass and README includes usage examples and references to examples/cli-output.md
