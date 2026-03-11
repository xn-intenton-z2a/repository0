# HAMMING_CORE

# Summary

HAMMING_CORE is the canonical core feature specification for the hamming-distance library. It defines the public API implemented in src/lib/main.js, precise validation rules, deterministic error keywords, a recommended popcount implementation, and the tests and documentation required for acceptance.

# Motivation

Provide a single authoritative specification so the CLI, web demo, examples, and unit tests rely on the same semantics. Deterministic error message keywords and clear Unicode handling are necessary so tests can match substrings rather than fragile full messages.

# Specification

## Public API

- Export named synchronous functions from src/lib/main.js:
  - hammingDistance(a: string, b: string, options?: { normalize?: false | "NFC" | "NFD", segmentation?: "code-point" | "grapheme" }): number
  - hammingDistanceBits(x: number | bigint, y: number | bigint): number
  - popcount(value: bigint): number
- No external runtime dependencies; functions are pure and side-effect free.

Notes:
- The hammingDistance function accepts an optional options object with two orthogonal concerns: normalization (NFC/NFD/false) and segmentation mode (code-point or grapheme). The default behaviour is normalization: false and segmentation: "code-point".

## hammingDistance(a, b, options?)

Validation
- If typeof a !== 'string' or typeof b !== 'string', throw a TypeError whose message contains the substring string.
- If options is provided but is not a non-null object, throw TypeError mentioning options.
- If options.normalize exists and is not one of false, "NFC", "NFD", throw TypeError mentioning normalize.
- If options.segmentation exists and is not one of "code-point" or "grapheme", throw TypeError mentioning segmentation.

Unicode handling
- Apply normalization first when options.normalize is "NFC" or "NFD": call String.prototype.normalize(form) on both inputs before segmentation.
- Segmentation:
  - "code-point" (default): segment using Array.from(a) / Array.from(b) or the string iterator so surrogate pairs and astral code points count as single positions.
  - "grapheme": when selected, prefer Intl.Segmenter with granularity 'grapheme' to obtain grapheme clusters. If Intl.Segmenter is unavailable, fall back to throwing a RangeError mentioning segmenter and grapheme, to avoid silently incorrect comparisons. Implementations MAY also provide a conservative fallback that uses Array.from but tests must explicitly request environment support if they rely on grapheme.
- After segmentation, if the resulting segment sequences differ in length, throw RangeError with a message containing length or equal.

Behaviour
- Comparison unit: compare corresponding segments (code points or grapheme clusters) using strict equality of the segment strings (i.e., the strings yielded by segmentation). Return the number of differing positions as a non-negative Number.
- Interaction between normalization and segmentation:
  - When segmentation is "grapheme", normalization is still applied first if requested. This allows comparing precomposed and combining sequences as equivalent when normalize: "NFC" is used.
- Empty strings are valid and equal; hammingDistance("", "") returns 0.
- Deterministic error keywords that tests match: string, options, normalize, segmentation, segmenter, length.

Backward compatibility
- Existing callers that pass only two string args retain prior behaviour (code-point segmentation, no normalization).

## Grapheme mode examples (behaviour expectations)
- hammingDistance("a\u0301", "á", { segmentation: "code-point" }) -> 1 (two code-point sequences differ)
- hammingDistance("a\u0301", "á", { normalize: "NFC", segmentation: "code-point" }) -> 0
- hammingDistance("a\u0301", "á", { segmentation: "grapheme" }) -> depends on Intl.Segmenter availability: if available, the two inputs produce equivalent single grapheme clusters but different code-point content, so result is 1 unless normalize is also applied; with normalize: "NFC" the result becomes 0.

Implementation guidance
- Use Array.from for code-point segmentation: const sa = Array.from(a); const sb = Array.from(b);
- For grapheme segmentation use: const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' }); then collect segments via for-of iterating seg.segment(str) and pushing each segment.segment into an array. Validate presence of Intl and Segmenter first.
- Compare lengths then iterate and count mismatched segment strings.

## hammingDistanceBits(x, y)

Validation
- Accept Number (integer) or BigInt for each argument; otherwise throw TypeError that mentions number or integer.
- If typeof arg === 'number' then require Number.isInteger(arg); otherwise throw TypeError.
- If any numeric value is negative, throw RangeError mentioning non-negative.

Behaviour
- Convert Number inputs to BigInt: bx = BigInt(x); by = BigInt(y). Reject negative BigInts (< 0n).
- Compute v = bx ^ by and return popcount(v) as a Number.
- Use the popcount helper for the bit count.

## popcount(value)

Validation
- Require typeof value === 'bigint'; otherwise throw TypeError mentioning bigint or number.
- If value < 0n, throw RangeError mentioning non-negative.

Behaviour
- Return the count of set bits in value as a JavaScript Number.
- Recommended implementation: 256-entry byte lookup table (Uint8Array) and iterate over 8-bit slices until v === 0n for performance across wide BigInts. Include a commented Kernighan fallback as a clear, easy-to-audit alternative.

### POPCOUNT_OPTIMIZATION (new)

Purpose
- Provide a small, dependency-free, well-tested popcount implementation tuned for BigInt widths used in typical tests and examples, while keeping code simple for maintainability.

Implementation guidance
- Build a const BYTE_POPCOUNT = new Uint8Array(256) precomputed at module load with counts for 0..255.
- popcount(value: bigint):
  - Validate as above.
  - While value !== 0n:
    - sum += BYTE_POPCOUNT[Number(value & 0xffn)];
    - value >>= 8n;
  - return sum as Number.
- Include an exported (internal) fallback function popcountKernighan for clarity and testability; tests may exercise both implementations equivalence.

Testing and performance
- Add unit tests that exercise: small values, large sparse values, dense values (e.g., (1n << 100n) - 1n), and cross-check against the Kernighan fallback implementation.
- No platform-specific native code or WASM required; keep the code portable and easy to audit.

# Errors

- TypeError for malformed argument types and option shapes.
- RangeError for unequal-length segment sequences and negative integers.
- Error messages must include canonical substrings so tests can match reliably (string, options, normalize, segmentation, segmenter, length, non-negative).

# Tests and Documentation

Unit tests (tests/unit/) must cover the API with exact assertions and substring checks for errors:
- hammingDistance:
  - hammingDistance("karolin", "kathrin") === 3
  - hammingDistance("", "") === 0
  - hammingDistance("a", "bb") throws RangeError (message contains length or equal)
  - Normalization: hammingDistance("a\u0301", "á") === 1 without normalization and === 0 when options.normalize = "NFC"
  - Surrogate/astral characters treated as single positions (Array.from semantics)
  - Grapheme mode: when Intl.Segmenter is present, comparing user-perceived characters should treat grapheme clusters as comparison units; tests must assert both with and without normalize to demonstrate behavior parity.
- hammingDistanceBits:
  - hammingDistanceBits(1, 4) === 2
  - hammingDistanceBits(0, 0) === 0
  - Accept Number and BigInt inputs; throw TypeError for non-number/non-bigint; throw TypeError for non-integer Numbers; throw RangeError for negative values
- popcount and POPCOUNT_OPTIMIZATION:
  - popcount(0n) === 0
  - popcount(0xffn) === 8
  - popcount((1n << 100n) - 1n) === 100
  - popcount behaves identically to popcountKernighan for sampled values
  - popcount throws TypeError for Number input and RangeError for negative BigInt
- Cross-checks: for sampled pairs bx, by (Number or BigInt), assert popcount(bx ^ by) === hammingDistanceBits(bx, by)

README and examples
- README.md must document the three named exports with signatures and succinct examples, including the normalize and segmentation options.
- Provide deterministic example scripts in examples/ that import the functions from src/lib/main.js and print a single integer (or a single-line error message containing a canonical keyword) so unit tests and CI can run them reliably.

# Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError (message contains length or equal)
- hammingDistance("a\u0301", "á") returns 1 without normalization and 0 with options.normalize set to "NFC"
- Surrogate pairs and astral code points count as single positions
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits throws TypeError for non-number/non-bigint, TypeError for non-integer Numbers, and RangeError for negative values (message contains non-negative)
- popcount(0n) === 0, popcount(0xffn) === 8, popcount((1n << 100n) - 1n) === 100; passing a Number to popcount throws TypeError; negative BigInt throws RangeError
- popcount implementation uses a 256-entry byte lookup loop and has tests validating correctness and parity with the Kernighan fallback
- Unit tests in tests/unit/ exercise and assert the above behaviours and pass locally
- README contains API docs and concise usage examples for hammingDistance, hammingDistanceBits, and popcount

# Files to change (minimal set)

- src/lib/main.js — implement the three exports and CLI entrypoint if present; include the BYTE_POPCOUNT table and popcountKernighan fallback export (kept internal but testable)
- tests/unit/* — add or update unit tests to match deterministic error keywords, popcount parity tests, and core acceptance cases
- README.md — document API and examples
- examples/* — deterministic example scripts that import and demonstrate behaviour

# Notes

- Keep implementation small and dependency-free: use Array.from for code points and BigInt XOR + 256-byte lookup popcount for predictable performance.
- Error messages must include canonical keywords so tests can match reliably.
- Avoid platform-specific optimizations; the lookup-based popcount achieves acceptable performance and is simple to audit.
