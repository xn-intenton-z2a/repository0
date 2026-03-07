HAMMING_DISTANCE

TABLE OF CONTENTS
1. Normalised Extract
  1.1 Definitions
  1.2 Core algorithms
  1.3 Bitwise and population-count implementations
  1.4 JavaScript specifics (strings, code points, BigInt, bitwise ops)
  1.5 Length and encoding policies
2. Supplementary details (specs and implementation guidance)
  2.1 Encoding pipeline: string -> bytes
  2.2 Chunking and streaming strategy
  2.3 Endianness and BigInt conversion
  2.4 Performance notes and fallbacks
3. Reference details (APIs, signatures, parameters, return types, exact patterns)
  3.1 hammingDistanceBytes(bufferA, bufferB, options)
  3.2 hammingDistanceWords32(left, right, options)
  3.3 hammingDistanceBigInt(a, b, bitWidth)
  3.4 popcount(value) / popcount64(value)
  3.5 String handling and codePoint APIs (JS signatures)
  3.6 BigInt APIs and restrictions
4. Troubleshooting and step-by-step procedures
5. Source digest and retrieval metadata
6. Attribution and crawl data


1. NORMALISED EXTRACT

1.1 Definitions
- Hamming distance: For two sequences A and B of equal length L, H(A,B) = count of indices i in [0..L-1] where A[i] != B[i].
- Binary shortcut: For bit-vectors represented as integers, H(A,B) = popcount(A XOR B), where popcount counts set bits in the XOR result.
- Minimum distance (dmin): used in coding theory to determine error-detection and error-correction capability. A code with minimum distance d can detect up to d-1 substitutions and correct up to floor((d-1)/2) substitutions.

1.2 Core algorithms
- Byte-wise per-position compare (baseline): iterate i from 0..L-1; if a[i] !== b[i] then ++count. Complexity O(L). Use for small inputs or when allocation/bit-manipulation not desirable.
- XOR + popcount (preferred for binary/bit sequences): for each machine word compute diff = leftWord XOR rightWord; add popcount(diff) to accumulator. Complexity O(ceil(L/wordSize)).
- Wegner loop (bit-scanning popcount): Given val = x ^ y; while (val != 0) { val &= val - 1; count++; } This runs proportional to the Hamming weight (number of set bits) and is efficient when diff has few 1s.
- Hardware popcount intrinsic: On platforms with popcount instruction use compiler intrinsics (e.g., GCC/Clang: __builtin_popcount, __builtin_popcountll) for 32/64-bit words; yields best throughput.
- Big-Word processing: Process largest aligned word type available (32-bit words in JS bitwise ops, BigInt for >32-bit) then handle remaining tail bytes.

1.3 Bitwise and population-count implementations
- Wegner bitclear algorithm: repeated val &= val - 1; increments count each iteration until val == 0. Correctness: removes lowest-order set bit each loop.
- Builtin intrinsics: __builtin_popcount(unsigned int) -> int (32-bit popcount); __builtin_popcountll(unsigned long long) -> int (64-bit popcount).
- XOR then builtin-popcount pattern: hamming = popcount(x ^ y).
- Popcount table (byte lookup): Precompute POP8[0..255] = popcount(byte). For each byte in diff, sum POP8[byte]. Use for portable implementations where intrinsics unavailable.

1.4 JavaScript specifics (strings, code points, BigInt, bitwise ops)
- Strings in JS are sequences of UTF-16 code units. Indexing and length operate on UTF-16 code units, not Unicode code points or grapheme clusters.
- Iteration semantics:
  - for...of and spread operator iterate by Unicode code points (handles surrogate pairs as single items).
  - String.prototype.codePointAt(index) returns the code point at index; if index is a high surrogate it returns the surrogate pair code point; if index is trailing surrogate it returns the trailing surrogate code unit.
- Implication for Hamming distance on textual data: choose iteration level explicitly: UTF-16 code-unit comparison (char-wise) vs. Unicode code point comparison vs. grapheme cluster comparison. For stable, cross-platform byte-level Hamming distance, normalize string (NFC or specific normalization) then TextEncoder('utf-8') to bytes and compare bytes.
- Bitwise operators in JS operate on 32-bit signed integers for Number operands: &, |, ^, <<, >>; unsigned right shift >>> exists but bitwise operators coerce Number to 32-bit signed int. BigInt supports bitwise operators & | ^ ~ << >> but not >>> and BigInt and Number cannot be mixed in arithmetic/bitwise expressions.
- BigInt usage: create by appending n or BigInt("123"). BigInt supports bitwise XOR/AND/OR and shifts. Beware: unsigned-right-shift operator is unsupported for BigInt; mixing BigInt and Number throws.
- JSON: JSON.stringify throws on BigInt; implement replacer or toJSON to serialize BigInt values.

1.5 Length and encoding policies
- Equal-length requirement: classical Hamming distance assumes sequences of equal length. Implementation options for differing lengths:
  - throw: raise an error if lengths differ.
  - pad-zero: treat the shorter sequence as zero bytes appended until lengths match.
  - overlap+extra: compute distance over minLen then add abs(lenA - lenB) to account for unmatched trailing elements.
- Encoding pipeline for text: specify Unicode normalization form (e.g., NFC) before encoding; then encode to bytes using UTF-8 (TextEncoder) to get a deterministic byte sequence across environments.


2. SUPPLEMENTARY DETAILS

2.1 Encoding pipeline: string -> bytes
- Step 1: Normalise input strings to chosen Unicode Normalization Form (NFC recommended unless application requires otherwise): normalized = str.normalize('NFC').
- Step 2: If comparison should be case-insensitive, apply locale-aware mapping or Intl.Collator for canonical comparison; avoid simple toLowerCase/toUpperCase for non-Latin text.
- Step 3: Convert normalized string to bytes using TextEncoder('utf-8') in JS or equivalent encoder. Compare byte buffers with byte-wise or XOR+popcount approaches.
- Rationale: UTF-8 byte representation is stable across platforms and allows straightforward bitwise comparison.

2.2 Chunking and streaming strategy
- When inputs exceed available memory or very large buffers are expected, process in fixed-size chunks (e.g., 64KiB or 4KiB) and stream: read chunkA, chunkB; if using XOR+popcount, convert per-chunk to word-aligned integers where possible; accumulate count; handle chunk-boundary alignment for word-size processing.
- Maintain a carry or leftover tail between chunks for word-boundary alignment.

2.3 Endianness and BigInt conversion
- When converting byte arrays into multi-byte words or BigInt, define endianness explicitly. Typical canonical choice: big-endian for lexicographic portability or little-endian to match native CPU representation; but ensure both sides use same convention.
- BigInt construction from bytes (big-endian): acc = 0n; for (byte of bytes) { acc = (acc << 8n) | BigInt(byte); }
- For little-endian: process bytes in reverse and shift accordingly.

2.4 Performance notes and fallbacks
- Prefer built-in hardware popcount (intrinsic) where available; fallback to Wegner loop or POP8 lookup table when unavailable.
- In JS, use 32-bit word XOR and use Math.imul/TypedArray DataView to load 32-bit words if manual optimization is required; otherwise per-byte TextEncoder output plus POP8 table is portable and predictable.
- For low Hamming weight differences, Wegner loop on diff integers is often faster than iterating all bits.


3. REFERENCE DETAILS (APIs, signatures, returns, patterns)

3.1 hammingDistanceBytes(bufferA, bufferB, options)
- Signature: hammingDistanceBytes(bufferA: Uint8Array, bufferB: Uint8Array, options?: { lengthPolicy?: 'throw'|'pad-zero'|'overlap+extra', popcount?: 'builtin'|'pop8'|'wegner' }) : number
- Parameters:
  - bufferA, bufferB: byte arrays of possibly different lengths.
  - options.lengthPolicy: defines behaviour for unequal lengths (default: 'throw').
  - options.popcount: choose implementation: 'builtin' attempts platform popcount; 'pop8' uses byte lookup table; 'wegner' uses bitclear loop.
- Return: integer Hamming distance (non-negative).
- Effects: deterministic; does not mutate inputs.
- Implementation pattern: if using popcount table: for (i = 0; i < minLen; ++i) { diff = bufferA[i] ^ bufferB[i]; count += POP8[diff]; } then handle tail per lengthPolicy.

3.2 hammingDistanceWords32(left, right, options)
- Signature: hammingDistanceWords32(left: Uint8Array|ArrayBuffer, right: Uint8Array|ArrayBuffer, options?: { byteOffset?: number, length?: number, littleEndian?: boolean }) : number
- Purpose: perform word-aligned 32-bit XOR + popcount using DataView.
- Implementation: iterate over 4-byte words using DataView.getUint32(offset, littleEndian), compute diff ^ and use popcount32(diff) accumulated; handle leftover bytes with POP8 lookup.

3.3 hammingDistanceBigInt(a, b, bitWidth)
- Signature: hammingDistanceBigInt(a: BigInt, b: BigInt, bitWidth?: number) : number
- Behaviour: computes popcount(a ^ b) across provided bitWidth if specified; if bitWidth provided, mask = (1n << BigInt(bitWidth)) - 1n; diff = (a ^ b) & mask; return popcountBigInt(diff).
- popcountBigInt: iterate that repeatedly clears lowest bit (wegner) or slice into 64-bit chunks and use builtin popcount on Number representations when safe.
- Note: BigInt bitwise operators supported: &, |, ^, ~, <<, >>; unsupported: >>>.

3.4 popcount utilities
- Signature: popcount32(x: number) : number
  - Use __builtin_popcount when compiling native; in JS emulate via table or Kernighan loop: x = x - ((x >>> 1) & 0x55555555); x = (x & 0x33333333) + ((x >>> 2) & 0x33333333); x = ((x + (x >>> 4)) & 0x0F0F0F0F); return (x * 0x01010101) >>> 24; (32-bit SW algorithm)
- Signature: popcount64(x: BigInt) : number
  - Use loop: count = 0; while (x !== 0n) { x &= x - 1n; ++count; }
- POP8 table: POP8[0..255] initialised as literal array where POP8[i] = number of set bits in i.

3.5 String handling and codePoint APIs (JS signatures)
- String.prototype.codePointAt(index: number) -> number | undefined
  - Returns code point at index; if index points to leading surrogate returns combined code point; if trailing surrogate returns code unit value; out-of-range returns undefined.
- Iteration:
  - for (const cp of str) { /* cp is a string representing a code point */ } uses String.prototype[Symbol.iterator] which iterates by code points.
- Normalization: str.normalize(form?: 'NFC'|'NFD'|'NFKC'|'NFKD') -> normalized string.
- TextEncoder: new TextEncoder().encode(str) -> Uint8Array (UTF-8 bytes).

3.6 BigInt APIs and restrictions
- BigInt(value) -> bigint; literal syntax: 123n
- BigInt.asIntN(width: number, bigint: bigint) -> bigint; BigInt.asUintN(width, bigint) -> bigint
- BigInt operators: + - * / % ** unary -; bitwise: &, |, ^, <<, >>, ~; unsupported: >>> (unsigned right shift)
- JSON serialization: JSON.stringify will throw on encountering BigInt; use replacer or BigInt.prototype.toJSON to override.


4. TROUBLESHOOTING AND STEP-BY-STEP PROCEDURES
- If result is unexpectedly large for textual inputs: verify normalization and encoding pipeline; compare byte sequences from both sides (hex dump) to spot normalization/casing mismatches.
- If Hamming distance for binary integers appears wrong: confirm correct word alignment and endianness when packing bytes into words or BigInts; check masking for bitWidth.
- If using BigInt and encountering TypeErrors: verify no mixing of Number and BigInt in expressions; coerce consistently.
- If performance is poor: profile per input size. For small inputs (< few KB) byte-wise loop may be fastest due to lower setup costs; for large buffers, use word-wise XOR + hardware popcount or vectorized SIMD where available.


5. SOURCE DIGEST
- Sources consulted (retrieved 2026-03-07T19:45:52.334Z):
  - https://en.wikipedia.org/wiki/Hamming_distance (Hamming distance definition, coding theory usage, Python/C examples, Wegner algorithm, popcount intrinsics) — core algorithms, complexity, Wegner loop, builtin-popcount patterns.
  - https://en.wikipedia.org/wiki/Population_count (Hamming weight equivalence and terminology) — popcount concept.
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#iterating_over_strings (JS string internals, UTF-16, iterators, normalization guidance) — iteration differences between code units, code points, grapheme clusters.
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt (signature and behaviour of codePointAt) — return semantics for surrogates and recommendation to use for...of.
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt (BigInt operators, restrictions, JSON handling) — BigInt bitwise support and caveats (no >>>, JSON issues).
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators (JS bitwise operator semantics, 32-bit coercion) — clarifies 32-bit behaviour and operator set.
  - https://www.npmjs.com/package/hamming-distance (attempted; fetch returned HTTP 403 - not retrieved). Refer to local package metadata or mirror if needed.
- Retrieval status: six sources fetched successfully; npm package page returned HTTP 403 and was not retrieved.
- Data size obtained during crawling: not recorded by the retrieval tool; per-source sizes unavailable.


6. ATTRIBUTION AND CRAWL DATA
- Attribution:
  - Hamming distance and population count definitions and algorithms: Wikipedia contributors (Hamming distance page; Population count page).
  - JavaScript string, codePointAt, BigInt, and bitwise operator details: MDN Web Docs (Mozilla Developer Network).
- Crawl metadata:
  - Retrieval date: 2026-03-07T19:36:02.195Z (UTC).
  - Sources fetched: 6 of 7 listed in SOURCES.md; npm package page returned 403.
  - Data notes: fetched pages were truncated by the retrieval tool at size limits in some cases; full specification links are provided in the sources above.


END OF DOCUMENT
