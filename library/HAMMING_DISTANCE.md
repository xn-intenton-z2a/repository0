HAMMING_DISTANCE

TABLE OF CONTENTS
1. Normalised Extract
  1.1 Definitions
  1.2 Unicode string handling (JavaScript specifics)
  1.3 String-based Hamming distance (code-point aware algorithm)
  1.4 Integer/BigInt Hamming distance (bitwise XOR + popcount)
  1.5 Popcount implementations and tradeoffs
2. Supplementary Details
  2.1 Implementation notes and performance guidance
  2.2 Memory, numeric and security considerations
3. Reference Details (API specifications, exact patterns)
  3.1 JavaScript function signatures and parameter validation
  3.2 Popcount method signatures and algorithms
  3.3 Fixed-width masks and constants (64-bit examples)
  3.4 Errors, exceptions and edge-case handling
4. Detailed Digest and Provenance
5. Attribution and Crawl Data (sizes & notes)


1. NORMALISED EXTRACT

1.1 Definitions
Hamming distance: For two sequences of equal length, the number of positions where corresponding symbols differ. For binary strings a and b: HammingDistance(a,b) = popcount(a XOR b).
Hamming weight / popcount: Number of 1-bits in an integer's binary representation (population count).
Time complexity: For element-wise sequence comparison O(n) where n is sequence length. For integer popcount algorithms complexity varies: O(k) for Kernighan (k = set bits), O(w) for bit-scanning (w = bit-width), O(log w) for parallel-add masks, O(1) when hardware popcount instruction exists.

1.2 Unicode string handling (JavaScript specifics)
- JavaScript String.length counts UTF-16 code units; characters above U+FFFF use surrogate pairs occupying two code units. For user-visible code points use the string iterator (String.prototype[Symbol.iterator]) or Array.from(string) which yield Unicode code point strings.
- String.prototype.codePointAt(index) returns the Unicode code point starting at specified UTF-16 index: if the unit at index is a leading surrogate it returns the combined code point; if it's a trailing surrogate returns the trailing unit value. Do not loop by numeric indices when you intend to compare code points; instead iterate by code points.
- String iteration behavior: iterating a string (for...of or string[Symbol.iterator]()) yields individual Unicode code points as JavaScript strings; surrogate pairs are preserved; ZWJ sequences and combining sequences are split into multiple yielded code points (grapheme clusters are not preserved).

Use-case implication: When Hamming distance must reflect user-perceived characters you must first normalize input to grapheme clusters (external library, Intl.Segmenter or third-party) and then compare grapheme units. Default code-point comparison treats combining marks, ZWJ sequences and regional indicator pairs as multiple positions.

1.3 String-based Hamming distance (code-point aware algorithm)
Preconditions and exact error behaviour:
- Inputs: both arguments must be of type string. If typeof a !== 'string' || typeof b !== 'string' then throw TypeError('Both arguments must be strings').
- Comparison mode: code-point-wise by default. Obtain code-point sequences either by ra = Array.from(a) and rb = Array.from(b) or by using iterators a[Symbol.iterator]() and b[Symbol.iterator]() to walk both strings in lockstep.
- Length requirement: require equal code-point lengths; if ra.length !== rb.length then throw RangeError('Strings must have the same length in code points'). If using iterators, detect mismatch when one iterator finishes before the other and throw the same RangeError.
Algorithm (Array.from implementation, O(n) memory):
1. const ra = Array.from(a);
2. const rb = Array.from(b);
3. if (ra.length !== rb.length) throw RangeError('Strings must have the same length in code points');
4. let count = 0; for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) count++;
5. return count;
Iterator simultaneous implementation (O(1) extra memory):
1. const Ia = a[Symbol.iterator](); const Ib = b[Symbol.iterator]();
2. loop: na = Ia.next(); nb = Ib.next(); if (na.done !== nb.done) throw RangeError('Strings must have the same length in code points');
3. if (!na.done && na.value !== nb.value) count++;
4. continue until done; return count.
Notes: This algorithm compares code points not grapheme clusters. To compare grapheme clusters, segment strings (Intl.Segmenter or external library) and treat resulting segments as sequence elements and apply identical algorithm (require equal number of segments).

1.4 Integer/BigInt Hamming distance (bitwise XOR + popcount)
Preconditions and validation (JavaScript patterns):
- Accept Number or BigInt for x and y. If neither number nor bigint, throw TypeError.
- For Number inputs require Number.isInteger(x) and x >= 0; if violated throw TypeError or RangeError as appropriate. Prefer converting Number inputs to BigInt for bitwise operations that must handle more than 32 bits.
- Convert: const bx = typeof x === 'bigint' ? x : BigInt(x); const by = typeof y === 'bigint' ? y : BigInt(y); if (bx < 0n || by < 0n) throw RangeError('Integers must be non-negative').
Core operation (BigInt-safe):
1. let v = bx ^ by; // BigInt XOR
2. distance = popcount(v) // use a BigInt-capable popcount
3. return Number(distance) or BigInt(distance) depending on API contract (prefer Number unless counts may exceed Number.MAX_SAFE_INTEGER)
Notes: JavaScript bitwise operators on Number coerce to 32-bit signed integers; for arbitrary-width integers use BigInt and BigInt bitwise operators.

1.5 Popcount implementations and tradeoffs
- popcountKernighan (per-set-bit): Signature: popcountKernighan(v: bigint): number. Algorithm: count = 0; while (v !== 0n) { v &= v - 1n; count++; } return count. Complexity O(k) where k is number of set bits; best for sparse values.
- popcountShift (bit-scanning): Signature: popcountShift(v: bigint): number. Algorithm: count = 0; while (v !== 0n) { count += Number(v & 1n); v >>= 1n; } return count. Complexity O(w) where w is bit-width; simple and constant-memory.
- popcountLookup (byte-wise table): Precompute table[0..255] = popcount for byte values. For fixed word sizes split value into bytes and sum table lookups. Memory/time tradeoff: O(w/8) time and 256 bytes table.
- popcountParallelAdd (SWAR / parallel add masks): Use fixed masks and add/subtract/shifts to accumulate counts in parallel slices. Example 64-bit pattern uses constants:
  m1 = 0x5555555555555555  // 0101...
  m2 = 0x3333333333333333  // 00110011..
  m4 = 0x0f0f0f0f0f0f0f0f  // 4-bit slices
  m8 = 0x00ff00ff00ff00ff
  m16= 0x0000ffff0000ffff
  m32= 0x00000000ffffffff
  h01 = 0x0101010101010101
Procedure (64-bit):
  x = (x & m1) + ((x >> 1) & m1)
  x = (x & m2) + ((x >> 2) & m2)
  x = (x & m4) + ((x >> 4) & m4)
  x = (x & m8) + ((x >> 8) & m8)
  x = (x & m16)+ ((x >> 16) & m16)
  x = (x & m32)+ ((x >> 32) & m32)
  return Number(x) // result in low bits
This is O(log w) arithmetic ops and is efficient on CPUs where shifts and integer additions are cheap. Use multiplication variant to reduce arithmetic as: return (x * h01) >> 56 after prior consolidation.
- Hardware/intrinsics: Prefer processor popcount instruction (POPCNT) exposed via compiler intrinsics (__builtin_popcount, __builtin_popcountll) or language library functions (C++ std::popcount) when available; those are typically fastest.


2. SUPPLEMENTARY DETAILS

2.1 Implementation notes and performance guidance
- Choose algorithm based on expected operand characteristics: use Kernighan for sparse bitsets, table lookup for medium-size fixed-width operands, parallel-add masks or hardware popcount for dense/wide operands.
- For JavaScript: use BigInt popcount for values exceeding 32 bits; avoid Number bitwise ops for >32-bit precision because Number bitwise operations coerce values to 32-bit signed integers.
- For strings: prefer iterator-based, single-pass comparison to reduce memory overhead when inputs are large and you only need the Hamming distance. Use Array.from when you need random access or must validate lengths first.
- When comparing user-perceived characters, segment by grapheme clusters (Intl.Segmenter or third-party library). This adds overhead but is essential for correct UX when combining marks or emoji sequences are present.

2.2 Memory, numeric and security considerations
- Memory: Array.from(a) duplicates the whole string as an array of code point strings; for large inputs prefer iterator approach to avoid O(n) extra memory.
- Numeric range: converting Number to BigInt via BigInt(x) will throw if x is not a safe integer; validate Number.isInteger(x) and x >= 0 before conversion when expecting integers.
- Return type: if inputs are BigInt and the expected Hamming distance can exceed Number.MAX_SAFE_INTEGER, return BigInt; otherwise return Number for compatibility with typical APIs.
- Security: Do not accept untrusted prototype-polluted objects where typeof === 'string' might be faked; perform typeof checks and avoid executing input as code. Avoid side-channel leaks when comparing secrets (use constant-time comparison if comparing secret tokens; Hamming distance reveals differing positions and should not be used for secrets).


3. REFERENCE DETAILS (API SPECIFICATIONS, EXACT PATTERNS)

3.1 JavaScript function signatures and parameter validation
- hammingDistance(a: string, b: string): number
  - Parameters: a (string), b (string)
  - Behaviour: if typeof a !== 'string' || typeof b !== 'string' throw TypeError('Both arguments must be strings'). Compare by code points (Array.from or iterator). If code-point lengths differ throw RangeError('Strings must have the same length in code points'). Return non-negative integer count of differing code points.
- hammingDistanceBits(x: number | bigint, y: number | bigint): number | bigint
  - Parameters: x (number|bigint), y (number|bigint)
  - Validation: if typeof x not 'number' and not 'bigint' throw TypeError. If number inputs require Number.isInteger(x) and x >= 0 else throw TypeError/RangeError. Convert numbers to BigInt: bx = typeof x==='bigint'?x:BigInt(x). Same for y. If bx < 0n or by < 0n throw RangeError.
  - Operation: v = bx ^ by; distance = popcountBigInt(v) ; Return either Number(distance) or BigInt(distance) per API contract (prefer Number for distances within safe integer range).

3.2 Popcount method signatures and algorithms
- popcountKernighan(v: bigint): number
  - Implementation steps: count = 0; while (v !== 0n) { v = v & (v - 1n); count++; } return count;
  - Complexity: O(k) where k is number of set bits.
- popcountShift(v: bigint): number
  - Steps: count = 0; while (v !== 0n) { count += Number(v & 1n); v >>= 1n; } return count;
  - Complexity: O(w) where w is bit-width.
- popcountLookup(v: bigint, table: Uint8Array): number
  - Steps: while v !== 0n read low-order byte: idx = Number(v & 0xFFn); sum += table[idx]; v >>= 8n; return sum;
  - Precondition: table holds 256 precomputed byte popcounts.
- popcountParallelAdd64(x: number): number
  - Steps (64-bit unsigned): use masks m1,m2,m4,m8,m16,m32 and h01 as specified in section 1.5 and perform the sequence of shift/and/add reductions; final aggregation yields byte-summed count and extract low byte or perform multiply/h01 and shift to obtain final count.

3.3 Fixed-width masks and constants (64-bit examples)
m1  = 0x5555555555555555n
m2  = 0x3333333333333333n
m4  = 0x0f0f0f0f0f0f0f0fn
m8  = 0x00ff00ff00ff00ffn
m16 = 0x0000ffff0000ffffn
m32 = 0x00000000ffffffffn
h01 = 0x0101010101010101n
Use these constants in BigInt arithmetic for parallel-add popcount implementations when operating on up to 64-bit widths represented as BigInt.

3.4 Errors, exceptions and edge-case handling
- Strings: TypeError for non-strings, RangeError for differing code-point lengths. For grapheme-cluster mode: throw RangeError if cluster counts differ.
- Integers: TypeError for non-number/non-bigint; TypeError if number inputs are non-integer; RangeError for negative values. Conversions to BigInt must be guarded by Number.isInteger and >= 0 to avoid unexpected BigInt conversions from floats.
- Overflow: If returning Number from extremely large bit-width counts, detect if distance > Number.MAX_SAFE_INTEGER and either throw RangeError or return BigInt per API contract.


4. DETAILED DIGEST AND PROVENANCE

Sources consulted (retrieved 2026-03-11):
- https://en.wikipedia.org/wiki/Hamming_distance — detailed definition, metric properties, relation to Hamming weight, algorithms: per-element comparison, integer bitwise XOR + popcount, Wegner algorithm, builtin popcount intrinsics. Page contains Python and C examples and discussion of error-detection/correction properties and minimum distance concepts. (retrieved: 2026-03-11; fetch truncated at tool limit)
- https://en.wikipedia.org/wiki/Hamming_weight — in-depth population-count techniques: Wegner loop (x &= x - 1), SWAR/parallel-add masks with explicit 64-bit constants and example implementations popcount64a/popcount64b/popcount64c, table-based method, hardware intrinsics and language library support. (retrieved: 2026-03-11; fetch truncated at tool limit)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt — codePointAt semantics: returns code point at UTF-16 index, explains surrogate pair behaviour and recommends iteration by code points rather than numeric indices. (MDN last modified Jul 10, 2025; retrieved: 2026-03-11)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/%40%40iterator — String[Symbol.iterator] yields Unicode code points as strings; surrogate pairs preserved; ZWJ and combining marks split across yields; suggests using for...of or spread to iterate by code points. (MDN last modified Jul 10, 2025; retrieved: 2026-03-11)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators — JavaScript bitwise operators operate on 32-bit signed integer views of Number operands; includes XOR (^), AND (&), shifts, and descriptions of unsigned right shift >>>; references ECMAScript specification. (retrieved: 2026-03-11; fetch truncated at tool limit)
- https://www.npmjs.com/package/hamming-distance — fetch failed with HTTP 403 from crawler; contents unavailable. (retrieved attempt: 2026-03-11; HTTP 403)

Retrieval notes: web fetch tool limited to 15000 characters per page in this run; long Wikipedia pages were truncated up to that boundary; MDN pages retrieved fully in their relevant sections. NPM page blocked by 403.


5. ATTRIBUTION AND CRAWL DATA

Attribution (primary authoritative sources):
- Wikipedia contributors. Hamming distance. Retrieved 2026-03-11 from https://en.wikipedia.org/wiki/Hamming_distance
- Wikipedia contributors. Hamming weight. Retrieved 2026-03-11 from https://en.wikipedia.org/wiki/Hamming_weight
- MDN Web Docs. String.prototype.codePointAt. Last modified Jul 10, 2025; retrieved 2026-03-11 from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
- MDN Web Docs. String.prototype[Symbol.iterator]. Last modified Jul 10, 2025; retrieved 2026-03-11 from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/%40%40iterator
- MDN Web Docs. Bitwise operators. Retrieved 2026-03-11 from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
- npm hamming-distance package: retrieval blocked (HTTP 403) on 2026-03-11; content not included.

Data sizes and notes:
- Each successful web_fetch retrieved up to 15000 characters (tool limit set). Several Wikipedia pages were truncated at the 15000-character boundary. Exact byte counts not available from the fetch tool output; use start_index pagination for further retrieval if required.
- NPM package page returned HTTP 403; no data recorded for that URL.

License and reuse: Content is aggregated from public documentation pages and Wikipedia. Consumers of this document must respect original sources' licenses (Wikipedia: CC BY-SA; MDN: CC BY-SA/MIT as applicable; npm package licensing unknown due to fetch failure).


END
