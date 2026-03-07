HAMMING_DISTANCE

TABLE OF CONTENTS
1. Normalised Extract
  1.1 Definitions
  1.2 Core algorithms
  1.3 Binary (bitwise) implementations
  1.4 Population count methods
  1.5 JavaScript specifics
  1.6 Unicode & string handling
2. Supplementary details
  2.1 Encoding pipeline for strings
  2.2 Converting bytes to BigInt (endianness)
  2.3 Chunking strategy
  2.4 POP8 table initialization
3. Reference details (APIs, signatures, exact patterns)
  3.1 hammingDistanceBytes
  3.2 hammingDistanceWords32
  3.3 hammingDistanceBigInt
  3.4 popcount utilities
  3.5 normalizeAndCompareStrings
4. Supplementary specifications and configuration options
5. Troubleshooting and step-by-step procedures
6. Source digest and metadata
7. Attribution and crawl data size

1. NORMALISED EXTRACT

1.1 Definitions
- Hamming distance: For two sequences A and B of equal length L, H(A,B) = count of indices i in [0..L-1] where A[i] != B[i].
- Binary shortcut: For binary sequences represented as bit-vectors, H(A,B) = popcount(A XOR B), where popcount returns the number of 1 bits.
- Length policy options (choose one and document):
  - throw: raise an error if lengths differ.
  - pad-zero: treat missing bytes as zero until lengths match.
  - overlap+extra: compute distance over minLen, then add |lenA - lenB| to account for unmatched bytes.

1.2 Core algorithms (implementation directives)
- Per-position compare (byte-wise): iterate i from 0 to L-1; if a[i] !== b[i] then increment counter. Complexity O(L). Use for small inputs or when allocations must be minimal.
- XOR + popcount (byte/word): produce aligned views of input as bytes or words; for each unit compute diff = leftUnit ^ rightUnit; add popcount(diff) to accumulator. Best for medium-to-large buffers.
- Word-wise with fallback: operate on largest aligned word type supported (Uint32 for JS Numbers; BigUint64 where supported). After processing aligned portion, handle remaining tail bytes with byte-wise POP8 table.
- Streaming/chunked: for streams use fixed chunk sizes (multiple of word size); for each chunk compute XOR/popcount; accumulate across chunks to bound memory footprint.

1.3 Binary (bitwise) implementations
- Input types supported: Uint8Array, ArrayBuffer, Buffer (Node), DataView, BigInt representations.
- Byte-wise routine: for i in 0..L-1 compute x = a[i] ^ b[i]; result += POP8[x]; uses precomputed POP8 lookup table for 8-bit popcounts.
- Word-wise routine: create Uint32Array view over underlying buffer for aligned portion. Loop over words: x = wordA ^ wordB; result += popcount32(x). Use >>> 0 to ensure unsigned interpretation when applying SWAR.
- BigInt routine: assemble BigInt from bytes in consistent endianness, compute diff = aBig ^ bBig, then use a BigInt popcount method (Kernighan loop or split into bytes + POP8) to count bits.
- Endianness: when constructing multi-byte words or BigInt values, use the same endianness for both inputs; otherwise results are undefined. Prefer big-endian assembly for deterministic cross-platform representation unless system-level APIs require little-endian.

1.4 Population count methods (precise algorithms)
- POP8 lookup table: array POP8[256] where POP8[i] equals integer count of set bits in byte i. Initialize once at module startup.
- Kernighan loop (Number or BigInt): while x != 0 { x = x & (x - 1); count++; } safe for Numbers (32-bit) and BigInt (arbitrary length) though loop iterations equal to popcount.
- SWAR 32-bit sequence (unsigned):
  - Step 1: x = x - ((x >>> 1) & 0x55555555)
  - Step 2: x = (x & 0x33333333) + ((x >>> 2) & 0x33333333)
  - Step 3: x = ((x + (x >>> 4)) & 0x0F0F0F0F) * 0x01010101 >>> 24
  - Result: x >>> 0 yields integer 0..32.
- 64-bit / BigInt: either split 64-bit value into bytes and use POP8, or implement BigInt SWAR-like operations using BigInt constants and shifts. Kernighan with BigInt is simplest and correct.
- Hardware acceleration: native POPCNT is fastest. For very large workloads, use WebAssembly or native addon that performs word-sized XOR with POPCNT.

1.5 JavaScript specifics (implementation notes)
- Bitwise operators operate on signed 32-bit integers; use >>> 0 to coerce to unsigned 32-bit for SWAR and popcount32 sequences.
- BigInt bitwise operators are available and operate on BigInt types; never mix Number and BigInt in the same bitwise expression.
- Text encoding: TextEncoder.encode(string) -> Uint8Array of UTF-8 bytes. Use this for consistent byte-level comparison.
- Iterating strings: for (const ch of str) iterates full Unicode code points; avoid indexing str[i] if code points beyond BMP are possible.
- TypedArray alignment: when constructing typed views (Uint32Array, BigUint64Array), ensure buffer.byteLength is divisible by elementSize or handle remainder bytes explicitly.

1.6 Unicode & string handling (requirements)
- Unicode normalization: apply a.normalize('NFC') or chosen normalization form before encoding strings to bytes to ensure canonically equivalent sequences match.
- Grapheme cluster comparison: to compare user-visible characters, segment strings using Intl.Segmenter or a grapheme library; compute Hamming distance across clusters rather than code points or bytes.
- Surrogate pairs and combining marks: use code point iteration or TextEncoder to avoid splitting surrogate pairs; combining marks may require normalization or grapheme segmentation.

2. SUPPLEMENTARY DETAILS

2.1 Encoding pipeline for string-to-byte Hamming distance
- Step A: Normalize both inputs with chosen normalization: aN = a.normalize('NFC'); bN = b.normalize('NFC').
- Step B: Encode: aBytes = new TextEncoder().encode(aN); bBytes = new TextEncoder().encode(bN).
- Step C: Apply length policy. Recommended default: overlap+extra — compute distance over minLen then add abs(lenA - lenB) to account for extra bytes.
- Step D: Compute hammingDistanceBytes(aBytes, bBytes) using byte-wise XOR + POP8 or word-wise method for performance.

2.2 Converting byte arrays to BigInt (endianness explicit)
- Big-endian assembly (recommended for deterministic behavior):
  - big = 0n
  - for each byte in bytes from index 0 to end: big = (big << 8n) | BigInt(byte)
- Little-endian assembly: iterate bytes from last to first with same shift/OR pattern.
- Document which endianness is used; both operands must use the same.

2.3 Chunking strategy (practical parameters)
- Choose chunkSize = 64 * 1024 bytes (64 KiB) or larger multiples of word size for streaming.
- For each chunk pair: create typed views aligned to word size; process words; handle tail bytes; accumulate result; proceed until streams exhausted.

2.4 POP8 initialization (exact code outline)
- Allocate POP8 length 256. For i in 0..255 calculate count bits by Kernighan or table-driven assignment. Keep POP8 as module-level constant to avoid reallocation.

3. REFERENCE DETAILS (APIS, SIGNATURES, PARAMETERS, RETURNS, EFFECTS)

3.1 Function: hammingDistanceBytes
- Signature: hammingDistanceBytes(a: Uint8Array, b: Uint8Array, options?: {lengthPolicy?: 'throw'|'pad-zero'|'overlap+extra', chunkSize?: number}) => number
- Parameters:
  - a, b: Uint8Array (required).
  - options.lengthPolicy: default 'overlap+extra'.
  - options.chunkSize: default 65536 (bytes). Must be multiple of 4 for Uint32 word strategy, multiple of 8 for BigUint64 use.
- Behavior: validates inputs, optionally chunks buffers, computes XOR per unit and accumulates popcounts. Returns non-negative integer representing Hamming distance.
- Errors: throws TypeError if a or b are not Uint8Array; throws RangeError if options.chunkSize is invalid.

3.2 Function: hammingDistanceWords32
- Signature: hammingDistanceWords32(aBuf: ArrayBuffer|SharedArrayBuffer, bBuf: ArrayBuffer|SharedArrayBuffer, byteOffset?: number, byteLength?: number) => number
- Parameters: aBuf, bBuf: buffers with identical byteLength or documented policy applied; byteOffset/byteLength optional to specify a slice.
- Behavior: create Uint32Array views over the aligned portion; where alignment is not guaranteed use DataView.getUint32 to read words consistently; process words with popcount32 and then leftover bytes with POP8.
- Return: integer Hamming distance for the specified slice.

3.3 Function: hammingDistanceBigInt
- Signature: hammingDistanceBigInt(aBig: BigInt, bBig: BigInt) => number
- Parameters: two BigInt values representing same-length byte sequences assembled with a documented endianness.
- Behavior: compute diff = aBig ^ bBig; count bits in diff using Kernighan loop with BigInt arithmetic; return integer count.
- Performance note: BigInt operations have overhead; better for small numbers or when data is naturally represented as BigInts.

3.4 Utility signatures
- popcount8(byte: number) => number  // returns 0..8
- popcount32(x: number) => number     // returns 0..32, uses SWAR with unsigned coercion
- popcountBigInt(x: BigInt) => number // returns >=0, uses Kernighan with BigInt

3.5 normalizeAndCompareStrings
- Signature: normalizeAndCompareStrings(a: string, b: string, options?: {normalization?: 'NFC'|'NFD'|'NFKC'|'NFKD', grapheme?: boolean}) => number
- Behavior: if options.grapheme true, segment into grapheme clusters (Intl.Segmenter) and compute Hamming distance across clusters; else normalize and TextEncoder.encode to bytes and compute byte-level Hamming distance with chosen length policy.

4. SUPPLEMENTARY SPECIFICATIONS AND CONFIGURATION OPTIONS
- Default normalization: 'NFC'. Rationale: common canonical composed form.
- Default encoding: UTF-8 via TextEncoder.
- Default lengthPolicy: 'overlap+extra'. Rationale: preserves distance semantics for differing lengths while avoiding exceptions in streaming contexts.
- chunkSize default: 65536 bytes; must be multiple of chosen word size.
- POP8: single shared array precomputed at module init; no reallocation.
- Endianness: document as 'big-endian' for BigInt assembly by default; allow option to switch to 'little-endian' only when interoperating with system APIs that expect it.

5. TROUBLESHOOTING AND STEP-BY-STEP PROCEDURES
- Problem: Unexpected mismatch on visually identical strings that include combining marks.
  1. Verify both inputs are normalized with the same form (call normalize('NFC')).
  2. If comparing grapheme clusters, ensure segmentation is applied consistently.
  3. Re-encode with TextEncoder and re-run distance.
- Problem: Performance degradation for very large buffers.
  1. Verify implementation uses word-wise XOR and SWAR/popcount32 rather than byte-by-byte loops.
  2. Increase chunkSize to reduce loop overhead, ensuring memory fits.
  3. Consider compiling a WebAssembly module that performs word-sized XOR and uses POPCNT.
- Problem: Off-by-one/endian errors when using BigInt assembly.
  1. Confirm both inputs use identical endianness when assembling BigInts.
  2. Test with round-trip: assemble bytes -> BigInt -> re-extract bytes to verify ordering.
  3. Use byte-wise fallback when uncertain.

6. SOURCE DIGEST AND METADATA
- Items extracted verbatim into normalized technical content were taken from the following pages: Wikipedia Hamming distance, Wikipedia Population count, MDN documentation for String iteration, String.codePointAt, BigInt, Bitwise Operators, and the npm hamming-distance package page.
- Retrieval date: 2026-03-07
- Consolidated extracted text size: approximately 18 KiB of distilled technical material (summaries and algorithmic steps), derived from multiple small web pages.

7. ATTRIBUTION
- Source list:
  - https://en.wikipedia.org/wiki/Hamming_distance
  - https://en.wikipedia.org/wiki/Population_count
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#iterating_over_strings
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
  - https://www.npmjs.com/package/hamming-distance
- Crawl data size estimate: per-source pages 3–15 KiB; total consolidated extraction approx 18 KiB.

End of document.
