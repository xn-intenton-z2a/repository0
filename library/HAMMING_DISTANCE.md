HAMMING_DISTANCE

TABLE OF CONTENTS
1. Normalised Extract
  1.1 Definitions and Formal Properties
  1.2 Binary/integer Hamming (XOR + popcount)
  1.3 Popcount implementations and constants (64-bit masks)
  1.4 String/Unicode considerations (JavaScript specifics)
  1.5 String-based Hamming algorithms (code-point and grapheme modes)
2. Supplementary Details
  2.1 Performance guidance and complexity
  2.2 Memory, numeric and error handling considerations
3. Reference Details (API specifications, method signatures, patterns)
  3.1 JavaScript API signatures and exact validation behaviour
  3.2 Popcount function signatures and implementation choices
  3.3 Fixed-width masks, constants and their hex values
  3.4 Errors, exceptions and edge-case handling (precise text)
4. Detailed Digest and Provenance
5. Attribution and Crawl Data


1. NORMALISED EXTRACT

1.1 Definitions and Formal Properties
Hamming distance between two equal-length sequences (symbols over an alphabet) is the number of positions with different symbols. For binary sequences a and b of equal length: HammingDistance(a,b) = popcount(a XOR b). The Hamming distance is a metric on fixed-length words: non-negativity, identity of indiscernibles, symmetry, and triangle inequality hold. For code/implementation: require equal-length inputs for sequence-based algorithms; if unequal, surface an explicit length-mismatch error.

1.2 Binary/integer Hamming (XOR + popcount)
Primary implementation pattern for integers:
- Validate input types (see API rules below).
- Convert values to an unsigned integer representation able to hold the operand range (prefer BigInt in JavaScript for >32-bit values).
- Compute v = x XOR y.
- Compute count = popcount(v) using an appropriate popcount implementation.
Return count as a non-negative integer.

1.3 Popcount implementations and constants (64-bit masks)
Mask constants (use hex) for 64-bit parallel-add (Widely used names):
- m1  = 0x5555555555555555  // binary: 0101...
- m2  = 0x3333333333333333  // binary: 00110011...
- m4  = 0x0f0f0f0f0f0f0f0f  // 4-bit slices
- m8  = 0x00ff00ff00ff00ff  // 8-bit slices
- m16 = 0x0000ffff0000ffff  // 16-bit slices
- m32 = 0x00000000ffffffff  // 32-bit low mask
- h01 = 0x0101010101010101  // used to sum bytes via multiply trick
Concrete popcount algorithms (semantic steps):
- Parallel-add (tree) method: repeatedly fold bit counts into larger slices using shifts, masks and adds. Example 64-bit sequence of operations: x = (x & m1) + ((x >> 1) & m1); then with m2, m4, m8, m16, m32 and final return x.
- Multiply-accumulate trick: after reducing to 8-bit byte counts, compute (x * h01) >> 56 to extract total count.
- Wegner (v &= v - 1) loop: loop clearing lowest set bit, counting iterations — O(popcount(v)). Best when expected popcount small.
- Lookup-table: precompute popcount for 16-bit words and sum table lookups for larger words — trades memory for speed.
- Hardware: use CPU popcnt / intrinsic (__builtin_popcount / __builtin_popcountll) when available.

1.4 String/Unicode considerations (JavaScript specifics)
- JavaScript String.length reports UTF-16 code units; characters above U+FFFF occupy two code units (surrogate pair). For user-visible characters, code points and grapheme clusters differ: combining marks and ZWJ sequences form grapheme clusters but are split by string iterators.
- String iteration using String.prototype[Symbol.iterator] or for...of yields Unicode code point strings (surrogate pairs preserved as single yielded elements), but does not yield grapheme clusters; sequences joined by ZWJ or combining marks become multiple iterator yields.
- String.prototype.codePointAt(index) returns the Unicode code point at the given UTF-16 index; when used within code-point iteration, call codePointAt(0) on each iterated element to obtain numeric code points.
- For code-point-aware Hamming distance: iterate by code points (Array.from(string) or for...of iterator) and compare yielded elements.
- For grapheme-cluster-aware Hamming distance (user-perceived characters): segment strings with Intl.Segmenter (if available) or external grapheme segmentation library to obtain grapheme clusters, then compare cluster sequences.

1.5 String-based Hamming algorithms (code-point and grapheme modes)
Preconditions and errors (exact wording is provided in Reference Details): both operands must be strings, and must have equal element counts under the chosen segmentation mode (code points or grapheme clusters). If not, throw a RangeError or TypeError as specified.
Array.from-based algorithm (code-point mode, O(n) time, O(n) extra memory):
1. ra = Array.from(a)
2. rb = Array.from(b)
3. if ra.length !== rb.length then throw RangeError('Strings must have the same length in code points')
4. count = 0; for i in 0..ra.length-1: if ra[i] !== rb[i] count++
5. return count
Iterator simultaneous algorithm (code-point mode, O(n) time, O(1) extra memory):
1. Ia = a[Symbol.iterator](); Ib = b[Symbol.iterator]()
2. loop: na = Ia.next(); nb = Ib.next(); if na.done !== nb.done throw RangeError('Strings must have the same length in code points')
3. if not na.done and na.value !== nb.value then count++
4. when done return count
Grapheme-cluster mode: replace Array.from or Symbol.iterator with segmentation via Intl.Segmenter (segmenter.segment(string) iterator) or third-party library; require equal number of segments.


2. SUPPLEMENTARY DETAILS

2.1 Performance guidance and complexity
- Sequence comparisons (string as sequence of elements) are O(n) time where n is number of elements compared (code points or grapheme clusters). Memory: Array.from implementation uses O(n) extra memory while iterator pair uses O(1) extra memory.
- Integer-based Hamming using XOR + popcount: bitwise XOR is O(1) for machine words; popcount cost depends on implementation: Wegner loop O(k) where k = number of set bits; tree/add methods O(log w) arithmetic operations where w is bit-width; hardware popcount is O(1) latency.
- For large numbers (BigInt), shifting and masking operations are O(m) in limb count; converting Number to BigInt is recommended for JS when values exceed 32-bit safe operations.
- Use hardware intrinsics or built-in popcount (compiler intrinsics, std::popcount, Integer.bitCount etc.) when available for best throughput.

2.2 Memory, numeric and error handling considerations
- Use non-negative integers only when computing bit Hamming distance; negative numbers require two's complement interpretation which complicates popcount semantics — prefer to reject negatives with a RangeError.
- For string comparisons, choose segmentation mode (code point or grapheme) deliberately and document behaviour — default library behaviour should be code-point-aware unless explicitly opting into grapheme mode.
- When comparing large lists of stored bit-strings (e.g., biometric IrisCodes), adopt vectorized/popcount-accelerated code or table lookup strategies for throughput.


3. REFERENCE DETAILS (API SPECIFICATIONS, METHOD SIGNATURES AND ERRORS)

3.1 JavaScript API signatures and exact validation behaviour
Function: hammingDistance(a, b)
- Signature: hammingDistance(a: string, b: string) -> number
- Behaviour: If typeof a !== 'string' or typeof b !== 'string' throw TypeError('Both arguments must be strings'). Segment strings using code points by default (Array.from or iterator). If code-point counts differ, throw RangeError('Strings must have the same length in code points'). Compare elements for strict inequality (=== semantics for the yielded strings) and return integer count of differing positions.
- Grapheme mode: Optional overload or separate function hammingDistanceGrapheme(a: string, b: string, segmenter?: Intl.Segmenter) -> number. Use segmenter.segment(str) or external library to obtain grapheme clusters; require equal cluster counts and compare by exact string equality of segments.

Function: hammingDistanceBits(x, y)
- Signature: hammingDistanceBits(x: number | bigint, y: number | bigint) -> number
- Validation and conversions: If typeof x is neither 'number' nor 'bigint' throw TypeError('x must be a number or bigint'); same for y. For number inputs require Number.isInteger(x) and x >= 0; for bigint inputs require x >= 0n. Convert numbers to BigInt for internal XOR: const bx = typeof x === 'bigint' ? x : BigInt(x); const by = typeof y === 'bigint' ? y : BigInt(y). If either bx < 0n or by < 0n throw RangeError('Integers must be non-negative').
- Core logic: let v = bx ^ by; compute popcount(v) returning a Number (safe up to JS Number positive integer range; for extremely large BigInt counts, return Number(value) with possible precision loss — recommend to document limits or return BigInt count if required by API consumer).
- Error behaviour: on invalid types throw TypeError; on negative values throw RangeError.

3.2 Popcount function signatures and implementation choices
Function: popcountBigInt(v)
- Signature: popcountBigInt(v: bigint) -> number
- Implementation options (choose one based on environment):
  - Wegner loop: let count = 0; while (v) { count += Number(v & 1n); v >>= 1n; } return count;  // simple, but O(popcount)
  - Clear-lowest-bit loop: let count = 0; while (v) { v &= v - 1n; count++; } return count;  // faster when few bits set
  - Chunked lookup using 16-bit table: for large v, extract 16-bit windows and sum precomputed table entries. Needs allocating table[65536] and iterating over limb words.
  - Hardware/host-native: if executing under an environment with native popcount for BigInt limbs, prefer that.
Return type: Number (document maximum practical value).

3.3 Fixed-width masks, constants and their hex values
- m1  = 0x5555555555555555
- m2  = 0x3333333333333333
- m4  = 0x0f0f0f0f0f0f0f0f
- m8  = 0x00ff00ff00ff00ff
- m16 = 0x0000ffff0000ffff
- m32 = 0x00000000ffffffff
- h01 = 0x0101010101010101
Use these constants verbatim when implementing the tree-based popcount reduction in 64-bit integer code.

3.4 Errors, exceptions and edge-case handling (precise text)
- hammingDistance(a,b): if typeof a !== 'string' || typeof b !== 'string' then throw TypeError('Both arguments must be strings'). If comparing in code-point mode and code-point counts differ then throw RangeError('Strings must have the same length in code points'). For grapheme mode if grapheme segment counts differ then throw RangeError('Strings must have the same length in grapheme clusters').
- hammingDistanceBits(x,y): if typeof x not in { 'number','bigint' } throw TypeError('x must be a number or bigint'); same for y. For number inputs if !Number.isInteger(x) throw TypeError('x must be an integer'); if x < 0 throw RangeError('Integers must be non-negative'); same for y. For BigInt inputs if bx < 0n or by < 0n throw RangeError('Integers must be non-negative').


4. DETAILED DIGEST AND PROVENANCE
This document normalises and consolidates technical material retrieved from the following sources on 2026-03-11 (UTC):
- https://en.wikipedia.org/wiki/Hamming_distance  — core definitions, metric properties, XOR + popcount equivalence, C and GCC examples, correction/detecting capabilities, algorithmic examples and complexity notes.
- https://en.wikipedia.org/wiki/Hamming_weight  — population count definitions, multiple efficient algorithms (tree/parallel add, multiply trick, Wegner clear-lowest-bit), lookup table strategies, hardware instruction availability and platform notes.
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt — precise JS semantics for codePointAt, handling of surrogate pairs, recommended iteration patterns (for...of, spread, Array.from) to obtain code points.
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/%40%40iterator — iterator yields Unicode code points; examples of surrogate pair preservation and ZWJ / combining-mark splitting; explicit iterator usage pattern.
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators — JS bitwise operator semantics, shift, XOR, AND, OR and unsigned shifts; note that bitwise operators treat operands as 32-bit signed integers in JS for standard operators but BigInt bitwise operators exist for arbitrary width when using BigInt.
- https://www.npmjs.com/package/hamming-distance  — fetch failed (HTTP 403) during crawl; package page could contain distribution API and signature examples but was not retrieved.

Retrieval date: 2026-03-11 (source snapshots pulled during crawl). Some web fetch responses were truncated by the crawler tool and the npmjs page returned HTTP 403, see Attribution and Crawl Data below for fetch status.


5. ATTRIBUTION AND CRAWL DATA
Retrieved sources (status):
- Wikipedia: Hamming distance — fetched, content available (truncated by fetch tool in places).
- Wikipedia: Hamming weight — fetched, content available (truncated by fetch tool in places).
- MDN: String.codePointAt — fetched, content available.
- MDN: String.prototype[@@iterator] — fetched, content available.
- MDN: Bitwise operators — fetched, content available (truncated warning present).
- npmjs: hamming-distance — fetch failed (HTTP 403), not available.

Supplementary implementation-specific notes extracted from MDN (exact technical behaviour to apply in implementations):
- JavaScript Number bitwise operators (|, &, ^, ~, <<, >>, >>>) coerce operands to 32-bit signed integers (two's complement) before operation and return a Number in the signed 32-bit range. Use this behaviour only for values that fit in 32-bit signed range; otherwise prefer BigInt-based operations or explicit masking to avoid sign-extension surprises.
- The unsigned right shift operator >>> performs a zero-fill right shift on 32-bit Number operands and is not defined for BigInt; do not use >>> with BigInt.
- BigInt bitwise operators (|, &, ^, ~, <<, >>) exist and operate on BigInt operands, returning BigInt results; these operate on infinite-precision two's-complement semantics of BigInt values. Shifts on BigInt are arithmetic shifts for >> and left shifts for <<; >>> is not supported for BigInt.
- String iteration: String.prototype[Symbol.iterator]() yields Unicode code point strings; surrogate pairs are preserved as single yielded elements, but grapheme clusters (combined sequences using ZWJ or combining marks) are split. Use Intl.Segmenter or a grapheme library when grapheme-aware segmentation is required.
- String.prototype.codePointAt(index) returns the full Unicode code point when index points to a leading surrogate; when index points to a trailing surrogate it returns the trailing surrogate code unit only. Prefer iterators or Array.from to avoid indexing into surrogate pairs.

Data size obtained during crawling: exact byte counts unavailable due to fetch tool truncation and response metadata limits; callers should re-run fetch for full page snapshots if exact byte counts are required. The corpus used to create this document contains the portions of the pages returned by the fetch tool on 2026-03-11; where the fetch tool signalled truncation the full page content was not included. npmjs page returned HTTP 403 during automated fetch and therefore its content was not captured; consult the package registry manually if that source is required.

---

END OF DOCUMENT
