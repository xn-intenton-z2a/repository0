NORMALISED EXTRACT

This source provides a simple JavaScript implementation of the Hamming distance for two equal-length strings.

Table of contents
- Function signature
- Input validation
- Core algorithm
- Time and space complexity
- Unicode / surrogate-pair limitation
- Implementation impact (how to adapt for code points)

Function signature
export default function hammingDistance(a, b)
Parameters
- a: string
- b: string
Returns
- number — the Hamming distance (count of positions where characters differ)

Input validation
- The implementation checks only that a.length === b.length.
- If lengths differ it throws an Error with message 'Strings must be of the same length'.
- The implementation does not validate that inputs are strings; passing non-strings will cause runtime behavior based on JavaScript indexing and may throw or coerce unexpectedly.

Core algorithm
- Initialize distance = 0.
- Iterate i from 0 to a.length - 1.
- At each index compare a[i] and b[i] using strict equality (a[i] !== b[i]).
- If unequal, increment distance by 1.
- After the loop return distance.

Time and space complexity
- Time: O(n) where n is the string length (number of UTF-16 code units in this implementation).
- Space: O(1) additional memory.

Unicode / surrogate-pair limitation
- The implementation compares UTF-16 code units by indexing a[i] and b[i].
- Characters represented by surrogate pairs (code points beyond U+FFFF) occupy two UTF-16 code units; indexing treats each code unit as a separate position. Therefore the implementation is not Unicode code-point aware and will produce incorrect results when strings contain characters outside the Basic Multilingual Plane.
- Normalisation (NFC/NFD) differences are not handled; canonically equivalent sequences may be treated as different.

Implementation impact (how to adapt for code points)
- To correctly handle Unicode code points, iterate strings by code points rather than by index. Two common approaches:
  - Use the string iterator (for (const cp of str) ...) which yields code points.
  - Use Array.from(str) or [...str] to obtain an array of code points and iterate by index after verifying equal code-point counts.
- Validation steps when adapting:
  - Verify both inputs are strings; otherwise throw TypeError.
  - Compute code-point sequences for both inputs; if sequence lengths differ, throw RangeError.
  - Compare code points at each position and count differences.
- Normalization: recommend normalizing both strings (String.prototype.normalize) to a chosen form (NFC) before code-point splitting when canonical equivalence matters.

Reference details (exact API and behavior from source)
- Source function: export default function hammingDistance(a, b)
- Parameter types expected by source: a: string, b: string (source does not enforce via typeof checks).
- Return type: number (integer >= 0).
- Exceptions from source: throws Error('Strings must be of the same length') when a.length !== b.length.
- Comparison performed: strict equality of a[i] and b[i] (UTF-16 code unit equality).

Supplementary details
- When adapting the algorithm to integers (bit-level Hamming distance) combine XOR and bit-count techniques (source set references in main SOURCES.md such as Kernighan's bit counting) to compute differing bits: distance = popcount(a XOR b).
- For BigInt inputs use BigInt-aware bit operations and Kernighan-style loop using BigInt arithmetic: while (x) { x &= x - 1n; count++; }
- When mixing Number and BigInt in APIs, coerce explicitly or provide separate functions to avoid implicit errors.

Detailed digest
- Source URL: https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/string/hamming-distance/hammingDistance.js
- Retrieved: 2026-03-18
- Bytes downloaded (raw file): 354
- Extracted sections used: function signature, validation, iterative comparison, error behaviour, algorithm complexity, Unicode limitation notes (derived from code pattern).

Attribution
- Source: trekhleb / javascript-algorithms repository (MIT license in upstream project). The extracted content above is a condensed technical extract limited to implementation details necessary to implement equivalent behaviour or to adapt it for Unicode correctness.
- Crawl size: 354 bytes (raw file)
