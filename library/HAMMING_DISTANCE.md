HAMMING_DISTANCE

TABLE OF CONTENTS
1. NORMALISED EXTRACT
  1.1 Definitions
  1.2 Core algorithms and computational patterns
  1.3 Bitwise and population-count implementations
  1.4 JavaScript-specific considerations
  1.5 Length, encoding and equality policies
2. SUPPLEMENTARY DETAILS
  2.1 Encoding pipeline: string -> code points -> bytes
  2.2 Chunking, word size and streaming strategy
  2.3 Endianness, BigInt and machine-word conversions
  2.4 Performance notes and fallbacks
3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)
  3.1 Signatures for library functions and exact behavior
  3.2 popcount primitives and their contracts
  3.3 String handling contract and code point APIs
  3.4 BigInt and bitwise operations contract
4. TROUBLESHOOTING AND PROCEDURES
  4.1 Step-by-step algorithms and fallback checks
  4.2 Edge cases and input validation
5. SOURCE DIGEST AND RETRIEVAL METADATA
6. ATTRIBUTION AND CRAWL DATA


1. NORMALISED EXTRACT

1.1 Definitions
- Hamming distance: For two sequences A and B of equal length L, H(A, B) = count of positions i in [0..L-1] where A[i] != B[i].
- For binary bit-vectors representable as integers, H(A, B) = popcount(A XOR B). popcount is the number of 1 bits in the integer result.
- Minimum distance dmin: for a code with minimum Hamming distance d, the code can detect up to (d-1) substitutions and correct up to floor((d-1)/2) substitutions.
- Hamming weight: synonym for population count; number of 1 bits in a word.

1.2 Core algorithms and computational patterns (explicit, implementation-focused)
- Baseline byte-wise algorithm (O(L) time, minimal memory): iterate index i = 0..L-1; increment count when a[i] != b[i]. Use when inputs are short, or when avoiding bitwise conversions.
- XOR + popcount (word-oriented): process input in machine-word chunks (8/32/64-bit). For each word: diff = leftWord XOR rightWord; count += popcount(diff). Complexity O(ceil(L/wordSize)). Use for binary data and when popcount instruction or efficient software popcount is available.
- Wegner bit-scanning popcount (branching loop): For 32/64-bit val = x ^ y; while (val != 0) { val &= val - 1; ++count; } Complexity proportional to number of set bits in diff (good when Hamming distance small relative to word size).
- Builtin popcount intrinsics: where available, prefer hardware/popcount intrinsics for single-instruction speed. Example intrinsics: __builtin_popcount, __builtin_popcountll in GCC/Clang.
- Handling remainder bytes: process full words first, then handle trailing bytes with byte-wise compare or smaller-word popcount.

1.3 Bitwise and population-count implementations (explicit behaviors)
- popcount contract: accept unsigned integer (word-width) and return integer number of 1 bits in two's-complement representation considered as bit pattern. popcount(0) == 0. popcount range 0..wordWidth.
- Software popcount alternatives:
  - Precomputed 8-bit lookup table: split word into bytes, sum table[byte]. Memory-time tradeoff; deterministic performance.
  - SWAR (SIMD Within A Register) algorithm: parallel bit counting using arithmetic and masks for constant-time O(1) arithmetic operations per word.
  - Wegner loop: val &= val - 1 until zero; counts set bits; runtime proportional to number of set bits.
- Word-width choice:
  - 64-bit words preferable on 64-bit platforms; fall back to 32-bit for portability.
  - For very large sequences, use vectorized operations (SIMD) or library-specific bitset operations.

1.4 JavaScript-specific considerations (strings, code points, BigInt, bitwise ops)
- JavaScript string representation: sequence of UTF-16 code units. Characters outside BMP are surrogate pairs occupying two code units.
- For character-level Hamming distance between strings, iterate by Unicode code points rather than UTF-16 code units to avoid counting surrogate halves separately. Use for...of or spread operator to iterate grapheme code points; or compute code points via String.prototype.codePointAt when iterating indices and skip surrogates.
- String length mismatch: Hamming distance requires equal-length sequences; explicitly define what "length" means (code units vs code points vs grapheme clusters). Implementation must validate length according to chosen unit and throw or return an error when unequal.
- BigInt for wide bit operations: BigInt supports integer arithmetic and bitwise operators (except unsigned right shift >>>). BigInt is signed, supports &, |, ^, ~, <<, >> and arithmetic; mixing BigInt and Number in arithmetic is not allowed without explicit conversion. Use BigInt for very long bit-vectors when native typed arrays are not applicable.
- Bitwise operators in JS operate on 32-bit signed integers when applied to Number; for larger widths use BigInt and its bitwise operators.
- JSON and BigInt: JSON.stringify throws on BigInt unless custom replacer or toJSON is provided; plan serialization accordingly.

1.5 Length and encoding policies (implementation directives)
- Always define the unit of comparison in the public API: options.unit = 'bytes' | 'codeUnits' | 'codePoints' | 'graphemeClusters' | 'bits'. Default for byte/binary functions: bytes; for string functions: codePoints.
- Validate equal lengths under the chosen unit before computing distance; return explicit error/exception on mismatch.
- For strings with normalization differences, offer optional normalization (NFC/NFD) step prior to comparison. Provide options.normalize = 'NFC' | 'NFD' | false.


2. SUPPLEMENTARY DETAILS

2.1 Encoding pipeline: string -> code points -> bytes
- Steps for string Hamming distance (Unicode-aware):
  1. Optional normalization (NFC/NFD) if user requests to collapse equivalent code points.
  2. Iterate by Unicode scalar values (code points) using for...of or Array.from(str) to get code points as strings; alternatively use codePointAt when iterating indices but advance index by 2 when encountering surrogate pairs.
  3. Convert each code point to a canonical form for comparison (e.g., lowercasing with locale if needed) before equality check.
  4. Compare code-point elements pairwise.
- For binary data: accept typed arrays (Uint8Array) or Node.js Buffer. Compare raw bytes.

2.2 Chunking and streaming strategy
- For large buffers, compute in streaming chunks of size that are multiples of wordWidth to optimize alignment.
- Strategy: process chunkSize = k * wordBytes (e.g., 65536 bytes or 1 MiB depending on memory). For each chunk: load leftChunk and rightChunk, process word loops then remainder.
- Keep accumulators in a native integer (JS Number safe for counts up to 2^53-1). For extremely large streams, consider BigInt accumulator or checkpointing sum to avoid overflow beyond Number.MAX_SAFE_INTEGER.

2.3 Endianness and BigInt conversion
- When reading multi-byte words from buffers, decide on endianness for constructing word integers: use native DataView methods with explicit endianness (getUint32(offset, littleEndian)). For XOR-based Hamming distance, bit order inside word is immaterial so long as the same endianness is applied to both inputs.
- When converting a Uint8Array to a BigInt, use a consistent endianness and document it. Recommended: big-endian construction for human-intuitive mapping: value = (value << 8n) | BigInt(byte).

2.4 Performance notes and fallbacks
- Use platform intrinsics when available: Node.js native modules or WebAssembly can expose CPU popcount. In pure JS, prefer 32-bit chunking with table lookup or SWAR style bit twiddling.
- For small inputs (<128 bytes), simple byte-by-byte loop often outperforms complex vectorized paths due to overhead.
- Avoid creating intermediate large arrays when streaming; reuse buffers and work in-place where possible.


3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)

3.1 Signatures for library functions and exact behavior (plain-text declarations)
- hammingDistanceBytes(left: Uint8Array | Buffer, right: Uint8Array | Buffer, options?: {wordSize?: 32|64, chunkSize?: number}) -> number
  - Behavior: validates left.length === right.length; processes in word-sized chunks; uses XOR+popcount per word; returns integer count of differing bits if options.bitLevel === true, otherwise differing bytes when options.unit === 'bytes'. Default returns differing bytes when comparing byte arrays.
  - If options.bitLevel === true, returns Hamming distance in bits computed by popcount per word.

- hammingDistanceStrings(left: string, right: string, options?: {unit?: 'codePoints'|'codeUnits'|'graphemeClusters', normalize?: false|'NFC'|'NFD', locale?: string}) -> number
  - Behavior: when unit === 'codePoints' iterate by Unicode code points (for...of); validate equal code point counts; compare code points pairwise; return count of differing code points.
  - When normalize option provided, apply String.prototype.normalize(normalize) prior to iteration.

- hammingDistanceBitsBigInt(a: BigInt, b: BigInt, bitWidth?: number) -> number
  - Behavior: compute diff = a ^ b (BigInt XOR); if bitWidth provided, mask both operands with ((1n << BigInt(bitWidth)) - 1n) before XOR to limit width; return popcountBigInt(diff).
  - Note: BigInt bitwise ops are signed in semantics but operate on two's complement bit patterns; masking ensures expected finite-width behavior.

- popcount32(x: number) -> number
  - Contract: accepts a JS Number treated as unsigned 32-bit integer; returns number of set bits 0..32.

- popcount64(xHigh: number, xLow: number) -> number
  - Contract: accepts high and low 32-bit halves; returns popcount sum in 0..64. Useful when JS lacks native 64-bit integer types; combine two 32-bit popcounts.

- popcountBigInt(x: BigInt) -> number
  - Contract: returns number of 1 bits in the absolute bit representation of x; for negative x, caller should mask to intended bitWidth.

3.2 popcount primitives and usage patterns
- Preferred patterns (in descending order of performance/clarity depending on environment):
  1. Use native/popcount intrinsic via compiler or WASM if available.
  2. For Node.js in pure JS: use 32-bit chunking with builtin vpopcount via native addon or use a 256-entry table for nibble/byte popcounts.
  3. For portability in JS: precompute table[256] and compute popcount for each byte as table[byte]. For large buffers, sum table lookups per word.

3.3 String handling and code point APIs (JS specifics)
- String iteration: for (const ch of string) iterates by Unicode code points (handles surrogate pairs).
- String.prototype.codePointAt(index) -> returns numeric code point for code unit at index; if leading surrogate at index returns code point of pair; if trailing surrogate returns trailing surrogate code unit value.
- Use Array.from(string) or [...string] to get code-point granularity array of strings representing each code point.

3.4 BigInt and bitwise operations (JS specifics)
- BigInt literals: append n to integer literals (e.g., 123n) or BigInt(string). BigInt supports &, |, ^, ~, <<, >>; unsigned right shift >>> is unsupported for BigInt.
- When computing finite-width XOR on BigInt values, mask inputs: mask = (1n << BigInt(width)) - 1n; xMasked = x & mask; yMasked = y & mask; diff = xMasked ^ yMasked.
- Serializing BigInt: JSON.stringify fails by default; provide replacer or BigInt.prototype.toJSON to convert to strings when persisting.


4. TROUBLESHOOTING AND PROCEDURES

4.1 Step-by-step algorithms and fallback checks
- Byte-level Hamming (returning byte-differences):
  1. Ensure left.length === right.length.
  2. Choose wordWidth (64 if platform supports, 32 or 8 otherwise).
  3. For offset = 0; offset + wordBytes <= length; offset += wordBytes:
     a. Read leftWord, rightWord with DataView or typed-array view.
     b. diff = leftWord XOR rightWord.
     c. count += popcount(diff).
  4. Process trailing bytes byte-by-byte, comparing equality if unit is bytes, or popcount(xor) if unit is bits.

- Unicode string Hamming (code point unit):
  1. Optionally normalize both strings with String.prototype.normalize.
  2. Convert to arrays of code points: leftArr = Array.from(left); rightArr = Array.from(right).
  3. If leftArr.length !== rightArr.length throw new Error('Unequal length under codePoint unit').
  4. For i in 0..len-1: if leftArr[i] !== rightArr[i] ++count.

4.2 Edge cases and input validation
- If unit == 'bits' with byte arrays, require left.length === right.length and return bit-level Hamming by computing XOR per byte and using popcount lookup.
- If inputs are streams, ensure synchronization of chunk boundaries; compare chunk offsets consistently.
- For extremely long inputs, ensure accumulator does not overflow JS Number; if potential overflow, use BigInt accumulator or chunked partial sums persisted externally.


5. SOURCE DIGEST AND RETRIEVAL METADATA
- Sources consulted (as listed in project SOURCES.md):
  1. https://en.wikipedia.org/wiki/Hamming_distance (Hamming distance definition, coding-theory application, XOR+popcount equivalence, Wegner algorithm, builtin popcount intrinsics examples)
  2. https://en.wikipedia.org/wiki/Population_count (population count / Hamming weight definition)
  3. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#iterating_over_strings (JS string representation, UTF-16, code units vs code points, iteration strategies)
  4. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt (codePointAt behavior and surrogate handling)
  5. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt (BigInt operations, JSON serialization caveats, operator support and restrictions)
  6. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators (JS bitwise operator semantics and 32-bit truncation of Number-based bitwise ops)
  7. https://www.npmjs.com/package/hamming-distance (attempted but access returned HTTP 403 during fetch)

- Retrieval date: 2026-03-07 (content fetched on this date). Several MDN pages include last-modified metadata in their pages; local fetch responses were used to extract precise API contracts for String.codePointAt, BigInt operators, and bitwise operator behavior.
- Notes on fetched content: Wikipedia Hamming distance pages include explicit example algorithms (Python/C examples demonstrating byte-wise and XOR+popcount/Wegner loops); MDN pages include exact JS function semantics and operator restrictions.


6. ATTRIBUTION AND CRAWL DATA
- Attribution: content derived from public documentation and reference pages listed above (Wikipedia and MDN). Use these authoritative pages for formal citations when necessary.
- Crawl status and data notes:
  - Number of sources fetched: 6 (5 MDN/Wikipedia pages fully fetched; npm package page returned HTTP 403 and was not retrievable).
  - Some fetch responses were truncated by the fetch tool due to length limits; full pages are available at their canonical URLs.
  - Exact byte counts for fetched content are not available in this run. The retrieval succeeded for the following URLs: Wikipedia Hamming distance, Wikipedia Population count, MDN String page (iterating), MDN String.codePointAt, MDN BigInt, MDN Bitwise Operators. npm package fetch failed with HTTP 403.


END OF DOCUMENT
