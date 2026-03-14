TITLE: HAMMING_DISTANCE

TABLE OF CONTENTS
1. Definition
2. Constraints and input normalization
3. Algorithms
  3.1 Byte/bit-level XOR + popcount (recommended for binary data)
  3.2 Character/code-point comparison (recommended for Unicode-aware text)
  3.3 Streaming / large-input approach
4. Complexity
5. Implementation patterns and examples (language-agnostic)
6. Supplementary details
7. Reference details (API signatures and behavior)
8. Detailed digest (source: Wikipedia — Hamming distance) — retrieved 2026-03-14
9. Attribution and data size

NORMALISED EXTRACT
1. Definition
Hamming distance between two equal-length sequences is the number of positions at which the corresponding symbols differ. For binary words, it equals the number of differing bits.

2. Constraints and input normalization
- Inputs must be sequences of the same length. Decide and document behavior for unequal lengths: either throw, pad, or compute on prefix only.
- For text, decide whether to compare UTF-16 code units, Unicode code points, or normalized strings (NFC/NFD). Recommended: compare Unicode code points after explicit normalization when semantic equivalence matters.

3. Algorithms
3.1 Byte/bit-level XOR + popcount
- Convert both inputs to same byte representation (Buffer/Uint8Array). Iterate in machine-word size (32/64-bit) where possible; compute XOR for each word, then count set bits in XOR (popcount) and accumulate.
- Popcount options: hardware POPCNT, compiler intrinsic (__builtin_popcount / __builtin_popcountll), SWAR algorithm, table-lookup, or Kernighan method as fallback.

3.2 Character/code-point comparison
- Convert strings to code-point sequences (use for...of or codePointAt) and compare pairwise incrementing counter when values differ. Optionally normalize to NFC before iteration.

3.3 Streaming / large-input approach
- Stream inputs in equal-sized aligned chunks; for text ensure chunking does not split surrogate pairs (use code-point aware streaming). For binary, align to machine word boundaries for efficient XOR/popcount.

4. Complexity
- Time: O(n) where n is number of elements compared. Word-wise XOR reduces iteration count by word width but not asymptotic complexity.
- Space: O(1) additional if streaming; O(n) if materializing code-point arrays.

5. Implementation patterns
- Validate lengths or accept optional policy parameter (e.g., allowTruncate, padWith).
- For binary buffers: process as 64-bit words where available, handle tail bytes; use built-in popcount when available.
- For JS strings: iterate with for...of to yield code points; explicitly normalize if required and compare.
- Example API patterns:
  hammingDistanceBytes(a: Uint8Array, b: Uint8Array): number
  hammingDistanceCodePoints(a: string, b: string, {normalize=false}): number

6. Supplementary details
- When comparing textual data across normalization forms, perform Unicode normalization (NFC/NFD) before computing distances.
- Document whether comparison is case-sensitive and whether combining characters are considered separate code points.

REFERENCE DETAILS
- Language-agnostic signature:
  function hammingDistance(a, b) -> integer
  Preconditions: a and b are equal-length sequences (explicitly enforced or controlled via options)
  Behavior: throw error on unequal lengths unless option provided.

DETAILED DIGEST
Source: https://en.wikipedia.org/wiki/Hamming_distance — retrieved 2026-03-14
Data obtained: formal definition, requirement of equal-length sequences, relation to XOR+popcount, and typical uses in coding theory and distance metrics.

ATTRIBUTION
Source: Wikipedia — Hamming distance (CC BY-SA). Retrieved 2026-03-14. Data size retrieved: ~160 KB (HTML).