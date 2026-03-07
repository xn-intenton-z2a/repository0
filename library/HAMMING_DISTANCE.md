HAMMING_DISTANCE

Table of contents:
1. Normalised Extract
  1.1 Definitions
  1.2 Core algorithms
  1.3 Binary (bitwise) implementations
  1.4 Population count methods
  1.5 JavaScript specifics
  1.6 Unicode & string handling
2. Supplementary details
3. Reference API signatures and exact patterns
4. Troubleshooting and edge procedures
5. Source digest and metadata
6. Attribution and crawl data size

1. Normalised Extract

1.1 Definitions
- Hamming distance: for two equal-length sequences A and B, hd(A,B) = number of positions i where A[i] != B[i].
- Binary equivalence: For binary sequences, hd(A,B) = popcount(A XOR B). Popcount = number of 1 bits.
- Unequal lengths: choose one explicit policy: throw on mismatch, pad shorter input with zeros to match length, or compute over overlap and add |lenA - lenB| to the result. Implementations must document chosen policy.

1.2 Core algorithms
- Per-position compare: for i from 0 to n-1 increment when A[i] !== B[i]. Complexity O(n).
- XOR + popcount (byte/word): convert inputs to same binary representation (Uint8Array/Buffer/ArrayBuffer/BigInt). Compute XOR across aligned units and sum popcounts per unit. Complexity O(n/wordSize) operations plus popcount cost.
- Streaming/chunked: process in fixed-size chunks (e.g., 64 KiB) produced from input streams; for each chunk compute XOR and accumulate popcounts to bound memory.

1.3 Binary (bitwise) implementations
- Supported input types: Uint8Array, ArrayBuffer, DataView, Node Buffer, BigInt.
- Byte-wise algorithm: for index i in [0..len-1] compute x = a[i] ^ b[i]; count += POP8[x].
- Word-wise algorithm: process aligned words using Uint32Array or BigUint64Array where supported; for unaligned tails, fallback to byte-wise processing.
- BigInt algorithm: convert bytes to BigInt by shifting: big = (big << 8n) | BigInt(byte). Then diff = aBig ^ bBig; count bits in diff.
- Endianness: use identical view construction for both inputs. XOR and popcount on matching in-memory representations produce correct result; multi-byte word formation must be consistent across inputs.

1.4 Population count (popcount) methods
- Kernighan loop (works with Number and BigInt): while x != 0 { x &= (x - 1); count++; }
- Byte lookup table (POP8[0..255]): precompute POP8[i] = count bits in i. Use for 8-bit popcounts and to break words into bytes.
- SWAR 32-bit unsigned sequence (returns 0..32): x = x - ((x >>> 1) & 0x55555555); x = (x & 0x33333333) + ((x >>> 2) & 0x33333333); x = ((x + (x >>> 4)) & 0x0F0F0F0F) * 0x01010101 >>> 24; result = x >>> 0.
- 64-bit / BigInt: prefer splitting into bytes and using POP8 or implement SWAR-like using BigInt constants and BigInt shifts; Kernighan with BigInt is simple and robust.
- Hardware acceleration: POPCNT CPU instruction is fastest. In JS use WebAssembly or native addon compiled with popcnt to access hardware-accelerated popcount for large workloads.

1.5 JavaScript specifics
- Bitwise operators coerce to signed 32-bit integers; use >>> 0 to coerce to unsigned 32-bit for SWAR.
- BigInt bitwise operators exist and return BigInt; do not mix Number and BigInt in a single bitwise expression.
- Iterating strings: for (const ch of str) iterates Unicode code points, not UTF-16 code units. Avoid indexing str[i] for full code points.
- TextEncoder.encode(str) returns a Uint8Array of UTF-8 bytes for consistent byte-level comparisons.
- TypedArray alignment: when using Uint32Array or BigUint64Array ensure buffer.byteLength is divisible by element size or handle remainder bytes.

1.6 Unicode & string handling
- Normalization: apply a.normalize('NFC') (or chosen normalization) before byte encoding to ensure canonically equivalent strings compare consistently.
- Grapheme clusters: to compare user-perceived characters, segment strings into grapheme clusters (Intl.Segmenter or third-party library) and compare clusters rather than code points.
- Surrogate pairs: use code point iteration or TextEncoder to avoid splitting surrogate pairs.

2. Supplementary details

2.1 Encoding pipeline for string Hamming distance
- Normalize both strings: a2 = a.normalize('NFC'); b2 = b.normalize('NFC').
- Convert to bytes: aBytes = new TextEncoder().encode(a2); bBytes = new TextEncoder().encode(b2).
- Apply chosen length policy (throw/pad/truncate/overlap).
- Compute hammingDistanceBytes(aBytes, bBytes).

2.2 Converting byte arrays to BigInt (little-endian or big-endian must be documented)
- Big-endian assembly: big = 0n; for each byte in bytes: big = (big << 8n) | BigInt(byte).
- Little-endian assembly: big = 0n; for i from last to first: big = (big << 8n) | BigInt(bytes[i]).
- Ensure both inputs use same endianness when constructing BigInt.

2.3 Chunking strategy
- Prefer chunk sizes that are multiples of word size and CPU cache line (e.g., 64 KiB). For streaming inputs, XOR corresponding chunks and accumulate popcounts; carry remainder to next operation.

2.4 Popcount table initialization
- Create a single shared POP8 array of length 256 computed once at module load: for i in 0..255 compute Kernighan or prefill known values.

3. Reference API signatures and exact patterns

3.1 hammingDistanceBytes(a: Uint8Array, b: Uint8Array) => number
- Parameters: a, b: Uint8Array. Behavior: if different length, follow documented policy (throw | pad | overlap). Implementation: ensure same length L; result = 0; for i from 0 to L-1 { x = a[i] ^ b[i]; result += POP8[x]; } return result.

3.2 hammingDistanceWords32(aBuf: ArrayBuffer, bBuf: ArrayBuffer) => number
- Parameters: ArrayBuffer views representing equal-length data. Use Uint32Array views for the largest aligned portion; coerce using DataView when unaligned; after word loops process remaining bytes with POP8 lookups.

3.3 hammingDistanceBigInt(a: BigInt, b: BigInt) => number
- Parameters: a, b: BigInt. Implementation: diff = a ^ b; count = 0; while (diff !== 0n) { diff &= (diff - 1n); count++; } return count.

3.4 popcount utilities
- popcount8(x: number) => number: return POP8[x & 0xff].
- popcount32(x: number) => number: coerce x >>>= 0; apply SWAR sequence and return 0..32.
- popcountBigInt(x: BigInt) => number: use Kernighan loop with BigInt arithmetic.

3.5 normalizeAndCompareStrings(a: string, b: string) => number
- Steps: a2 = a.normalize('NFC'); b2 = b.normalize('NFC'); aBytes = new TextEncoder().encode(a2); bBytes = new TextEncoder().encode(b2); return hammingDistanceBytes(aBytes, bBytes) or grapheme cluster pipeline.

4. Troubleshooting and edge procedures
- Different encodings: always convert both inputs explicitly to the same byte encoding (UTF-8 via TextEncoder recommended) before byte-level hamming.
- Length mismatch: choose and document policy. To treat extras as mismatches: result += |lenA - lenB| after computing overlap distance.
- Surrogate/combining marks: to compare visible characters, segment into grapheme clusters; otherwise normalize to NFC and compare bytes.
- Performance: if JS-level loops are CPU-bound for large inputs, implement WebAssembly or native binding using CPU POPCNT and word-sized XOR loops.

5. Source digest and metadata
- Sources extracted: https://en.wikipedia.org/wiki/Hamming_distance; https://en.wikipedia.org/wiki/Population_count; MDN String iteration; MDN String.codePointAt; MDN BigInt; MDN Bitwise Operators; npm hamming-distance package page.
- Retrieval date: 2026-03-07
- Data obtained: consolidated technical content from the listed sources. Estimated total text size collected: ~18 KiB.

6. Attribution and crawl data size
- Attribution: Consolidated and normalized from the listed sources above; reuse governed by each source's license.
- Crawl data size: per-source pages small (approx 3–15 KiB each); total approx 18 KiB extracted.

End of document.
