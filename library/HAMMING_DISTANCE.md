DOCUMENT: HAMMINGING_DISTANCE

TABLE OF CONTENTS
1. Normalised Extract
  1.1 Definitions
  1.2 Unicode string handling (JS)
  1.3 String-based Hamming distance (code-point aware)
  1.4 Bitwise Hamming distance (integer/BigInt)
  1.5 Popcount algorithms
2. Supplementary Details
  2.1 Implementation notes and performance
  2.2 Memory considerations
3. Reference Details (API signatures, parameters, returns, errors)
  3.1 Function signatures
  3.2 Exact thrown errors and messages
  3.3 Implementation patterns (code-level operations)
  3.4 Configuration and environment effects
  3.5 Troubleshooting procedures
4. Detailed Digest and Provenance
5. Attribution and Data Size

1. NORMALISED EXTRACT

1.1 Definitions
Hamming distance: for two equal-length sequences, the count of positions where corresponding symbols differ.
Hamming weight (popcount): number of 1-bits in a binary representation.
For binary/integer inputs: distance(a,b) = popcount(xor(a,b)).

1.2 Unicode string handling (JS)
- JavaScript String.length reports UTF-16 code unit count; to treat Unicode code points (surrogate pairs) use the string iterator or Array.from.
- Use Array.from(string) or for (const cp of string) to obtain entries where each entry is a complete Unicode code point (surrogate pairs preserved).
- When using codePointAt(index) manually, advance index by 1 for single-unit code points or by 2 when a surrogate pair was consumed. codePointAt returns undefined when index out of range.

1.3 String-based Hamming distance (code-point aware)
Preconditions:
- Inputs: a and b must be strings. Validate types before processing.
- Compute code-point arrays: ra = Array.from(a); rb = Array.from(b).
- If ra.length !== rb.length then computation is invalid; throw RangeError('Strings must have the same length in code points').
Algorithm (operational steps):
1. ra = Array.from(a); rb = Array.from(b).
2. If ra.length !== rb.length throw RangeError.
3. let count = 0.
4. For i = 0..ra.length-1: if ra[i] !== rb[i] then count++.
5. Return count as a non-negative integer.
Complexity: O(n) time, O(n) extra if arrays are allocated; alternative streaming simultaneous iteration can achieve O(1) extra memory and still O(n) time.

1.4 Bitwise Hamming distance (integer/BigInt)
Preconditions and types:
- Accept x,y as Number (integer) or BigInt; do not mix runtime-level Number and BigInt in bitwise ops.
- Validate Number inputs: Number.isInteger(x) and x >= 0.
- Convert Number inputs to BigInt for bitwise operations: bx = BigInt(x); by = BigInt(y).
- After conversion ensure bx >= 0n and by >= 0n, otherwise throw RangeError('Integers must be non-negative').
Core operation:
- v = bx ^ by  // BigInt XOR
- distance = popcount(v)
Popcount choices:
- Kernighan's algorithm (recommended for sparse set bits):
  count = 0
  while (v !== 0n) { v &= v - 1n; count++ }
  return count
  Complexity: O(k) where k = number of set bits in v.
- Naive bit-shift loop:
  count = 0
  while (v !== 0n) { count += Number(v & 1n); v >>= 1n }
  return count
  Complexity: O(b) where b = bit-width.
- Lookup table (byte-wise): precompute table[0..255]; split v into 8-bit chunks and sum table entries. Complexity O(b/8).
Notes:
- Avoid Number-based bitwise operators for inputs > 32-bit signed range because Number operands are coerced to 32-bit signed ints.
- BigInt bitwise ops require both operands be BigInt; explicit conversion is mandatory.

1.5 Popcount algorithms (concise)
- Kernighan/Wegner: while (x) { x &= x-1; ++count } — iterate one time per set bit.
- Parallel-add / multiply-and-shift: sequence of masks and additions yielding O(log w) arithmetic operations for fixed-width integers; use when hardware popcnt not available and values are dense.
- Lookup table: precompute popcounts for a byte or 16-bit word and sum chunks, memory vs speed tradeoff.

2. SUPPLEMENTARY DETAILS

2.1 Implementation notes and performance
- Prefer Array.from for clarity and correctness when inputs are moderate sized; for very long strings and tight memory budgets implement simultaneous iterators:
  - Create iterators Ia = a[Symbol.iterator](), Ib = b[Symbol.iterator]() and loop: for (;;) { let na = Ia.next(); let nb = Ib.next(); if (na.done || nb.done) break; if (na.value !== nb.value) count++; }
  - After loop, if na.done !== nb.done then lengths differ -> throw RangeError.
- For BigInt popcount, Kernighan's algorithm yields minimal iterations when v has few set bits; if v has many set bits and fixed maximal width, use lookup or parallel-add variants.
- For performance on Node.js and modern platforms, prefer BigInt-based Kernighan for simplicity; benchmark with representative workloads.

2.2 Memory considerations
- Array.from duplicates string into an array of substring elements; memory ~= O(n) extra where n is code-point count.
- Iterator-based approach uses O(1) extra memory and avoids temporary arrays.
- Lookup table (256 entries) uses negligible memory (256 integers) and reduces BigInt chunk processing overhead.

3. REFERENCE DETAILS

3.1 Function signatures (exact)
- hammingDistance(a: string, b: string) -> number
- hammingDistanceBits(x: number|bigint, y: number|bigint) -> number

3.2 Exact thrown errors and messages (must match implementation)
- hammingDistance:
  - if (typeof a !== 'string' || typeof b !== 'string') throw new TypeError('Both arguments must be strings')
  - if (ra.length !== rb.length) throw new RangeError('Strings must have the same length in code points')
- hammingDistanceBits:
  - if (!isBigIntX && typeof x !== 'number') throw new TypeError('x must be a number or bigint')
  - if (!isBigIntY && typeof y !== 'number') throw new TypeError('y must be a number or bigint')
  - if (!isBigIntX && !Number.isInteger(x)) throw new TypeError('x must be an integer')
  - if (!isBigIntY && !Number.isInteger(y)) throw new TypeError('y must be an integer')
  - if (!isBigIntX && x < 0) throw new RangeError('Integers must be non-negative')
  - if (!isBigIntY && y < 0) throw new RangeError('Integers must be non-negative')
  - after conversion if (bx < 0n || by < 0n) throw new RangeError('Integers must be non-negative')

3.3 Implementation patterns (exact operational steps)
- String variant (exact):
  const ra = Array.from(a);
  const rb = Array.from(b);
  if (ra.length !== rb.length) throw new RangeError('Strings must have the same length in code points');
  let count = 0;
  for (let i = 0; i < ra.length; i++) { if (ra[i] !== rb[i]) count++; }
  return count;
- Bitwise variant (exact, BigInt-safe):
  const isBigIntX = typeof x === 'bigint';
  const isBigIntY = typeof y === 'bigint';
  if (!isBigIntX && typeof x !== 'number') throw new TypeError('x must be a number or bigint');
  if (!isBigIntY && typeof y !== 'number') throw new TypeError('y must be a number or bigint');
  if (!isBigIntX) { if (!Number.isInteger(x)) throw new TypeError('x must be an integer'); if (x < 0) throw new RangeError('Integers must be non-negative'); }
  if (!isBigIntY) { if (!Number.isInteger(y)) throw new TypeError('y must be an integer'); if (y < 0) throw new RangeError('Integers must be non-negative'); }
  const bx = isBigIntX ? x : BigInt(x);
  const by = isBigIntY ? y : BigInt(y);
  if (bx < 0n || by < 0n) throw new RangeError('Integers must be non-negative');
  let v = bx ^ by;
  let count = 0;
  while (v) { v &= v - 1n; count++; }
  return count;

3.4 Configuration and environment effects
- Node/JS version: BigInt and String iterator behavior require modern JS engines (Node >= 10 for bigints? but Node >= 24 per package.json engines). For consistent behavior use Node >= 24.0.0 as declared.
- Number bitwise operators coerce to 32-bit signed integers; avoid Number bitwise ops for integers outside 32-bit signed range.

3.5 Troubleshooting procedures (step-by-step)
- Unicode mismatch results:
  1. Verify both inputs were converted using Array.from or iterators; check for accidental use of String.length.
  2. If using codePointAt with manual index, ensure index increments by 1 or 2 depending on the returned code point and that indices are integer.
- Unexpected negative or truncated bit counts:
  1. Confirm Number inputs were converted to BigInt before bitwise ops.
  2. Check for accidental use of >> vs >>>; >>> is not defined for BigInt.
- Performance problems with large integers:
  1. If Kernighan loop iterates many times, measure set bit density; if high, switch to byte-wise lookup or parallel-add algorithm.

4. DETAILED DIGEST AND PROVENANCE
Content extracted from SOURCES.md sections and remote pages on 2026-03-11. Key technical extracts used include definitions of Hamming distance and Hamming weight, MDN API behaviors for String.codePointAt and String[Symbol.iterator], JavaScript bitwise operator semantics, and popcount algorithm descriptions (Wegner/Kernighan, lookup, parallel-add). npm hamming-distance package referenced but page returned HTTP 403 at fetch time and was not retrieved.

Retrieved pages and approximate sizes:
- https://en.wikipedia.org/wiki/Hamming_distance  ~38k chars
- https://en.wikipedia.org/wiki/Hamming_weight   ~64k chars
- MDN String.codePointAt                          ~6.5k chars
- MDN String[Symbol.iterator]                     ~4.2k chars
- MDN Bitwise operators                           ~12k chars
- npm hamming-distance                            HTTP 403 (not retrieved)
Total approx characters retrieved: 124,700
Retrieval date: 2026-03-11

5. ATTRIBUTION AND DATA SIZE
- Sources: Wikipedia (Hamming distance, Hamming weight), MDN Web Docs (String.codePointAt, String[Symbol.iterator], Bitwise operators). npm registry entry listed but inaccessible (403) at retrieval.
- Retrieval date: 2026-03-11
- Data size retrieved: ~124,700 characters across successfully fetched pages; npm page returned 403.

END OF DOCUMENT
