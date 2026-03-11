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
  2.2 Memory and security considerations
3. Reference Details
  3.1 hammingDistance(a, b) signature, validations, errors
  3.2 hammingDistanceBits(x, y) signature, validations, errors
  3.3 Popcount function signatures and exact algorithms
  3.4 JavaScript bitwise semantics and conversion rules
4. Detailed Digest and Provenance
5. Attribution and Crawl Data

1. NORMALISED EXTRACT

1.1 Definitions
Hamming distance: for two equal-length sequences, the count of positions where corresponding symbols differ.
Hamming weight / popcount: number of 1-bits in a binary representation. For integers a and b: HammingDistance(a,b) = popcount(a XOR b).
Time complexity: O(n) over sequence length for character-by-character or word-wise scan; popcount variants alter per-bit work (O(k) for Kernighan where k=set bits, O(w) for fixed-width scanning).

1.2 Unicode string handling (JavaScript specifics)
- JavaScript String.length returns UTF-16 code unit count; surrogate pairs occupy two code units.
- Use Array.from(str) or the string iterator (for...of or str[Symbol.iterator]()) to iterate by Unicode code points; each yielded element is a Unicode code point string with surrogate pairs preserved.
- String.prototype.codePointAt(index) returns a numeric code point for a given UTF-16 index: if index points at a leading surrogate it returns the combined code point; if index points at a trailing surrogate it returns the trailing code unit value; out-of-range returns undefined.
- When measuring Hamming distance in terms of user-perceived characters, convert both inputs to code-point sequences (Array.from or iterator) and ensure equal code-point lengths before comparison.

1.3 String-based Hamming distance (code-point aware algorithm)
Preconditions:
- Both inputs must be strings; otherwise throw TypeError.
- Compare sequences in code points; if code-point lengths differ, throw RangeError('Strings must have the same length in code points').
Array.from variant (clear, O(n) memory):
1. ra = Array.from(a)
2. rb = Array.from(b)
3. if ra.length !== rb.length throw RangeError('Strings must have the same length in code points')
4. count = 0; for i = 0 .. ra.length-1: if ra[i] !== rb[i] then count++
5. return count
Iterator simultaneous variant (O(1) extra memory):
1. Ia = a[Symbol.iterator]() and Ib = b[Symbol.iterator]()
2. loop: na = Ia.next(); nb = Ib.next(); if na.done !== nb.done then throw RangeError
3. if na.value !== nb.value then count++
4. return count
Notes: comparison uses strict equality on code-point strings; grapheme clusters may be split (this compares code points, not grapheme clusters).

1.4 Integer/BigInt Hamming distance (bitwise XOR + popcount)
Preconditions and validation:
- Accept Number (integer) or BigInt for x and y. If type is neither, throw TypeError.
- For Number inputs: require Number.isInteger(x) and x >= 0, otherwise throw TypeError or RangeError.
- Convert Number inputs to BigInt before bitwise operations: bx = BigInt(x); by = BigInt(y); assert bx >= 0n and by >= 0n.
Core operation (BigInt-safe):
1. v = bx ^ by  // BigInt XOR
2. distance = popcount(v)
3. return distance as Number (if within safe range) or Number coerced from algorithm's integer count
Notes: JavaScript Number bitwise operators coerce to 32-bit signed integers and will produce incorrect results for values outside 32-bit range; use BigInt for larger widths and explicit BigInt conversion.

1.5 Popcount implementations and tradeoffs
- Kernighan (Wegner) algorithm (per-set-bit):
  count = 0; while (v !== 0n) { v &= v - 1n; count++; } return count
  Complexity O(k) where k = number of set bits. Best for sparse bitsets.
- Bit-shift loop (naive):
  count = 0; while (v !== 0n) { count += Number(v & 1n); v >>= 1n; } return count
  Complexity O(w) where w = bit-width of v; simplest and robust.
- Lookup-table (byte-wise):
  table[0..255] precomputed; sum over v's 8-bit chunks: while (v !== 0n) { sum += table[Number(v & 0xffn)]; v >>= 8n } return sum
  Memory: 256 entries; complexity O(w/8).
- Parallel-add / masks (fixed-width): use bit masks and arithmetic to compute popcount in O(log w) operations when fixed-width words available (constants m1,m2,m4,...,h01 for 64-bit). Prefer when working with native 64-bit types or vectorized instructions.
- Hardware intrinsic: prefer CPU POPCNT or language intrinsics (e.g., __builtin_popcount, Integer.bitCount) when available for highest performance.

2. SUPPLEMENTARY DETAILS

2.1 Implementation notes and performance guidance
- Use Array.from for clarity and correctness on moderately sized strings; for very large strings or constrained memory, prefer iterator-based simultaneous comparison to avoid O(n) temporary buffers.
- Use BigInt for integer inputs exceeding 32-bit range. Convert all Number inputs to BigInt explicitly before bitwise ops to avoid TypeError and 32-bit truncation.
- For repeated popcount operations with varying values, use lookup-table or intrinsic; for sparse differences use Kernighan; for dense or fixed-width use parallel-add masks.
- Consider using length bounds checks on untrusted inputs to avoid denial-of-service via memory exhaustion when building code-point arrays.

2.2 Memory and security considerations
- Do not allocate large intermediate arrays from untrusted inputs without maximum-length checks. Use streaming/iterator approach for unbounded inputs.
- Validate numeric ranges before BigInt conversion to avoid exceptions and clearly document thrown error types for callers.

3. REFERENCE DETAILS

3.1 hammingDistance(a, b)
Signature: hammingDistance(a: string, b: string) -> number
Validations and exact errors:
- if typeof a !== 'string' || typeof b !== 'string' -> throw TypeError('Both arguments must be strings')
- ra = Array.from(a); rb = Array.from(b); if ra.length !== rb.length -> throw RangeError('Strings must have the same length in code points')
Behavior: returns integer count >= 0 representing code-point-wise mismatches; uses strict equality for code-point strings.
Complexity: O(n) time, O(n) extra memory (Array.from variant); O(n) time, O(1) extra memory (iterator variant).

3.2 hammingDistanceBits(x, y)
Signature: hammingDistanceBits(x: number|bigint, y: number|bigint) -> number
Validations and exact errors (canonical JS patterns):
- if (typeof x !== 'bigint' && typeof x !== 'number') throw TypeError('x must be a number or bigint')
- if (typeof y !== 'bigint' && typeof y !== 'number') throw TypeError('y must be a number or bigint')
- if (typeof x === 'number' && !Number.isInteger(x)) throw TypeError('x must be an integer')
- if (typeof y === 'number' && !Number.isInteger(y)) throw TypeError('y must be an integer')
- if (x < 0 || y < 0) throw RangeError('Integers must be non-negative')
Conversion and core logic:
- const bx = (typeof x === 'bigint') ? x : BigInt(x)
- const by = (typeof y === 'bigint') ? y : BigInt(y)
- if (bx < 0n || by < 0n) throw RangeError('Integers must be non-negative')
- v = bx ^ by  // BigInt XOR
- compute popcount(v) using preferred algorithm and return Number count
Notes: return type canonicalized to Number for typical distances; implementers may return BigInt for extremely large counts but callers should expect Number.

3.3 Popcount function signatures and exact algorithms
- popcountKernighan(v: bigint) -> number
  let count = 0; while (v !== 0n) { v &= v - 1n; count++; } return count
- popcountShift(v: bigint) -> number
  let count = 0; while (v !== 0n) { count += Number(v & 1n); v >>= 1n; } return count
- popcountLookup(v: bigint, table: Uint8Array[256]) -> number
  let sum = 0; while (v !== 0n) { sum += table[Number(v & 0xffn)]; v >>= 8n; } return sum
- popcountParallel64(x: number|bigint) -> number
  Use fixed-width mask constants and arithmetic reduction for 64-bit inputs; final return is integer count.

3.4 JavaScript bitwise semantics and conversion rules
- Number bitwise operators: ToInt32 coercion; operands cast to 32-bit signed ints, operations operate in 32-bit signed domain, results converted back to Number. Therefore Numbers outside 32-bit will be truncated and yield incorrect bit-level results.
- BigInt bitwise operators: require both operands be BigInt; mixing Number and BigInt causes TypeError. Use explicit BigInt conversions when doing bitwise work on large integers.
- Shifts: >>, << on Numbers operate on 32-bit values; BigInt shifts accept BigInt shift amount and operate on arbitrary-width signed BigInt.

4. DETAILED DIGEST AND PROVENANCE
Technical content extracted from authoritative sources on 2026-03-11 (retrieval date):
- Wikipedia — Hamming distance: formal definition, metric properties, relation to popcount via XOR, use in error-detection/correction (minimum distance, detect/correct thresholds).
- Wikipedia — Hamming weight: multiple popcount algorithms (Kernighan, lookup table, parallel-add masks), CPU instruction references (POPCNT/VCNT), algorithm tradeoffs.
- MDN String.codePointAt: exact codePointAt semantics and guidance to iterate by code points using Array.from or Symbol.iterator.
- MDN String[Symbol.iterator]: iterator yields Unicode code-point strings; note on grapheme clusters and surrogate pairs.
- MDN Bitwise Operators: JS Number bitwise coercion to 32-bit signed ints, operator list and spec references.
- npm package hamming-distance: HTTP 403 on fetch; repository-local implementations and package.json build script embed canonical JS implementations used here.

Retrieval date: 2026-03-11

5. ATTRIBUTION AND CRAWL DATA
Sources retrieved and status:
- https://en.wikipedia.org/wiki/Hamming_distance — fetched (retrieved 2026-03-11)
- https://en.wikipedia.org/wiki/Hamming_weight — fetched (retrieved 2026-03-11)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt — fetched (retrieved 2026-03-11)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/%40%40iterator — fetched (retrieved 2026-03-11)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators — fetched (retrieved 2026-03-11)
- https://www.npmjs.com/package/hamming-distance — fetch failed (HTTP 403) on 2026-03-11

Crawl data: five URLs fetched successfully, one failed (403). Total approximate bytes retrieved: 76 KB.

[END DOCUMENT]
