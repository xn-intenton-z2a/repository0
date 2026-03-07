HAMMING_DISTANCE

TABLE OF CONTENTS
1. NORMALISED EXTRACT
  1.1 Definitions and formal identities
  1.2 Core algorithms (explicit implementations)
    1.2.1 Byte-wise baseline
    1.2.2 XOR + popcount (word-oriented)
    1.2.3 Kernighan/Wegner popcount (sparse ones)
    1.2.4 Parallel/bit-twiddling popcount (32-bit)
    1.2.5 BigInt-based popcount
  1.3 JavaScript-specific behaviours and conversions
    1.3.1 String storage (UTF-16 code units) and iteration
    1.3.2 codePointAt behaviour and surrogate handling
    1.3.3 Converting strings to bytes (TextEncoder / UTF-8) vs code points
    1.3.4 BigInt bitwise operator semantics and restrictions
    1.3.5 Bitwise operators on Numbers vs BigInt
2. SUPPLEMENTARY DETAILS
  2.1 Encoding and length policies (UTF-8 vs UTF-16 vs code points)
  2.2 Chunking, machine-word choice and streaming strategy
  2.3 Endianness and word packing when reading bytes
  2.4 Performance trade-offs and recommended fallbacks
3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)
  3.1 Function signatures for core primitives
  3.2 popcount primitives with deterministic behavior
  3.3 String handling contract and exact steps
  3.4 BigInt and bitwise operations contract and examples
4. TROUBLESHOOTING AND PROCEDURES
  4.1 Step-by-step validation and fallback checks
  4.2 Edge-case rules and error messages
5. SOURCE DIGEST AND RETRIEVAL METADATA
6. ATTRIBUTION AND CRAWL DATA


1. NORMALISED EXTRACT

1.1 Definitions and formal identities
- Hamming distance (H): For two sequences A and B of equal length L, H(A, B) = |{ i in [0..L-1] : A[i] != B[i] }|.
- For binary bit-vectors representable as integers, H(A, B) = popcount(A XOR B) where popcount(x) = number of 1 bits in x.
- Minimum distance dmin: a code with minimum Hamming distance d can detect up to d-1 substitutions and correct up to floor((d-1)/2) substitutions.
- Hamming weight = population count = popcount.

1.2 Core algorithms (explicit implementations)

1.2.1 Byte-wise baseline
- Precondition: inputs are equal-length byte sequences (Uint8Array or Buffer).
- Algorithm: iterate i from 0 to L-1; if a[i] !== b[i] increment count.
- Complexity: O(L) time, O(1) extra memory.
- Use-case: short inputs, when avoiding bit conversions or when inputs are already byte arrays.
- Error policy: if lengths differ, throw or return an error code; Hamming is undefined for unequal lengths unless a calling policy (pad/truncate) is explicitly chosen.

1.2.2 XOR + popcount (word-oriented)
- Precondition: inputs are equal-length and interpreted as same-endian byte sequence packed into machine words.
- Algorithm:
  1. Read in word-sized chunks (wordSize bits, e.g., 32 or 64).
  2. For each word pair: diff = leftWord XOR rightWord.
  3. count += popcount(diff).
  4. Handle remaining tail bytes with byte-wise loop.
- Complexity: O(ceil(L/wordSize)). Use when inputs are large and represented as binary buffers.
- Implementation notes: prefer natural word size of platform (32-bit on JS Number bitwise ops, 64-bit with BigInt in JS) for fewer iterations.

1.2.3 Kernighan / Wegner popcount (sparse ones)
- Algorithm (applies to integer types, including BigInt):
  while (v !== 0n) { v &= v - 1n; count++; }
- Complexity proportional to number of set bits in v; efficient when diff has few ones.
- Use-case: when XOR result is sparse or when no hardware popcount available.

1.2.4 Parallel / bit-twiddling popcount (32-bit)
- Deterministic sequence for 32-bit unsigned integers (exact steps):
  x = x - ((x >>> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  x = (x + (x >>> 4)) & 0x0F0F0F0F;
  count = (x * 0x01010101) >>> 24;
- Use-case: when working with 32-bit words and needing branchless, fast popcount in software.

1.2.5 BigInt-based popcount
- Use BigInt to represent word sizes greater than 32 bits in JS. Implementations:
  - Kernighan loop with BigInt as above.
  - For fixed-width segments, use BigInt.asUintN(n, value) to clamp width before counting.
- Restrictions: BigInt operations require both operands to be BigInt and there is no unsigned-right-shift (>>>) for BigInt.

1.3 JavaScript-specific behaviours and conversions

1.3.1 String storage (UTF-16 code units) and iteration
- JavaScript strings are sequences of UTF-16 code units (16-bit). String length is count of code units, not Unicode code points.
- Iteration via for...of or spread operator iterates over Unicode code points (grapheme-level may still split combined sequences).
- Splitting by "" or indexing accesses single UTF-16 code units and will separate surrogate pairs.

1.3.2 codePointAt behaviour and surrogate handling
- String.prototype.codePointAt(index) returns the Unicode code point at index; when index addresses a high surrogate it returns the full code point for the surrogate pair; when index addresses a low surrogate it returns the low surrogate code unit value.
- Out-of-range index returns undefined.

1.3.3 Converting strings to bytes (TextEncoder / UTF-8) vs code points
- For byte-wise Hamming on textual inputs, use TextEncoder (UTF-8) to obtain a byte sequence for each string; then compute Hamming over bytes with equal-length requirement applied to encoded bytes.
- For code-point-aware Hamming, iterate strings via for...of to get code points, and compare code point sequences. This yields Hamming distance in characters (code points), not bytes or grapheme clusters.
- Policy: decide whether Hamming over code points, grapheme clusters or bytes is required; document and enforce in API.

1.3.4 BigInt bitwise operator semantics and restrictions
- BigInt supports bitwise operators: &, |, ^, ~, <<, >> but not >>> (unsigned right shift). Both operands must be BigInt; mixing Number and BigInt throws TypeError.
- Use BigInt.asIntN(bits, value) or BigInt.asUintN(bits, value) to clamp widths safely when using BigInt for fixed-width word arithmetic.
- BigInt arithmetic is not constant-time; avoid for secret-dependent loops in cryptographic contexts without mitigation.

1.3.5 Bitwise operators on Numbers vs BigInt
- JS Number bitwise operators operate on 32-bit signed integers (ToInt32 coercion). For word-oriented popcount using Number bitwise ops, chunk into 32-bit segments.
- For >32-bit widths, use BigInt and its bitwise operators.


2. SUPPLEMENTARY DETAILS

2.1 Encoding and length policies (UTF-8 vs UTF-16 vs code points)
- UTF-8 byte length varies per code point (1..4 bytes). Hamming over UTF-8 bytes compares encoded byte sequences and requires equal encoded lengths (or defined padding policy).
- UTF-16 code units (String.length) store code units (1 or 2 per code point). Hamming over UTF-16 code units compares indices directly but may split surrogate pairs; avoid unless you intentionally want UTF-16 unit-based difference.
- Code point sequence comparison (for...of) is recommended when comparing visible characters ignoring surrogate internal layout.

2.2 Chunking, machine-word choice and streaming strategy
- Prefer processing in native word sizes: 32-bit chunks when using Number bitwise ops (>>> and >>>= etc). Use BigInt for 64-bit+ chunks.
- For streaming large inputs, read and XOR words progressively and accumulate popcount; keep a small tail buffer for bytes not aligned to word boundary.

2.3 Endianness and word packing when reading bytes
- When packing bytes into machine words for XOR, choose an explicit endianness (little-endian is common on x86) and use consistent packing/unpacking rules across inputs.
- When using typed arrays with DataView, specify endianness when reading multi-byte words.

2.4 Performance trade-offs and recommended fallbacks
- Small buffers: byte-wise loop is simplest and fastest due to function overhead avoidance.
- Medium/large buffers: word-oriented XOR + popcount wins.
- Sparse differences: Kernighan popcount on XOR results is advantageous.
- Use built-in hardware popcount (via compiler intrinsics like __builtin_popcount) when available in native code; in JS, use typed-array + Wasm or BigInt tricks if extreme performance required.


3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)

3.1 Function signatures for core primitives
- hammingBytes(a: Uint8Array, b: Uint8Array) -> number
  - Parameters: a, b are Uint8Array or Buffer. Both must have identical length L. If lengths differ, throw RangeError or return -1 per chosen API policy.
  - Return: integer count of differing bytes (0..L).
  - Effects: none; pure function.

- hammingCodePoints(s1: string, s2: string) -> number
  - Parameters: s1, s2: strings. Iterates by Unicode code points (for...of). If code-point sequence lengths differ, throw RangeError.
  - Return: integer count of differing code points.

- hammingUTF8(s1: string, s2: string) -> number
  - Parameters: s1, s2: strings. Encodes both with TextEncoder('utf-8') to Uint8Array and then calls hammingBytes. Enforce equal encoded lengths or provide explicit padding/truncation option.
  - Return: integer count of differing bytes in UTF-8 encoding.

- hammingWords(a: Uint8Array, b: Uint8Array, options?: {wordSize: 32|64|BigInt}) -> number
  - Parameters: a,b same-length buffers; options.wordSize chooses chunking (32 uses Number bitwise ops; 64 uses BigInt chunking).
  - Behavior: packs bytes into word values using specified endianness, XORs, popcounts and accumulates.

3.2 popcount primitives with deterministic behaviour
- popcount32(x: number) -> number
  - Input: 32-bit unsigned integer (Number coerced via >>> 0)
  - Output: integer 0..32.
  - Implementation: use parallel bit-twiddling sequence in 1.2.4 for branchless result.

- popcount64BigInt(v: bigint) -> number
  - Input: BigInt representing up to 64-bit unsigned integer.
  - Output: integer 0..64.
  - Implementation: use Kernighan loop with BigInt or iterate two 32-bit halves with popcount32.

- popcountBigInt(n: bigint) -> number
  - Input: arbitrary BigInt (non-negative)
  - Output: integer >= 0
  - Implementation: while (n !== 0n) { n &= n - 1n; count++; }

3.3 String handling contract and exact steps
- For code-point-based Hamming:
  1. Validate inputs are strings.
  2. Create iterators via for...of to produce code points arrays or iterate in lockstep.
  3. If code-point counts differ, decide policy: throw RangeError, or compute partial distance and report remainder as mismatches.
  4. Compare code points using strict equality of codePointAt(0) values or by direct string element equality (for...of yields full code points as strings).

- For UTF-8 byte-based Hamming:
  1. Use TextEncoder to encode both inputs to Uint8Array.
  2. If encoded lengths differ, either reject or apply application-specific padding/truncation.
  3. Call hammingBytes.

3.4 BigInt and bitwise operations contract and examples
- All BigInt bitwise expressions require BigInt operands, e.g., (aBigInt ^ bBigInt).
- No unsigned right shift operator >>> exists for BigInt; use arithmetic right shift >> with sign semantics or mask with BigInt.asUintN(width, value) then >> if required.
- To clamp to N bits unsigned: BigInt.asUintN(N, value).
- Example helper: read 8 bytes little-endian into BigInt: use loop shifting and adding (acc |= BigInt(byte) << BigInt(8 * i)).


4. TROUBLESHOOTING AND PROCEDURES

4.1 Step-by-step validation and fallback checks
- Input validation checklist:
  1. Ensure both inputs are same conceptual domain (both binary buffers, or both strings).
  2. If strings: decide comparison domain (bytes/code points/grapheme clusters) and encode accordingly.
  3. Check lengths after encoding/normalization; if unequal, apply explicit policy or return error.
- Failure modes and remedies:
  - Different byte lengths after encoding: if application cannot tolerate throwing, choose normalized canonicalization (NFC) and re-encode; or pad/truncate to agreed length.
  - Surrogate pairs: avoid index-based iteration over strings; use for...of or codePointAt per-element.

4.2 Edge-case rules and error messages
- Error: "Inputs must be equal length" — thrown when lengths mismatch and no pad policy defined.
- Error: "Unsupported input type" — if types are not Buffer/Uint8Array or string.
- Note: JSON.stringify will not include BigInt values; do not pass BigInt in serialized network messages without custom replacer.


5. SOURCE DIGEST AND RETRIEVAL METADATA
- Sources crawled (listed as recorded in SOURCES.md):
  1) https://en.wikipedia.org/wiki/Hamming_distance — retrieved 2026-03-07: contains definitions, examples, Python and C sample implementations, relation to popcount and coding theory, error-detection/correction formulas, and Wegner/Kernighan popcount example.
  2) https://en.wikipedia.org/wiki/Population_count — retrieved 2026-03-07: population count / Hamming weight references and algorithmic uses.
  3) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#iterating_over_strings — retrieved 2026-03-07: UTF-16 storage, code unit vs code point, iteration methods, split/index semantics, grapheme cluster notes, TextEncoder guidance.
  4) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt — retrieved 2026-03-07: codePointAt(index) semantics, return values, surrogate-pair handling and recommended iteration patterns.
  5) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt — retrieved 2026-03-07: BigInt creation, operators supported (&,|,^,~,<<,>>), restrictions (no >>>), coercion rules, BigInt.asIntN/asUintN, JSON serialization notes, timing/crypto warning.
  6) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators — retrieved 2026-03-07: JS bitwise operator semantics, ToInt32 coercion for Number bitwise ops, operator list and precedence notes.
- Retrieval date: 2026-03-07 (as requested). One SOURCES.md entry (npm package hamming-distance) returned HTTP 403 from the crawler and was not parsed; therefore the npm package source is not included in the technical extract.
- Total sources successfully fetched: 5; failed: 1 (npm page returned 403).
- Approximate characters retrieved across successful sources: ~40,000 characters (aggregate HTML/text content). (Note: npm page blocked; size estimate excludes it.)


6. ATTRIBUTION AND CRAWL DATA
- Attribution: content and technical facts derived from Wikipedia (Hamming distance, Population count) and MDN (String iteration, codePointAt, BigInt, Bitwise Operators).
- Crawl metadata: 5 successful fetches, 1 failed (npm hamming-distance HTTP 403), retrieval timestamp 2026-03-07.


[NARRATIVE] Extracted technical details about Hamming distance, popcount algorithms, JavaScript string and BigInt behaviour, and assembled precise API signatures and implementation notes tailored for implementing Hamming distance in JS (UTF-8/UTF-16/BigInt paths).