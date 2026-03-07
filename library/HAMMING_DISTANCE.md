HAMMING_DISTANCE

Table of contents:
1. Definitions
2. Core Hamming distance algorithms
3. Binary (bitwise) implementations
4. Population count (popcount) methods
5. JavaScript-specific details and pitfalls
6. Unicode and string handling
7. BigInt usage patterns
8. Performance and implementation best practices
9. Troubleshooting and edge cases
10. Supplementary technical specifications
11. Reference API signatures and exact patterns
12. Source digest and metadata

1. Definitions
Hamming distance: for two equal-length sequences A and B, the Hamming distance is the number of positions i where A[i] != B[i].
For binary sequences, Hamming distance equals the population count (number of 1 bits) in the bitwise XOR of the sequences: Hamming(A,B) = popcount(A XOR B).
When sequences differ in length, options are: (a) define distance undefined, (b) pad the shorter sequence with zeros to match length, or (c) operate on overlapping portion and add remaining length as differing positions. Implementation must select and document one behavior.

2. Core Hamming distance algorithms
- Per-position compare (generic sequences): iterate positions i from 0..n-1 and increment count when A[i] !== B[i]. Complexity O(n) comparisons.
- XOR+popcount (binary data): convert inputs to numeric types or byte arrays; compute XOR for aligned words/bytes and sum popcounts of each word/byte. Complexity O(n/wordSize) operations + popcount costs.
- Streaming/large-data: process in chunks (e.g., 64KiB) to limit memory and maintain throughput; XOR each chunk and accumulate popcounts.

3. Binary (bitwise) implementations
- Input forms supported: Uint8Array, ArrayBuffer, DataView, Buffer (Node.js), BigInt.
- Byte-wise algorithm (Uint8Array): for i from 0..len-1 do x = a[i] ^ b[i]; result += popcount8(x).
- Word-wise algorithm (32-bit/64-bit): read aligned words (Uint32Array or BigUint64Array where available), compute wordXor = aWord ^ bWord; result += popcountWord(wordXor).
- BigInt algorithm: represent binary sequences as BigInt values, compute diff = aBigInt ^ bBigInt; result = popcountBigInt(diff). Must ensure both BigInts have same effective bit-length or account for extra high bits.
- Endianness: when slicing ArrayBuffer into typed views, choose consistent endianness for multi-byte word formation; XOR and popcount are endianness-agnostic if applied on identical representations for both inputs.

4. Population count (popcount) methods
Include exact algorithmic operations and return types.
- Kernighan's method (loop clearing lowest set bit):
  while (x !== 0) {
    x = x & (x - 1);
    count++;
  }
  Returns integer count. Works for Numbers (coerced 32-bit) and BigInt with BigInt arithmetic.
- Byte lookup table (table[0..255]): precompute table where table[i] = number of 1 bits in byte i. Use for popcount8 and for word popcount split into bytes.
  Example usage pattern: count += table[x & 0xff]; x >>>= 8; repeat for each byte. Returns integer.
- SWAR (parallel bit count) for 32-bit unsigned integers using unsigned shifts and masks (returns 0..32):
  x = x - ((x >>> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  x = ((x + (x >>> 4)) & 0x0F0F0F0F) * 0x01010101 >>> 24;
  Return x (32-bit count). Uses unsigned right shift >>> and integer masking. Input must be coerced to unsigned 32-bit.
- 64-bit SWAR variant for BigInt is analogous but requires 64-bit constants and BigInt operators; prefer using byte lookup with BigInt shifts or split into 32-bit halves.
- Hardware acceleration: modern CPUs provide POPCNT instruction; for high-throughput JS use WebAssembly module compiled with popcnt intrinsics or use native addons to access hardware popcnt. Node.js Buffers with native bindings can be fastest.

5. JavaScript-specific details and pitfalls
- Bitwise operators on Number: JavaScript bitwise operators coerce operands to signed 32-bit integers; results are Numbers in range -2^31..2^31-1. For unsigned behavior use >>> 0 to coerce to unsigned 32-bit.
- BigInt and bitwise: BigInt supports bitwise operators on BigInts (e.g., aBigInt ^ bBigInt) and returns BigInt; mixing Number and BigInt with bitwise operators throws TypeError. Always ensure operand types match.
- Iterating strings: use for (const ch of str) or Array.from(str) to iterate Unicode code points rather than UTF-16 code units; avoid indexing str[i] for code points outside BMP.
- codePointAt(index): returns numeric Unicode code point for code unit index; returns undefined if index out of range. To iterate by code points prefer for...of.
- TextEncoder / TextDecoder: to compute binary hamming distance over UTF-8 bytes, use TextEncoder.encode(str) to obtain Uint8Array. Consistent encoding is required on both inputs.
- TypedArray alignment: reading as Uint32Array requires buffer.byteLength % 4 === 0 or careful tail handling. Handle leftover bytes after bulk word operations.
- Performance note: avoid per-code-point string concatenation in loops for large inputs; prefer byte-level operations on TypedArrays for throughput.

6. Unicode and string handling
- Normalization: Unicode strings may be visually equivalent but different byte/sequence representations (NFC vs NFD). For canonical equivalence, normalize both strings with String.prototype.normalize('NFC') before comparison.
- Grapheme clusters: Hamming distance over user-perceived characters requires segmentation into grapheme clusters (Intl.Segmenter or external library) and comparing clusters as units; this is different from code point distance.
- Recommended pipeline for string Hamming on visible characters: normalize to NFC, segment into grapheme clusters, encode clusters into a canonical byte representation or compare cluster-by-cluster.
- Surrogate pairs: indexing a surrogate pair with str[i] will yield half of the pair; use code point iteration techniques to avoid miscount.

7. BigInt usage patterns
- Convert an integer or byte sequence to BigInt: build by shifting and adding: big = (big << BigInt(8)) | BigInt(byte).
- XOR and popcount on BigInt: diff = aBig ^ bBig; count bits using Kernighan style with BigInt arithmetic: while (diff !== 0n) { diff &= (diff - 1n); count++; } returns Number (safe up to ~2^53 bits count value but count itself is small relative to length).
- Beware mixing Number and BigInt in arithmetic or bitwise operations; use BigInt literals (suffix n) and BigInt constructors.

8. Performance and implementation best practices
- For general-purpose JS implementation on Node/V8: use Buffer/Uint8Array and byte-wise XOR + 8-bit lookup table for popcount for a good balance of simplicity and speed.
- For very large inputs or high-performance needs: process aligned 64-bit words in WebAssembly or use native C/C++ addon exposing popcnt-based implementation; ensure memory copy overhead is minimized.
- Chunking strategy: choose chunk size (e.g., 64KiB or multiple of CPU cache line) and process in loop to keep memory footprint bounded and leverage vectorized CPU optimizations in lower-level code.
- Pre-alloc tables once (e.g., 256-entry byte popcount) and reuse across calls.
- Avoid per-byte function calls inside hot loops; inline arithmetic and table indexing.

9. Troubleshooting and edge cases
- Different encodings: if inputs use different encodings (UTF-8 vs UTF-16), convert both to same byte representation with TextEncoder.
- Unequal lengths: define behavior explicitly; common pattern is to throw or to treat extra trailing symbols as mismatches.
- Surrogate and combining marks produce unexpected counts if iterating code units: use code point or grapheme cluster iteration.
- Negative numbers and sign-extension: when constructing words from signed integers, ensure unsigned interpretation (>>> 0) before XOR and popcount.
- BigInt shift overflow: shifting BigInt left grows bit-length; when converting from byte arrays ensure consistent bit ordering.

10. Supplementary technical specifications
- TextEncoder.encode(input: string): returns Uint8Array of UTF-8 bytes.
- String.prototype.normalize(form?: string): returns normalized string; form defaults to 'NFC'.
- String.prototype.codePointAt(pos: number): returns number | undefined. Use for reading code points from a code unit index.
- for (const ch of str): iterates Unicode code points (handles surrogate pairs).
- BigInt(value): returns a BigInt constructed from number or string. BigInt literals: 123n.
- Bitwise operators on Numbers: &, |, ^, ~, <<, >>, >>> operate on 32-bit signed integers and return Number. >>> is unsigned right shift.

11. Reference API signatures and exact patterns
- hammingDistanceBytes(a: Uint8Array, b: Uint8Array) => number
  Validate lengths (throw or define padding). For i in 0..len-1: x = a[i] ^ b[i]; count += POP8[x]; return count.
- hammingDistanceWords32(aBuf: ArrayBuffer, bBuf: ArrayBuffer) => number
  Use Uint32Array views for aligned portions, process tails as bytes.
- hammingDistanceBigInt(a: BigInt, b: BigInt) => number
  diff = a ^ b; count = 0; while (diff !== 0n) { diff &= (diff - 1n); count++; } return count.
- popcount8(x: number) => number  (0..8)
  Use precomputed table lookup: POP8[x & 0xff]
- popcount32(x: number) => number (0..32)
  Use SWAR sequence exactly as specified in section 4. Ensure x >>>= 0 to coerce to unsigned.
- normalizeAndCompareStrings(a: string, b: string) => number
  a2 = a.normalize('NFC'); b2 = b.normalize('NFC'); aBytes = new TextEncoder().encode(a2); bBytes = new TextEncoder().encode(b2); return hammingDistanceBytes(aBytes, bBytes) (or apply grapheme cluster pipeline if comparing visible characters).

12. Source digest and metadata
- Sources consulted (as listed in repository SOURCES.md):
  - https://en.wikipedia.org/wiki/Hamming_distance
  - https://en.wikipedia.org/wiki/Population_count
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#iterating_over_strings
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
  - https://www.npmjs.com/package/hamming-distance
- Retrieval date: 2026-03-07
- Data size obtained during crawling: not available in local run; source pages are standard small docs (typical sizes 3–15 KiB each). Include precise byte counts when running network fetch.
- Attribution: content consolidated and normalized from the listed sources; reproduce and reuse under each source's license.

Attribution and crawl metadata:
- Created from SOURCES.md entries on 2026-03-07.
- Document size (approx): 18 KiB text.
- Files referenced: 7 URLs as listed above.

End of HAMMING_DISTANCE document.
