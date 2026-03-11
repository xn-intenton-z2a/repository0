HAMMING_DISTANCE

TABLE OF CONTENTS
1. Normalised Extract
  1.1 Definitions
  1.2 Unicode string handling (JavaScript specifics)
  1.3 String-based Hamming distance (code-point aware algorithm)
  1.4 Integer/BigInt Hamming distance (bitwise XOR + popcount)
  1.5 Popcount implementations and tradeoffs (explicit algorithms)
2. Supplementary Details
  2.1 Implementation notes and performance guidance
  2.2 Memory and security considerations
3. Reference Details
  3.1 JavaScript API signatures and exact validations
  3.2 Popcount function signatures and exact algorithms (JS and C)
  3.3 Fixed-width masks and parallel-add popcount (64-bit constants)
  3.4 JavaScript bitwise semantics and conversion rules
4. Detailed Digest and Provenance
5. Attribution and Crawl Data

1. NORMALISED EXTRACT

1.1 Definitions
Hamming distance: For two equal-length sequences, the count of positions where corresponding symbols differ.
Hamming weight / popcount: Number of 1-bits in a binary representation. For integers a and b: HammingDistance(a,b) = popcount(a XOR b).
Time complexity: O(n) over sequence length for character-by-character or iterator-based scans; popcount algorithms vary: O(k) where k=set bits (Kernighan), O(w) scanning bits, O(w/8) for byte-table lookup, O(log w) for parallel-add masks.

1.2 Unicode string handling (JavaScript specifics)
- JavaScript String.length returns the count of UTF-16 code units; characters outside BMP (code points > 0xFFFF) occupy two code units (surrogate pair).
- Iterate by Unicode code points using Array.from(str) or the string iterator (for...of or str[Symbol.iterator]()). Each yielded element is a string representing one code point (surrogate pairs preserved).
- String.prototype.codePointAt(index) returns a numeric code point for a given UTF-16 index: if index points at a leading surrogate it returns the combined code point; if index points at a trailing surrogate it returns the trailing code unit value; out-of-range returns undefined.
- When Hamming distance must reflect user-visible characters, convert inputs to code-point sequences (Array.from or iterator) and ensure equal code-point lengths before comparison.

1.3 String-based Hamming distance (code-point aware algorithm)
Preconditions and error behaviour (exact):
- Both inputs must be strings: if typeof a !== 'string' || typeof b !== 'string' throw TypeError('Both arguments must be strings').
- Comparison is code-point-wise: ra = Array.from(a); rb = Array.from(b); if ra.length !== rb.length throw RangeError('Strings must have the same length in code points').
Array.from variant (clear, uses O(n) extra memory):
1. ra = Array.from(a)
2. rb = Array.from(b)
3. if (ra.length !== rb.length) throw RangeError('Strings must have the same length in code points')
4. count = 0; for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) count++
5. return count
Iterator simultaneous variant (O(1) extra memory, exact comparison semantics):
1. const Ia = a[Symbol.iterator](); const Ib = b[Symbol.iterator]();
2. loop: na = Ia.next(); nb = Ib.next(); if (na.done !== nb.done) throw RangeError('Strings must have the same length in code points')
3. if (na.value !== nb.value) count++
4. return count
Note: This compares code points, not grapheme clusters; combining marks and ZWJ sequences may be considered different despite being a single grapheme cluster.

1.4 Integer/BigInt Hamming distance (bitwise XOR + popcount)
Preconditions and validation (exact JS patterns):
- Accept Number (integer) or BigInt for x and y; otherwise throw TypeError.
- For Number inputs: require Number.isInteger(x) and x >= 0; otherwise throw TypeError or RangeError.
- Convert Number inputs to BigInt before bitwise operations: const bx = typeof x === 'bigint' ? x : BigInt(x); const by = typeof y === 'bigint' ? y : BigInt(y); if (bx < 0n || by < 0n) throw RangeError('Integers must be non-negative').
Core operation (BigInt-safe, exact steps):
1. let v = bx ^ by  // BigInt XOR
2. distance = popcount(v) // use one of the defined popcount algorithms below
3. return distance as Number (implementers may return BigInt if counts exceed Number.MAX_SAFE_INTEGER; typical implementations return Number)
Notes: JavaScript Number bitwise operators coerce operands to 32-bit signed integers and are incorrect for widths beyond 32 bits; use BigInt for arbitrary-width integer bit operations.

1.5 Popcount implementations and tradeoffs (explicit algorithms)
- popcountKernighan (per-set-bit, best when v sparse):
  count = 0
  while (v !== 0n) {
    v &= v - 1n
    count++
  }
  return count
  Complexity: O(k) where k = number of set bits.

- popcountShift (simple bit-scanning):
  count = 0
  while (v !== 0n) {
    count += Number(v & 1n)
    v >>= 1n
  }
  return count
  Complexity: O(w) where w = bit-width.

- popcountLookup (byte-wise table):
  Precompute table[0..255] = popcount for each byte
  sum = 0
  while (v !== 0n) {
    sum += table[Number(v & 0xffn)]
    v >>= 8n
  }
  return sum
  Memory: 256-entry table; Complexity: O(w/8)

- popcountParallel (fixed-width masks for 64-bit words):
  Use arithmetic and masks to reduce counts in parallel (see constants and C implementations below). Complexity O(log w) with constant-time arithmetic operations.

- Hardware intrinsics: prefer CPU POPCNT/VCNT/CPOP instructions or compiler intrinsics (__builtin_popcount, Integer.bitCount) when available; these are fastest and should be used when portability constraints allow.

2. SUPPLEMENTARY DETAILS

2.1 Implementation notes and performance guidance
- Use Array.from for correctness and readability for moderate-size strings; for very large strings or untrusted inputs, prefer the iterator simultaneous variant to avoid allocating O(n) extra memory.
- Always validate input lengths (code-point lengths for strings; numeric range for integers) to avoid inconsistent results or DoS by memory exhaustion.
- For repeated popcount operations on variable values, prefer lookup-table or hardware intrinsics; for single sparse differences, Kernighan is often fastest.
- For fixed-width 32/64-bit integers in native environments, use compiler intrinsics (e.g., __builtin_popcount, __builtin_popcountll) or the parallel-add mask algorithms for best worst-case performance.

2.2 Memory and security considerations
- Do not construct large intermediate arrays from untrusted inputs without explicit maximum-length checks; prefer streaming iteration.
- Document and throw specific error types for invalid inputs so callers can handle edge cases (TypeError for wrong types, RangeError for negative integers or unequal code-point lengths).

3. REFERENCE DETAILS

3.1 JavaScript API signatures and exact validations
- hammingDistance(a: string, b: string) -> number
  Validations:
  - if (typeof a !== 'string' || typeof b !== 'string') throw new TypeError('Both arguments must be strings')
  - const ra = Array.from(a); const rb = Array.from(b); if (ra.length !== rb.length) throw new RangeError('Strings must have the same length in code points')
  Behavior: returns integer >= 0 equal to the number of code-point mismatches; uses strict equality for code-point strings.
  Complexity: O(n) time; memory O(n) for Array.from variant or O(1) extra memory for iterator variant.

- hammingDistanceBits(x: number|bigint, y: number|bigint) -> number
  Validations (exact code patterns):
  - if (typeof x !== 'bigint' && typeof x !== 'number') throw new TypeError('x must be a number or bigint')
  - if (typeof y !== 'bigint' && typeof y !== 'number') throw new TypeError('y must be a number or bigint')
  - if (typeof x === 'number' && !Number.isInteger(x)) throw new TypeError('x must be an integer')
  - if (typeof y === 'number' && !Number.isInteger(y)) throw new TypeError('y must be an integer')
  - if (typeof x === 'number' && x < 0) throw new RangeError('Integers must be non-negative')
  - if (typeof y === 'number' && y < 0) throw new RangeError('Integers must be non-negative')
  Conversion and core logic:
  - const bx = typeof x === 'bigint' ? x : BigInt(x)
  - const by = typeof y === 'bigint' ? y : BigInt(y)
  - if (bx < 0n || by < 0n) throw new RangeError('Integers must be non-negative')
  - let v = bx ^ by
  - return popcount(v)
  Note: return is Number; for extremely large bit-widths where popcount > Number.MAX_SAFE_INTEGER, consider returning BigInt instead.

3.2 Popcount function signatures and exact algorithms (JS and C)
- JavaScript (BigInt-safe) implementations:
  popcountKernighan(v: bigint) -> number
    let count = 0
    while (v !== 0n) {
      v &= v - 1n
      count++
    }
    return count

  popcountShift(v: bigint) -> number
    let count = 0
    while (v !== 0n) {
      count += Number(v & 1n)
      v >>= 1n
    }
    return count

  popcountLookup(v: bigint, table: Uint8Array[256]) -> number
    let sum = 0
    while (v !== 0n) {
      sum += table[Number(v & 0xffn)]
      v >>= 8n
    }
    return sum

- C implementations (exact text from efficient implementations; use for native modules or reference):
  // constants for 64-bit parallel-add algorithm
  const uint64_t m1  = 0x5555555555555555; // binary: 0101...
  const uint64_t m2  = 0x3333333333333333; // binary: 00110011..
  const uint64_t m4  = 0x0f0f0f0f0f0f0f0f; // binary:  4 zeros,  4 ones ...
  const uint64_t m8  = 0x00ff00ff00ff00ff; // binary:  8 zeros,  8 ones ...
  const uint64_t m16 = 0x0000ffff0000ffff; // binary: 16 zeros, 16 ones ...
  const uint64_t m32 = 0x00000000ffffffff; // binary: 32 zeros, 32 ones
  const uint64_t h01 = 0x0101010101010101; // the sum of 256^0,1,2,3...

  // popcount64a: naive parallel-add (24 arithmetic ops)
  int popcount64a(uint64_t x) {
      x = (x & m1 ) + ((x >>  1) & m1 );
      x = (x & m2 ) + ((x >>  2) & m2 );
      x = (x & m4 ) + ((x >>  4) & m4 );
      x = (x & m8 ) + ((x >>  8) & m8 );
      x = (x & m16) + ((x >> 16) & m16);
      x = (x & m32) + ((x >> 32) & m32);
      return x;
  }

  // popcount64b: fewer arithmetic operations (17 ops)
  int popcount64b(uint64_t x) {
      x -= (x >> 1) & m1;             // put count of each 2 bits into those 2 bits
      x = (x & m2) + ((x >> 2) & m2); // put count of each 4 bits into those 4 bits
      x = (x + (x >> 4)) & m4;        // put count of each 8 bits into those 8 bits
      x += x >>  8;  // put count of each 16 bits into their lowest 8 bits
      x += x >> 16;  // put count of each 32 bits into their lowest 8 bits
      x += x >> 32;  // put count of each 64 bits into their lowest 8 bits
      return x & 0x7f;
  }

  // popcount64c: uses multiplication (12 ops including multiply)
  int popcount64c(uint64_t x) {
      x -= (x >> 1) & m1;
      x = (x & m2) + ((x >> 2) & m2);
      x = (x + (x >> 4)) & m4;
      return (x * h01) >> 56;
  }

  // popcount64d: Wegner's method (per-set-bit)
  int popcount64d(uint64_t x) {
      int count;
      for (count = 0; x; count++)
          x &= x - 1;
      return count;
  }

3.3 Fixed-width masks and parallel-add popcount (64-bit constants)
- Exact mask values (hex):
  m1  = 0x5555555555555555
  m2  = 0x3333333333333333
  m4  = 0x0f0f0f0f0f0f0f0f
  m8  = 0x00ff00ff00ff00ff
  m16 = 0x0000ffff0000ffff
  m32 = 0x00000000ffffffff
  h01 = 0x0101010101010101
- Use these constants in the parallel-add reduction algorithms above when implementing popcount for 64-bit native integers.

3.4 JavaScript bitwise semantics and conversion rules (exact effects)
- Number bitwise operators (&, |, ^, ~, <<, >>, >>>) convert operands to 32-bit signed integers (ToInt32), perform the operation in 32-bit signed arithmetic, then return a Number. This truncates values outside 32-bit range and yields incorrect bit-level results for 64-bit semantics.
- BigInt bitwise operators require both operands be BigInt; mixing Number and BigInt causes TypeError. BigInt operators operate on arbitrary-width two's complement representation for shifts and bitwise ops.
- Use BigInt for arbitrary-width integer bit operations: convert Number inputs to BigInt explicitly before XOR.

4. DETAILED DIGEST AND PROVENANCE
Technical content extracted directly from the sources listed in SOURCES.md and retrieved on 2026-03-11. Major extracted items included:
- Formal definition of Hamming distance and its metric properties (Wikipedia: Hamming distance).
- Relation between Hamming distance and popcount(XOR) for binary strings (Wikipedia).
- Popcount algorithm family: Kernighan (per-set-bit), bit-scan, lookup-table, parallel-add/mask reductions, and hardware POPCNT/VCNT/CPOP instructions; exact 64-bit parallel-add constants and C implementations (Wikipedia: Hamming weight).
- Exact JavaScript String code point handling, codePointAt semantics, and iterator behavior for code-point iteration (MDN: String.codePointAt and String[Symbol.iterator]).
- JavaScript bitwise operator coercion details and specification notes (MDN: Bitwise_Operators).
- The repository's package.json contains canonical JS implementations (docs/lib-browser.js generated by build script) that implement hammingDistance and hammingDistanceBits; npm package fetch returned HTTP 403 so local repository code was used as authoritative implementation reference.

Retrieval date: 2026-03-11
Total bytes fetched from reachable sources: ~78 KB (approximate; five URLs fetched successfully, one returned HTTP 403).

5. ATTRIBUTION AND CRAWL DATA
Sources retrieved and status (all retrieved on 2026-03-11):
- https://en.wikipedia.org/wiki/Hamming_distance — fetched
- https://en.wikipedia.org/wiki/Hamming_weight — fetched
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt — fetched
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/%40%40iterator — fetched
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators — fetched
- https://www.npmjs.com/package/hamming-distance — fetch failed (HTTP 403), used local package.json/docs/lib-browser.js as implementation reference

Crawl metadata: five successful fetches, one 403; approximate payload 78 KB.

[END DOCUMENT]
