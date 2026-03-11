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
5. Attribution and Crawl Data

1. NORMALISED EXTRACT

1.1 Definitions
Hamming distance: For two equal-length sequences, the number of positions where corresponding symbols differ.
Hamming weight / popcount: Number of 1-bits in a binary representation. For integers a and b: HammingDistance(a,b) = popcount(a XOR b).
Time complexity: O(n) across sequence length for per-element scans. Popcount algorithms complexity varies: O(k) where k=set bits (Kernighan), O(w) scanning bits, O(w/8) for byte-table lookup, O(log w) for parallel-add masks.

1.2 Unicode string handling (JavaScript specifics)
- JavaScript String.length returns count of UTF-16 code units; surrogate pairs for code points > 0xFFFF occupy two code units.
- To operate on user-visible Unicode code points use code-point iteration: Array.from(str) or for (const ch of str) (str[Symbol.iterator]()). Each yielded element is a JavaScript string representing one Unicode code point.
- String.prototype.codePointAt(index) returns numeric code point starting at the UTF-16 index; caution: codePointAt on a trailing surrogate returns the trailing code unit value.
- When Hamming distance must reflect user-visible characters, compare sequences of code points and require equal code-point lengths before comparison.

1.3 String-based Hamming distance (code-point aware algorithm)
Preconditions and exact error behaviour:
- Inputs: both arguments must be of type string. If typeof a !== 'string' || typeof b !== 'string' then throw TypeError('Both arguments must be strings').
- Comparison mode: code-point-wise. Convert inputs to iterables of code points using Array.from or the iterator protocol.
- Length requirement: require equal code-point lengths; if ra.length !== rb.length then throw RangeError('Strings must have the same length in code points').
Algorithm (Array.from, O(n) memory):
1. const ra = Array.from(a);
2. const rb = Array.from(b);
3. if (ra.length !== rb.length) throw RangeError('Strings must have the same length in code points');
4. let count = 0; for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) count++;
5. return count;
Iterator simultaneous implementation (O(1) extra memory):
1. const Ia = a[Symbol.iterator](); const Ib = b[Symbol.iterator]();
2. loop: na = Ia.next(); nb = Ib.next(); if (na.done !== nb.done) throw RangeError('Strings must have the same length in code points');
3. if (na.value !== nb.value) count++;
4. return count;
Note: This compares code points, not grapheme clusters; combining marks, regional indicators, and ZWJ sequences count as multiple code points.

1.4 Integer/BigInt Hamming distance (bitwise XOR + popcount)
Preconditions and validation (explicit JavaScript patterns):
- Accept Number (integer) or BigInt for x and y; otherwise throw TypeError.
- For Number inputs enforce Number.isInteger(x) and x >= 0; if not, throw TypeError or RangeError as appropriate.
- Convert Number inputs to BigInt before bitwise operations:
  const bx = typeof x === 'bigint' ? x : BigInt(x);
  const by = typeof y === 'bigint' ? y : BigInt(y);
  if (bx < 0n || by < 0n) throw RangeError('Integers must be non-negative').
Core operation (BigInt-safe):
1. let v = bx ^ by  // BigInt XOR
2. distance = popcount(v) // use a BigInt-capable popcount implementation
3. return distance as Number (or BigInt if counts may exceed Number.MAX_SAFE_INTEGER)
Notes: JavaScript Number bitwise operators coerce operands to 32-bit signed integers and return Number results; use BigInt bitwise operators for arbitrary-width operations and prefer BigInt when inputs may exceed 32 bits.

1.5 Popcount implementations and tradeoffs
popcountKernighan (per-set-bit):
- Signature: popcountKernighan(v: bigint): number
- Implementation: count = 0; while (v !== 0n) { v &= v - 1n; count++; } return count;
- Complexity: O(k) where k is number of set bits. Best when v is sparse.

popcountShift (bit-scanning):
- Signature: popcountShift(v: bigint): number
- Implementation: count = 0; while (v !== 0n) { count += Number(v & 1n); v >>= 1n; } return count;
- Complexity: O(w) where w is bit-width. Simple and constant-memory.

popcountLookup (byte-wise table):
- Signature: popcountLookup(v: bigint, table: Uint8Array): number
- Implementation: Precompute table[0..255] => popcount for each byte. Loop: while (v !== 0n) { sum += table[Number(v & 0xffn)]; v >>= 8n; } return sum;
- Complexity: O(w/8) table lookups; uses memory for table (256 bytes) and is efficient for wide words.

Parallel/add-mask popcount (word-level, constant-time using arithmetic):
- Use fixed-width masks and additions to fold bit counts: suitable for 32/64-bit fixed-width integers in languages with native integer widths. Not directly efficient in BigInt without fixed-width masking.

2. SUPPLEMENTARY DETAILS

2.1 Implementation notes and performance guidance
- Prefer BigInt arithmetic for inputs that may exceed 32 bits to avoid ToInt32 coercion of JS bitwise ops.
- For small integers (< 32 bits) using Number and native bitwise operators improves speed but requires inputs be in signed 32-bit range; mask to >>> 0 when treating as unsigned.
- Use popcountLookup for large, dense inputs where performance matters and memory for a 256-entry table is acceptable.
- Use Kernighan method when v is expected to be sparse (few set bits) to reduce iterations.
- For streaming or memory-constrained environments use iterator-based string comparison to avoid O(n) allocation from Array.from.

2.2 Memory, numeric and security considerations
- Avoid Array.from for extremely large strings if memory is constrained; use iterator to compare code points lazily.
- Do not accept negative integers; explicitly validate and throw RangeError when negatives are supplied.
- When returning counts for BigInt inputs, cast to Number only if guaranteed to be within Number.MAX_SAFE_INTEGER; otherwise return a BigInt count to preserve exactness.
- Be explicit in exception messages to aid consumers: use TypeError for wrong types and RangeError for length or value range violations.

3. REFERENCE DETAILS (API SPECIFICATIONS, EXACT PATTERNS)

3.1 JavaScript function signatures and parameter validation
- function hammingDistance(a: string, b: string): number
  - Checks: if (typeof a !== 'string' || typeof b !== 'string') throw TypeError('Both arguments must be strings');
  - Uses code-point iteration (Array.from or iterator). If code-point lengths differ throw RangeError('Strings must have the same length in code points').
  - Returns integer count >= 0.

- function hammingDistanceBits(x: number | bigint, y: number | bigint): number | bigint
  - Checks: validate typeof x and y; if numbers ensure Number.isInteger(x) and x >= 0; if invalid throw TypeError/RangeError as appropriate.
  - Normalize: const bx = typeof x === 'bigint' ? x : BigInt(x); const by = typeof y === 'bigint' ? y : BigInt(y);
  - Core: let v = bx ^ by; let count = popcount(v); return (count <= Number.MAX_SAFE_INTEGER ? Number(count) : count);

3.2 Popcount method signatures and algorithms
- popcountKernighan(v: bigint): number
  - while (v !== 0n) { v &= v - 1n; ++count; }

- popcountShift(v: bigint): number
  - while (v !== 0n) { count += Number(v & 1n); v >>= 1n; }

- popcountLookup(v: bigint): number
  - table: Uint8Array(256) pre-filled with byte popcounts
  - while (v !== 0n) { sum += table[Number(v & 0xffn)]; v >>= 8n; }

3.3 Fixed-width masks and constants (64-bit examples)
- Masks for parallel-add method (for 64-bit fixed-width integers):
  - m1 = 0x5555555555555555n  // binary: 0101...
  - m2 = 0x3333333333333333n  // binary: 00110011...
  - m4 = 0x0f0f0f0f0f0f0f0fn
  - h01 = 0x0101010101010101n
- Parallel-add algorithm outline (for 64-bit unsigned integer u):
  - u = u - ((u >> 1) & m1);
  - u = (u & m2) + ((u >> 2) & m2);
  - u = (u + (u >> 4)) & m4;
  - result = Number((u * h01) >> 56n);
Note: In JavaScript BigInt this works if u is masked to 64 bits before each step; ensure masking with & (0xffffffffffffffffn).

3.4 Errors, exceptions and edge-case handling
- Strings: TypeError for non-strings; RangeError when code-point lengths mismatch. Message canonicalization: 'Both arguments must be strings' and 'Strings must have the same length in code points'.
- Integers: TypeError for wrong types; TypeError when Number inputs are non-integers; RangeError for negative values. Messages: 'x must be a number or bigint', 'x must be an integer', 'Integers must be non-negative'.
- Popcount: Accept zero value input and return zero; handle extremely wide BigInt by using table or Kernighan to avoid indefinite loops.

4. DETAILED DIGEST AND PROVENANCE
- Extracted content from the following sources on 2026-03-11 (retrieval date: 2026-03-11):
  1) https://en.wikipedia.org/wiki/Hamming_distance  — Definitions, formal properties, use cases.
  2) https://en.wikipedia.org/wiki/Hamming_weight   — Popcount definitions and algorithmic variants.
  3) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt  — codePointAt behaviour and caveats.
  4) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/@@iterator  — String iterator yields code points.
  5) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators  — JS bitwise operator coercion to 32-bit and BigInt operator semantics.
  6) https://www.npmjs.com/package/hamming-distance  — NPM package patterns and common API choices.
- Digest: The technical content above normalises definitions, exact validation behaviours, algorithm choices, code-point vs grapheme semantics, three concrete popcount implementations, and fixed-width parallel-add masks and steps useful for 64-bit implementations.

5. ATTRIBUTION AND CRAWL DATA
- Sources enumerated above; retrieval date: 2026-03-11.
- Source count: 6 web resources.
- Crawl metadata: original crawl payload not included; this document extracts and normalises the technical content from those sources. If exact byte counts are required provide the crawl output to compute precise sizes.

---
Supplementary: store this document as library/HAMMING_DISTANCE.md for direct consumption by the mission code and documentation.
