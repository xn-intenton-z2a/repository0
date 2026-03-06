# BATCH_SUPPORT

Summary

Add a batch/vectorized hammingDistances helper to the library that computes Hamming distances for many pairs in a single call. This feature makes the library practical for workflows that compare lists of values (e.g., bulk validation, metrics, or diff pipelines) and is implementable entirely inside src/lib/main.js as an additional named export.

Motivation

Users often need to compare large sets of identifiers, fingerprints, or strings in bulk; calling the single-pair functions in a loop is error-prone and duplicates validation. A small, well-documented batch API improves ergonomics, reduces boilerplate, and keeps input validation and Unicode/BigInt handling consistent across the codebase.

Specification

- Export a new named function: hammingDistances(aList, bList, options = {}). It must live in src/lib/main.js and be exported alongside hammingDistance and hammingDistanceBits.
- Inputs:
  - aList and bList: Arrays of equal length. Each element is either a string or an integer (Number or BigInt). Mixing types within a single position is allowed only if options.mode instructs how to interpret inputs; otherwise the mode is inferred per-position: two strings -> string mode, two numbers/BigInts -> bits mode.
  - options: an optional object supporting:
    - mode: "auto" (default), "string", or "bits". "auto" infers per-element; "string" forces codepoint-based string comparison (throws if non-strings encountered); "bits" forces integer bitwise comparison (throws if non-integers encountered).
    - parallelize: boolean (optional) — hint for implementations that want to use micro-optimizations; library implementation may ignore.
- Behavior:
  - Validate that aList and bList are arrays of the same length; otherwise throw RangeError.
  - Validate element types according to mode rules; throw TypeError when types mismatch requested mode (e.g., mode: "bits" but element is string).
  - For string comparisons, use the same Unicode code point logic as hammingDistance (count code points, not UTF-16 units) and throw RangeError for unequal-length code point strings.
  - For bits comparisons, accept Number or BigInt (respect the rules in BIGINT_SUPPORT). Coerce to BigInt only when needed to avoid precision loss.
  - Return an array of integers where each position is the Hamming distance for that pair.
  - Do not mutate inputs.

Edge Cases and Performance

- Empty input arrays return an empty array.
- Mixed-type arrays are allowed only in "auto" mode but each pair must be of the same comparable kind; a string paired with a number in the same index should throw TypeError in "auto" mode.
- Implementation must avoid loading large intermediate structures; it should stream/iterate elementwise.

Tests

- Add unit tests in tests/unit/main.test.js (or extend existing tests) covering:
  - Basic usage: hammingDistances(["karolin"], ["kathrin"]) => [3]
  - Multiple items: hammingDistances(["a","abc"], ["a","abd"]) => [0,1]
  - Bits mode: hammingDistances([1,4n], [4,5n]) => [2,2]
  - Auto mode mixed types: hammingDistances(["a", 1], ["b", 4]) with default auto should compute [1,2]
  - Forced mode errors: hammingDistances(["a"], ["b"], {mode:"bits"}) throws TypeError
  - Input length mismatch throws RangeError
  - Empty arrays return []

Acceptance Criteria

- hammingDistances is exported as a named export from src/lib/main.js
- hammingDistances(["karolin"],["kathrin"]) returns [3]
- hammingDistances([""],[""]) returns [0]
- hammingDistances([1],[4]) returns [2]
- hammingDistances([],[]) returns []
- Invalid mode/type combinations throw TypeError or RangeError as specified

Notes

- Keep the implementation small and reuse existing hammingDistance and hammingDistanceBits internals for correctness and test coverage.
- Document the new function in README.md with a short example and mention compatibility with BIGINT_SUPPORT and CLI_TOOL where relevant.
