HAMMING_DISTANCE

TABLE OF CONTENTS
1. Normalised Extract
  1.1 Definitions
  1.2 Core algorithms
  1.3 Binary (bitwise) implementations
  1.4 Population count methods
  1.5 JavaScript specifics (APIs and behaviors)
  1.6 Unicode, normalization & grapheme handling
2. Supplementary details
  2.1 Encoding pipeline for string-to-byte Hamming distance
  2.2 Converting byte arrays to BigInt (endianness explicit)
  2.3 Chunking strategy for streaming/large inputs
  2.4 POP8 table initialization (exact loop)
3. Reference details (APIs, signatures, parameters, returns, effects)
  3.1 hammingDistanceBytes
  3.2 hammingDistanceWords32
  3.3 hammingDistanceBigInt
  3.4 popcount utilities
  3.5 normalizeAndCompareStrings and JS APIs
4. Supplementary specifications and configuration options
5. Troubleshooting and step-by-step procedures
6. Source digest and metadata
7. Attribution and crawl data size

1. NORMALISED EXTRACT

1.1 Definitions
- Hamming distance: for two sequences A and B of equal length L, H(A,B) = count of indices i in [0..L-1] where A[i] != B[i].
- Binary shortcut: for binary sequences represented as bit-vectors, H(A,B) = popcount(A XOR B) where popcount counts set bits.
- Length policy options (explicit semantics):
  - throw: raise an error if lengths differ.
  - pad-zero: treat shorter sequence as if padded with zero-valued bytes until lengths match.
  - overlap+extra: compute distance for minLen and add absolute length difference to result to account for unmatched bytes.

1.2 Core algorithms (implementation steps)
- Per-position compare (byte-wise): iterate index i from 0 to L-1; if a[i] !== b[i] then increment counter. Complexity O(L). Use for small inputs or constrained-allocation contexts.
- XOR + popcount (byte/word): for each unit (byte/word) compute diff = leftUnit XOR rightUnit; add popcount(diff) to accumulator. Suitable for medium-to-large buffers.
- Word-wise with fallback: operate on largest usable word size (Uint32 or BigUint64); process aligned portion by words; after aligned portion handle tail bytes with POP8 lookup.
- Streaming/chunked: for long/streamed inputs, process fixed-size chunks (multiple of word size), compute XOR/popcount per-chunk and accumulate.

1.3 Binary (bitwise) implementations
- Supported input containers: Uint8Array, ArrayBuffer, Buffer (Node), DataView, BigInt representations assembled from bytes.
- Byte-wise implementation: for each byte index i, compute x = a[i] ^ b[i]; result += POP8[x]; requires precomputed POP8[256].
- Word-wise implementation (Uint32): create Uint32Array view for aligned portion; for each word x = wordA ^ wordB; result += popcount32(x). Use unsigned coercion (>>> 0) before SWAR operations.
- BigInt implementation: assemble each operand as a BigInt using a documented endianness, compute diff = aBig ^ bBig, then count bits in diff using a BigInt-safe popcount (Kernighan loop or byte-splitting + POP8).
- Endianness rule: both operands must be assembled using the same endianness. Default recommendation: big-endian assembly for deterministic cross-platform interoperability unless interacting with platform APIs that require little-endian.

1.4 Population count methods (precise algorithms)
- POP8 lookup table: POP8[0..255] where POP8[i] = population count of 8-bit value i. Initialize once at module load.
- Kernighan algorithm: while x != 0 do x = x & (x - 1); increment counter. Works for Number (32-bit range) and BigInt (arbitrary-length).
- SWAR (32-bit, unsigned) sequence (exact operations):
  - x = x - ((x >>> 1) & 0x55555555)
  - x = (x & 0x33333333) + ((x >>> 2) & 0x33333333)
  - x = ((x + (x >>> 4)) & 0x0F0F0F0F) * 0x01010101 >>> 24
  - The final value is the 0..32 popcount of original x.
- 64-bit / BigInt: either split 64-bit values into bytes and use POP8, or use a BigInt Kernighan loop. Implementing SWAR-like operations with BigInt is possible by replacing numeric constants with BigInt literals and using BigInt shifts and masks.
- Hardware acceleration note: Systems with native POPCNT instructions (via WebAssembly or native addon) yield higher throughput for very large workloads.

1.5 JavaScript specifics (APIs and behaviors)
- Bitwise operators (| & ^ << >> >>>) operate on signed 32-bit integers after ToInt32 coercion. To treat values as unsigned 32-bit, use >>> 0.
- BigInt bitwise operators exist and operate on BigInt operands only; mixing Number and BigInt in bitwise expressions throws a TypeError.
- TextEncoder API: TextEncoder.encode(input: string) => Uint8Array containing UTF-8 bytes for input; deterministic output for normalized inputs.
- String.prototype.codePointAt: codePointAt(pos: number) => number | undefined; returns the full Unicode code point at position pos (handles surrogate pairs).
- String iteration: for (const ch of string) iterates Unicode code points (not UTF-16 code units) — safe for code point-level processing.
- Intl.Segmenter (grapheme segmentation): new Intl.Segmenter(locale?, { granularity: 'grapheme' }).segment(string) returns an iterable of segment objects for grapheme-level segmentation; use when comparing user-perceived characters.
- TypedArray alignment: TypedArray views require buffer.byteLength to be a multiple of element byte length; if not aligned, handle the unaligned prefix/suffix via DataView or byte-wise operations.

1.6 Unicode, normalization & grapheme handling
- Normalization forms: NFC, NFD, NFKC, NFKD. Apply identical normalization form to both inputs before byte-encoding to avoid mismatches due to canonical equivalence.
- Grapheme cluster comparison: to compare visible characters, segment strings into grapheme clusters (Intl.Segmenter) and compute Hamming distance across clusters rather than code points or bytes.
- Surrogate pairs and combining marks: avoid indexing strings by integer indices; prefer codePoint-aware iteration or UTF-8 byte encoding to prevent splitting surrogate pairs.

2. SUPPLEMENTARY DETAILS

2.1 Encoding pipeline for string-to-byte Hamming distance (explicit sequence)
- Step A: Normalize both inputs using chosen normalization: aN = a.normalize(normalizationForm); bN = b.normalize(normalizationForm).
- Step B: Encode normalized strings to bytes: aBytes = new TextEncoder().encode(aN); bBytes = new TextEncoder().encode(bN).
- Step C: Apply lengthPolicy: 'throw'|'pad-zero'|'overlap+extra'. Recommended default: 'overlap+extra'.
- Step D: Compute hammingDistanceBytes(aBytes, bBytes) via byte-wise XOR+POP8 or word-wise XOR+popcount.

2.2 Converting byte arrays to BigInt (endianness explicit)
- Big-endian assembly (recommended default): initialize big = 0n; for each byte b in bytes from index 0..n-1 do big = (big << 8n) | BigInt(b). Document this endianness as part of API contract.
- Little-endian assembly: iterate bytes in reverse order while shifting left by 8n each iteration, or use positional accumulation with increasing shifts. Ensure both operands use same scheme.
- When reconstructing bytes from BigInt for validation use inverse procedure and assert equivalence for round-trip verification in tests.

2.3 Chunking strategy (practical parameters and constraints)
- Default chunkSize: 65536 bytes (64 KiB). Must be a multiple of chosen word size (4 for Uint32, 8 for BigUint64) to simplify alignment.
- For each chunk pair: create aligned views, process words with popcount, then process tail bytes with POP8.
- Memory/throughput tradeoff: larger chunks reduce per-chunk overhead but increase peak memory; tune chunkSize based on environment.

2.4 POP8 table initialization (exact loop)
- Allocate POP8 = new Uint8Array(256).
- For i from 0 to 255: count = 0; v = i; while v != 0 do v = v & (v - 1); count++; POP8[i] = count.
- Keep POP8 as a module-level constant (single initialization) to avoid repeated computation.

3. REFERENCE DETAILS (APIS, SIGNATURES, PARAMETERS, RETURNS, EFFECTS)

3.1 Function: hammingDistanceBytes
- Signature: hammingDistanceBytes(a: Uint8Array, b: Uint8Array, options?: { lengthPolicy?: 'throw'|'pad-zero'|'overlap+extra', chunkSize?: number, wordSize?: 1|4|8, endianness?: 'big'|'little' }) => number
- Parameters:
  - a, b: Uint8Array (required).
  - options.lengthPolicy: default 'overlap+extra'.
  - options.chunkSize: default 65536. Must be multiple of options.wordSize.
  - options.wordSize: 1 (byte), 4 (Uint32), or 8 (BigUint64 via BigInt assembly); default 4 when environment supports efficient 32-bit operations.
  - options.endianness: affects BigInt assembly only; default 'big'.
- Behavior: validate types; if chunkSize provided, process buffers in chunks; for each aligned word compute XOR and add popcount; for tails compute byte-wise XOR with POP8; if policy is 'pad-zero' extend shorter buffer with zero bytes virtually; if 'throw' and lengths differ throw RangeError. Returns non-negative integer distance.
- Errors: TypeError for invalid types; RangeError for invalid chunkSize or negative values.

3.2 Function: hammingDistanceWords32
- Signature: hammingDistanceWords32(aBuf: ArrayBuffer|SharedArrayBuffer|Uint8Array, bBuf: ArrayBuffer|SharedArrayBuffer|Uint8Array, byteOffset?: number, byteLength?: number) => number
- Parameters: aBuf and bBuf are buffer-like; optional byteOffset and byteLength define identical-length slices. Implementation must ensure identical endianness for multi-byte reads.
- Behavior: create Uint32Array view over aligned region when possible; if region is not 4-byte aligned, use DataView.getUint32 to read words consistently; accumulate popcount32 on XORed words; process remaining bytes with POP8.
- Return: integer Hamming distance for the specified slice.

3.3 Function: hammingDistanceBigInt
- Signature: hammingDistanceBigInt(aBig: bigint, bBig: bigint) => number
- Parameters: two bigint values representing equal-length sequences assembled under documented endianness.
- Behavior: compute diff = aBig ^ bBig; count bits in diff using a BigInt-safe Kernighan loop: while diff != 0n { diff = diff & (diff - 1n); count++; } Return count as Number. Note: count may exceed Number.MAX_SAFE_INTEGER only for extremely large inputs; client should be aware.
- Performance: BigInt operations have allocation and cost overhead; prefer word-wise Uint32 routine for very large buffers.

3.4 Utility signatures
- popcount8(byte: number) => number  // 0..8, table-backed: return POP8[byte & 0xFF]
- popcount32(x: number) => number     // 0..32, implement SWAR using unsigned coercion (x >>> 0)
- popcountBigInt(x: bigint) => number // >=0, implement Kernighan using BigInt arithmetic

3.5 normalizeAndCompareStrings and JS APIs (explicit signatures)
- Signature: normalizeAndCompareStrings(a: string, b: string, options?: { normalization?: 'NFC'|'NFD'|'NFKC'|'NFKD', grapheme?: boolean, lengthPolicy?: 'throw'|'pad-zero'|'overlap+extra' }) => number
- Behavior: if options.grapheme true, create an Intl.Segmenter with granularity 'grapheme' and iterate segments to produce arrays of grapheme strings for a and b; if arrays lengths differ apply lengthPolicy; compute Hamming distance across clusters by comparing cluster strings for equality.
- Otherwise: apply normalization form (default 'NFC'), encode both with TextEncoder.encode to Uint8Array, then call hammingDistanceBytes with supplied lengthPolicy.
- JS API exact method forms referenced:
  - TextEncoder.encode(input: string) -> Uint8Array
  - String.prototype.codePointAt(pos: number) -> number | undefined
  - Intl.Segmenter constructor: new Intl.Segmenter([locale], { granularity: 'grapheme' }) and .segment(string) -> iterable of segment objects
  - BigInt literals and operations: use BigInt(value) or numeric literal with n suffix; BigInt bitwise operators accept only BigInt operands.

4. SUPPLEMENTARY SPECIFICATIONS AND CONFIGURATION OPTIONS
- Default normalization: 'NFC'.
- Default encoding: UTF-8 via TextEncoder.
- Default lengthPolicy: 'overlap+extra'.
- Default chunkSize: 65536 bytes (must be multiple of selected wordSize).
- Default wordSize: 4 (Uint32) for typical JS Number-based SWAR.
- Default endianness for BigInt assembly: 'big'. Document deviations explicitly in API contracts.
- POP8 must be a module-level constant, 256 entries, initialized once.

5. TROUBLESHOOTING AND STEP-BY-STEP PROCEDURES
- Symptom: visually identical strings yield non-zero distance.
  1. Ensure both strings use same normalization form by calling normalize on both with matching form.
  2. If strings contain combining marks or composed characters, try grapheme segmentation and compare clusters instead.
  3. Re-encode using TextEncoder and verify byte sequences are identical for equal inputs.

- Symptom: performance regression for large buffers.
  1. Verify implementation uses word-wise XOR and popcount32 instead of byte-by-byte loops.
  2. Ensure typed arrays are used to avoid per-byte JS array overhead.
  3. Increase chunkSize while monitoring memory usage; consider native or WebAssembly POPCNT for intense workloads.

- Symptom: inconsistent results when using BigInt assembly.
  1. Confirm both inputs are assembled using identical endianness and same byte ordering.
  2. Round-trip test: assemble bytes into BigInt then re-extract bytes; verify equality.
  3. Fall back to byte-wise comparison if endianness cannot be guaranteed.

6. SOURCE DIGEST AND METADATA
- Sources used and exact retrieval date: content consolidated from the following pages on 2026-03-07:
  - https://en.wikipedia.org/wiki/Hamming_distance
  - https://en.wikipedia.org/wiki/Population_count
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#iterating_over_strings
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
  - https://www.npmjs.com/package/hamming-distance
- Consolidated technical extraction size: approximately 18 KiB of distilled technical material.

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
