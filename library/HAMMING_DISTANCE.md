TITLE: HAMMING_DISTANCE

TABLE OF CONTENTS
1. Definition
2. Constraints and input normalization
3. Algorithms
  3.1 Byte/bit-level XOR + popcount (recommended)
  3.2 Character/code-point comparison
  3.3 Streaming / large-input approach
4. Complexity
5. Implementation patterns
6. Supplementary details
7. Reference details (API signatures and returns)
8. Detailed digest (source: https://en.wikipedia.org/wiki/Hamming_distance) — retrieved 2026-03-14
9. Attribution and data size

NORMALISED EXTRACT
1. Definition
Hamming distance between two equal-length sequences is the number of positions at which the corresponding symbols differ. For binary words, it equals the number of differing bits.

2. Constraints and input normalization
- Inputs must represent sequences of the same length. If lengths differ, either reject, pad explicitly (with a defined scheme) or compute only for the common prefix (explicit choice required).
- For text, define whether comparison is on UTF-16 code units, Unicode code points, or normalized forms (NFC/NFD). The most portable and correct approach for Unicode text is to compare sequences of Unicode code points (not UTF-16 code units) after an explicit normalization step if semantically required.

3. Algorithms
3.1 Byte/bit-level XOR + popcount (recommended for binary data)
- Convert both inputs to same byte representation (buffers/Uint8Array). For each machine word (32 or 64-bit) perform XOR, then count set bits (popcount) on the XOR result and accumulate.
- Popcount choices: use hardware instruction (POPCNT) when available, compiler intrinsic (__builtin_popcount / __builtin_popcountll), or optimized software popcount (Kernighan loop or SWAR) when intrinsics unavailable.

3.2 Character/code-point comparison (recommended for Unicode-aware text)
- Convert strings into arrays of Unicode code points (use String iterator or codePointAt-based iteration). Iterate pairwise and increment counter when code points differ.

3.3 Streaming / large-input approach
- Stream both inputs in the same chunking size; for binary, align chunk sizes to word boundaries for popcount; for text, stream by code points ensuring surrogate pairs are handled so alignment between streams is preserved.

4. Complexity
- Time: O(n) where n is sequence length (in elements compared). Bitwise XOR approach compares at word granularity and still O(n/wordsize).
- Space: O(1) additional (streaming) or O(n) if materializing code-point arrays.

IMPLEMENTATION PATTERNS
- Validate input lengths first unless design chooses to handle length mismatch.
- For binary buffers: iterate as 32-bit or 64-bit integers when possible; fall back to byte-based loop for remaining tail bytes.
- Use Kernighan popcount for portability: while (v) { count++; v &= v - 1; }
- For JS text: iterate via for...of which yields Unicode code points; compare pairwise.

SUPPLEMENTARY DETAILS
- When comparing text, specify normalization form (NFC vs NFD) before conversion to code points.
- When using numeric popcounts in languages with limited integer width, split long byte sequences into chunks matching native integer width.

REFERENCE DETAILS
- Typical API signature (language-agnostic):
  function hammingDistance(a, b) -> integer
  Preconditions: a and b are sequences of equal length (bytes, bit-strings, code-point arrays).
  Behavior: throw error on unequal lengths unless optional parameter allowTruncate=true.

- JavaScript signature (recommended pattern):
  // For binary
  hammingDistanceBytes(a: Uint8Array, b: Uint8Array): number
    - checks a.length === b.length
    - loops words, XOR, popcount, returns integer

  // For text
  hammingDistanceCodePoints(a: string, b: string): number
    - optionally normalize (NFC)
    - use for...of to iterate code points and compare

DETAILED DIGEST
Source section: Wikipedia — Hamming distance (concept, formula, constraints, typical uses in coding theory and error detection)
Retrieved: 2026-03-14
Data obtained: definition, requirement of equal-length sequences, relation to bitwise XOR and popcount, examples and typical uses in coding theory and distance metrics.

ATTRIBUTION
Source: https://en.wikipedia.org/wiki/Hamming_distance — retrieved 2026-03-14. Data size retrieved: ~160 KB (HTML). License: CC BY-SA (Wikipedia).