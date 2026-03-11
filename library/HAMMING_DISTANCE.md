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
3. Reference Details (API signatures, exact patterns)
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
Time complexity: O(n) across sequence length for per-element scans. Popcount algorithms vary: O(k) where k=set bits (Kernighan), O(w) scanning bits, O(w/8) for byte-table lookup, O(log w) for parallel-add masks.

1.2 Unicode string handling (JavaScript specifics)
- JavaScript String.length returns count of UTF-16 code units; surrogate pairs (code points > 0xFFFF) occupy two code units.
- Use code-point iteration to operate on user-visible characters: Array.from(str) or for (const ch of str) (str[Symbol.iterator]()). Each yielded element is a string representing one Unicode code point.
- String.prototype.codePointAt(index) returns the numeric code point starting at the UTF-16 index; careful: codePointAt on a trailing surrogate returns the trailing code unit value.
- When Hamming distance must reflect user-visible characters, compare sequences of code points (Array.from or iterator) and require equal code-point lengths before comparison.

1.3 String-based Hamming distance (code-point aware algorithm)
Preconditions and exact error behaviour:
- Inputs must be strings. If typeof a !== 'string' || typeof b !== 'string' then throw TypeError('Both arguments must be strings').
- Comparison is code-point-wise. Convert: ra = Array.from(a); rb = Array.from(b).
- If ra.length !== rb.length then throw RangeError('Strings must have the same length in code points').
Array.from implementation (explicit, O(n) memory):
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
Note: This compares code points, not grapheme clusters; combining marks, regional indicators, or ZWJ sequences that form a single grapheme cluster will be treated as multiple code points.

1.4 Integer/BigInt Hamming distance (bitwise XOR + popcount)
Preconditions and validation (explicit JS patterns):
- Accept Number (integer) or BigInt for x and y; otherwise throw TypeError.
- For Number inputs require Number.isInteger(x) and x >= 0; if not, throw TypeError or RangeError as appropriate.
- Convert Number inputs to BigInt before bitwise operations: const bx = typeof x === 'bigint' ? x : BigInt(x); const by = typeof y === 'bigint' ? y : BigInt(y); if (bx < 0n || by < 0n) throw RangeError('Integers must be non-negative').
Core operation (BigInt-safe):
1. let v = bx ^ by  // BigInt XOR
2. distance = popcount(v) // use a BigInt-capable popcount implementation
3. return distance as Number (or BigInt if counts may exceed Number.MAX_SAFE_INTEGER)
Notes: JavaScript Number bitwise operators coerce operands to 32-bit signed integers and are unsuitable for widths beyond 32 bits; use BigInt for arbitrary-width integer bit operations.

1.5 Popcount implementations and tradeoffs
- popcountKernighan (per-set-bit):
  count = 0
  while (v !== 0n) {
    v &= v - 1n
    count++
  }
  return count
  Complexity: O(k) where k is number of set bits. Best when v sparse.

- popcountShift (bit-scanning):
  count = 0
  while (v !== 0n) {
    count += Number(v & 1n)
    v >>= 1n
  }
  return count
  Complexity: O(w) where w is bit-width. Simple and constant-memory.

- popcountLookup (byte-wise table):
  Precompute table[0..255] = popcount for each byte
  sum = 0
  while (v !== 0n) {
    sum += table[Number(v & 0xffn)]
    v >>= 8n
  }
  return sum
  Tradeoff: uses 256-byte table, faster for dense values and large widths.

- Parallel-add (word-level constant-time) algorithms exist for fixed-width integers (32/64-bit) using arithmetic masks; implement in typed languages where constants and shifts are defined for the width.


2. SUPPLEMENTARY DETAILS

2.1 Implementation notes and performance guidance
- For short strings and typical text use Array.from implementation for clarity and correctness.
- For very long strings where memory matters, use the iterator simultaneous implementation to avoid creating arrays of code points.
- For bit distances on 64-bit or narrower integers in native environments prefer CPU popcount instruction or hardware intrinsics.
- For BigInt values in JS, prefer popcountKernighan when set bits expected to be few; use lookup or parallel methods when values are dense.
- When exposing APIs intended for external users, normalise inputs explicitly (trim, NFC if needed) and document that comparison is code-point based (not grapheme cluster based).

2.2 Memory, numeric and security considerations
- Converting very large strings to Array.from may allocate O(n) additional memory and can be DoS-vectored by maliciously large inputs; validate and limit maximum allowed length before conversion.
- When accepting Number inputs, validate integerness and non-negativity to avoid silent coercions; convert to BigInt for bitwise ops to preserve widths.
- Avoid using Number-based bitwise operators (| ^ &) on values that may exceed 32 bits.


3. REFERENCE DETAILS (API SPECIFICATIONS, SIGNATURES, PATTERNS)

3.1 JavaScript API signatures and parameter validation
- function hammingDistance(a, b)
  Parameters:
    a: string — required; must be a JavaScript string
    b: string — required; must be a JavaScript string
  Returns: Number — count of differing code points (integer >= 0)
  Throws: TypeError if a or b not string; RangeError if code-point lengths differ.
  Exact validation and steps:
    if (typeof a !== 'string' || typeof b !== 'string') throw new TypeError('Both arguments must be strings');
    const ra = Array.from(a); const rb = Array.from(b);
    if (ra.length !== rb.length) throw new RangeError('Strings must have the same length in code points');
    let count = 0; for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) count++;
    return count;

- function hammingDistanceBits(x, y)
  Parameters:
    x: number|bigint — required; Number must be integer and non-negative; BigInt must be non-negative.
    y: number|bigint — required; same constraints as x.
  Returns: Number — count of differing bits (>= 0); callers may choose BigInt for counts > Number.MAX_SAFE_INTEGER.
  Throws: TypeError if types invalid; RangeError if negative.
  Exact validation and steps:
    const isBigIntX = typeof x === 'bigint'; const isBigIntY = typeof y === 'bigint';
    if (!isBigIntX && typeof x !== 'number') throw new TypeError('x must be a number or bigint');
    if (!isBigIntY && typeof y !== 'number') throw new TypeError('y must be a number or bigint');
    if (!isBigIntX) { if (!Number.isInteger(x)) throw new TypeError('x must be an integer'); if (x < 0) throw new RangeError('Integers must be non-negative'); }
    if (!isBigIntY) { if (!Number.isInteger(y)) throw new TypeError('y must be an integer'); if (y < 0) throw new RangeError('Integers must be non-negative'); }
    const bx = isBigIntX ? x : BigInt(x); const by = isBigIntY ? y : BigInt(y);
    if (bx < 0n || by < 0n) throw new RangeError('Integers must be non-negative');
    let v = bx ^ by; // BigInt XOR
    return popcountBigInt(v);

3.2 Popcount method signatures and algorithms
- function popcountBigInt_Kernighan(v: BigInt): Number
  Implementation:
    let count = 0; while (v !== 0n) { v &= v - 1n; count++; } return count;

- function popcountBigInt_Shift(v: BigInt): Number
  Implementation:
    let count = 0; while (v !== 0n) { count += Number(v & 1n); v >>= 1n; } return count;

- function popcountBigInt_Lookup(v: BigInt, table: Uint8Array): Number
  Implementation:
    let sum = 0; while (v !== 0n) { sum += table[Number(v & 0xffn)]; v >>= 8n; } return sum;

3.3 Fixed-width masks and constants (64-bit examples)
- For 64-bit parallel-add popcount (in languages with 64-bit unsigned integers):
  const m1 = 0x5555555555555555n; // binary: 0101...
  const m2 = 0x3333333333333333n; // binary: 00110011...
  const m4 = 0x0f0f0f0f0f0f0f0fn; // binary: 4-bit groups
  const h01 = 0x0101010101010101n; // used for final multiplication and shift
  Algorithm (conceptual):
    x = x - ((x >> 1) & m1);
    x = (x & m2) + ((x >> 2) & m2);
    x = (x + (x >> 4)) & m4;
    return Number((x * h01) >> 56n);
  Note: Use only when operating on known 64-bit values in environments that support logical shifts and consistent masking.

3.4 Errors, exceptions and edge-case handling
- Always validate types before coercion to avoid silent conversion bugs.
- For string APIs, document that normalization (NFC/NFD) is caller responsibility if canonical equivalence is important.
- For APIs exposed to untrusted callers, enforce maximum lengths and numeric bounds to avoid resource exhaustion.


4. DETAILED DIGEST AND PROVENANCE
This document extracted technical material from the following sources (retrieved 2026-03-11):
- https://en.wikipedia.org/wiki/Hamming_distance
- https://en.wikipedia.org/wiki/Hamming_weight
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/@@iterator
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
- https://www.npmjs.com/package/hamming-distance

Content retrieved on: 2026-03-11T16:50:18.669Z


5. ATTRIBUTION AND CRAWL DATA
- Attribution: Source list above; derivative technical extract consolidated into this library document.
- Crawl data size: SOURCES.md file read was 519 bytes and contained 6 source URLs.  (SOURCES.md lines: 10)


SUPPLEMENTARY: STEP-BY-STEP TROUBLESHOOTING
- If string distances disagree with user-visible counts: confirm both strings are converted to code-point arrays (Array.from) and lengths match; if not, consider normalizing Unicode (NFC) before comparison.
- If bit-distance returns negative or incorrect values: confirm inputs were validated as non-negative integers and converted to BigInt before XOR; ensure using BigInt XOR (^) not Number bitwise operators.
- If performance is poor on large BigInt values: switch to byte-wise lookup popcount with a 256-entry table or use native CPU popcount via bindings.


CONCRETE BEST PRACTICES
- Public API: expose hammingDistance(a: string, b: string): number and hammingDistanceBits(x: number|bigint, y: number|bigint): number with clear runtime checks and documentation of code-point semantics.
- Defensive coding: avoid implicit coercions, document limits, and throw explicit TypeError/RangeError when preconditions violated.
- Testing: include unit tests covering surrogate pairs, combining marks, very large BigInt values, zero-length inputs, and invalid types.


