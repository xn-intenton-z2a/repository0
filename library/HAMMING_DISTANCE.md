HAMMING_DISTANCE

TABLE OF CONTENTS
1. Normalised Extract
  1.1 Formal definition and metric properties
  1.2 Binary/integer implementation pattern (XOR + popcount)
  1.3 Popcount algorithm options and masks
  1.4 String/Unicode considerations (JS specifics)
  1.5 String-based Hamming algorithms (code-point and grapheme modes)
2. Supplementary Details
  2.1 Performance guidance and complexity
  2.2 Memory, numeric and error handling considerations
3. Reference Details
  3.1 JavaScript API signatures and validation behaviour
  3.2 Popcount function signatures and implementation choices
  3.3 Fixed-width masks and hex values
  3.4 Errors, exceptions and edge-case handling (precise text)
4. Detailed Digest and Provenance
5. Attribution and Crawl Data

1. NORMALISED EXTRACT

1.1 Formal definition and metric properties
- Hamming distance between two equal-length sequences is the number of positions with differing symbols. For binary strings a and b of equal length: HammingDistance(a,b) = popcount(a XOR b).
- It is a metric: non-negativity, identity of indiscernibles, symmetry, triangle inequality. Implementations must enforce equal-length precondition and signal length-mismatch explicitly.

1.2 Binary/integer implementation pattern
- Validate inputs and convert to an unsigned representation that holds the operand range (use BigInt in JS for >32-bit).
- Compute v = x XOR y; compute count = popcount(v); return count (non-negative integer).

1.3 Popcount algorithm options and masks
- Masks for 64-bit parallel-add: m1=0x5555555555555555; m2=0x3333333333333333; m4=0x0f0f0f0f0f0f0f0f; m8=0x00ff00ff00ff00ff; m16=0x0000ffff0000ffff; m32=0x00000000ffffffff; h01=0x0101010101010101.
- Algorithms:
  - Parallel-add (tree) folding using masks and shifts.
  - Multiply-accumulate trick: after byte counts, (x * h01) >> 56 extracts total.
  - Wegner loop: while (x) { count++; x &= x - 1; } — O(popcount).
  - Lookup table: precompute 16-bit popcounts then sum.
  - Hardware intrinsics: POPCNT instruction or __builtin_popcount/__builtin_popcountll.

1.4 String/Unicode considerations (JS specifics)
- String.length counts UTF-16 code units; surrogate pairs occupy two units. For code-point-aware comparison iterate via for...of or Array.from (yields code-point strings). For grapheme clusters use Intl.Segmenter or a grapheme segmentation library.
- For code-point distance: make arrays of code-point strings and compare elementwise. For grapheme-aware distance: segment each string into grapheme clusters and compare sequences.

1.5 String-based Hamming algorithms (code-point and grapheme modes)
- Preconditions: both operands must be strings and must have equal element counts under chosen segmentation mode; otherwise throw RangeError('Strings must have the same length in code points') or an equivalent exact message per API contract.
- Array.from algorithm (code-point mode): ra = Array.from(a); rb = Array.from(b); if ra.length !== rb.length throw RangeError; count differences by elementwise compare; return count.
- Iterator simultaneous algorithm (code-point mode): create iterators aIter, bIter; loop: aNext = aIter.next(); bNext = bIter.next(); if aNext.done !== bNext.done throw RangeError; if aNext.value !== bNext.value increment count; continue until done; return count.

2. SUPPLEMENTARY DETAILS

2.1 Performance guidance
- Integer popcount: prefer hardware popcnt or compiler intrinsics; otherwise parallel-add or multiply-accumulate are best worst-case.
- Wegner loop is best when expected popcount is small.
- Lookup table trades memory for speed; 16-bit table (65536 entries) used for 32/64-bit splits.
- For JS: split BigInt into 32-bit/64-bit chunks or use BigInt-aware Wegner loop.

2.2 Memory and numeric considerations
- For large strings use streaming iterator algorithm to avoid O(n) extra memory.
- Validate numeric ranges and types: reject negative bit-strings when semantics expect unsigned; coerce or throw as per API.

3. REFERENCE DETAILS

3.1 JavaScript API signatures (canonical)
- function hammingDistanceInts(x: number|bigint, y: number|bigint): number
  - Behavior: coerce to appropriate integer type (uint32 via >>>0 for Number, or BigInt); compute v = x ^ y; return popcount(v).
  - Errors: throw TypeError for non-integer inputs; throw RangeError for negative values if not allowed.

- function hammingDistanceStrings(a: string, b: string, mode: 'codepoint'|'grapheme' = 'codepoint'): number
  - Behavior: segment strings according to mode; require equal element counts; compare elementwise; return count.
  - Errors: TypeError when inputs not strings; RangeError when segmented lengths differ.

3.2 Popcount signatures
- function popcount32(x: number): number // expects uint32 (0..2^32-1)
- function popcount64(x: bigint): number // expects bigint representing 64-bit unsigned value
- function popcountBigInt(x: bigint): number // arbitrary precision popcount; can slice into fixed-width chunks

3.3 Fixed-width masks and hex values
- m1  = 0x5555555555555555
- m2  = 0x3333333333333333
- m4  = 0x0f0f0f0f0f0f0f0f
- m8  = 0x00ff00ff00ff00ff
- m16 = 0x0000ffff0000ffff
- m32 = 0x00000000ffffffff
- h01 = 0x0101010101010101

3.4 Errors and edge-case handling (precise patterns)
- Strings: if segmentation lengths differ: throw RangeError('Strings must have the same length in code points') or similar exact message documented by implementer.
- Integers: reject NaN, Infinity; coerce finite Number to integer via ToInteger and then ToUint32/ToBigInt as appropriate, or throw TypeError.

4. DETAILED DIGEST AND PROVENANCE
Source: Wikipedia — Hamming distance and Hamming weight pages
URLs:
- https://en.wikipedia.org/wiki/Hamming_distance
- https://en.wikipedia.org/wiki/Hamming_weight
Retrieved: 2026-03-11T21:26:25.652Z
Extracted: formal definition, metric properties, XOR+popcount pattern, Wegner algorithm, popcount parallel-add and masks, lookup-table approach, hardware intrinsics, C/Python examples illustrating implementations.

5. ATTRIBUTION AND CRAWL DATA
Sources: Wikipedia (Hamming distance, Hamming weight). Crawl returned full page content; approximate retrieved content: Hamming_distance ~18 KB, Hamming_weight ~20 KB.