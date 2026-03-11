DOCUMENT: HAMMING_DISTANCE

TABLE OF CONTENTS
1. Normalised Extract
  1.1 Definitions
  1.2 Unicode string handling (JavaScript specifics)
  1.3 String-based Hamming distance (code-point aware algorithm)
  1.4 Integer/BigInt Hamming distance (bitwise XOR + popcount)
  1.5 Popcount algorithms and tradeoffs
2. Supplementary Details
  2.1 Implementation notes and performance guidance
  2.2 Memory and security considerations
3. Reference Details (API signatures, parameter checks, exact thrown errors)
  3.1 hammingDistance(a, b)
  3.2 hammingDistanceBits(x, y)
  3.3 Popcount implementations (signatures)
  3.4 JavaScript bitwise semantics and conversion rules
4. Detailed Digest and Provenance

Detailed digest (sources and retrieval date):
- Source: https://en.wikipedia.org/wiki/Hamming_distance — key definitions, metric properties, binary XOR relation, error-correction implications, Python/C examples, and complexity notes. Retrieved: 2026-03-11.
- Source: https://en.wikipedia.org/wiki/Hamming_weight — popcount definitions, CPU instruction support (POPCNT/VCNT/CPOP), efficient algorithms (tree-add, masks m1..h01), lookup table method, Wegner algorithm, Harley–Seal and Muła vectorized methods. Retrieved: 2026-03-11.
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt — exact semantics of String.prototype.codePointAt(index): returns code point integer, returns combined code point for leading surrogate pairs, returns trailing surrogate code unit if index is trailing surrogate, undefined out-of-range, and recommendation to iterate with for...of or String[Symbol.iterator] or Array.from to obtain code points. Retrieved: 2026-03-11.
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/%40%40iterator — Specification: String iterator yields Unicode code points as strings; surrogate pairs preserved; grapheme clusters may be split; examples showing emoji and ZWJ splitting; retrieved: 2026-03-11.
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators — JavaScript bitwise operators coerce operands to 32-bit signed integers, available operators (&, |, ^, ~, <<, >>, >>>), and specification links. Retrieved: 2026-03-11.
- npm package https://www.npmjs.com/package/hamming-distance returned 403 on fetch; repository's docs and code in this project provide canonical JS implementations. Retrieval attempt: 2026-03-11; status: 403 forbidden.

5. Attribution and crawl data
- Retrieval date: 2026-03-11
- Sources fetched: 5 URLs (one returned 403). Total bytes retrieved (approx): 76 KB.


5. Attribution and Crawl Data


1. NORMALISED EXTRACT

1.1 Definitions
Hamming distance: For two equal-length sequences, the count of positions where corresponding symbols differ.
Hamming weight (population count / popcount): Number of 1-bits in a binary representation. For binary strings a and b: distance(a, b) = popcount(a XOR b).
Complexity: Basic character-by-character or bit-by-bit algorithms are O(n) time; popcount variants trade time vs number-of-set-bits or word-parallelism.

1.2 Unicode string handling (JavaScript specifics)
- JavaScript String.length returns UTF-16 code unit count, not Unicode code points. Surrogate pairs occupy two code units.
- Use Array.from(str) or the string iterator (str[Symbol.iterator]() or for...of) to iterate by Unicode code points; each yielded element is a complete code point (surrogate pairs preserved).
- String.prototype.codePointAt(index): returns the code point at an index. If index points to a leading surrogate it returns the combined code point; if index points to trailing surrogate it returns the trailing code unit value. When iterating manually by index, advance index by 1 for single-unit code points, 2 when a surrogate pair is consumed.
- When comparing strings for Hamming distance in terms of characters, convert both strings to code-point arrays via Array.from or iterate both with their Symbol.iterator and compare values; lengths must match in code points.

1.3 String-based Hamming distance (code-point aware algorithm)
Preconditions and validation:
- Inputs must be strings; if not, throw TypeError.
- Must compare sequences of equal code-point length; if lengths differ, throw RangeError('Strings must have the same length in code points').
Operational algorithm (Array.from variant):
1. ra = Array.from(a); rb = Array.from(b);
2. if (ra.length !== rb.length) throw RangeError('Strings must have the same length in code points');
3. count = 0; for i from 0 to ra.length-1: if ra[i] !== rb[i] then count++;
4. return count (non-negative integer).
Space/time: O(n) time, O(n) extra memory for arrays. Use iterator-based simultaneous iteration to reduce extra memory to O(1):
- Ia = a[Symbol.iterator](); Ib = b[Symbol.iterator]()
- loop: na = Ia.next(); nb = Ib.next(); if na.done !== nb.done then throw RangeError; if na.value !== nb.value then count++;
- return count.

1.4 Integer/BigInt Hamming distance (bitwise XOR + popcount)
Preconditions and validation:
- Accept Number (integer) or BigInt for x and y; do not mix Number and BigInt in bitwise operations.
- For Number inputs: assert Number.isInteger(x) and x >= 0, else throw TypeError or RangeError as appropriate.
- Convert Number inputs to BigInt before performing large-width bitwise operations: bx = BigInt(x); by = BigInt(y); assert bx >= 0n and by >= 0n.
Core operation:
- v = bx ^ by   // BigInt XOR
- distance = popcount(v)
Return type: JavaScript Number (non-negative integer) or BigInt count if implementation chooses; canonical implementations return Number for distances within safe range.

1.5 Popcount algorithms and tradeoffs
- Kernighan (Wegner) algorithm (iterate per set bit):
  count = 0; while (v !== 0n) { v &= v - 1n; count++; } return count;
  Complexity O(k) where k = number of set bits. Best when v is sparse.
- Bit-shift loop (naive):
  count = 0; while (v !== 0n) { count += Number(v & 1n); v >>= 1n; } return count;
  Complexity O(b) where b = bit-width of v. Simpler but slower for wide values with few bits set.
- Lookup table (byte-wise): precompute table[0..255] then process v in 8-bit chunks and sum table entries. Memory small (256 bytes) and gives O(b/8) operations.
- Parallel-add / multiply-and-shift methods: use masks and arithmetic to compute popcount in O(log w) operations for fixed-width integers; exemplary constants and masks exist for 64-bit (m1, m2, m4, m8, m16, m32, h01) to implement popcount64 variants. Use when vectorized or when target supports fast arithmetic.
- Hardware intrinsic: use processor popcnt instruction or language intrinsics (GCC/Clang __builtin_popcount / __builtin_popcountll, C++ std::popcount, Java Integer.bitCount / Long.bitCount, BigInteger.bitCount).


2. SUPPLEMENTARY DETAILS

2.1 Implementation notes and performance guidance
- For moderately sized strings, choose Array.from for clarity and correctness; for extremely long strings or constrained memory, use simultaneous iterators to avoid O(n) temporary memory allocation.
- For integer distances where numbers may exceed 32 bits, always use BigInt for correctness; JavaScript Number bitwise operators coerce operands to 32-bit signed integers and will yield incorrect results for values outside that range.
- For BigInt popcount, prefer Kernighan when typical differences are sparse; prefer byte-wise lookup or parallel-add for dense bit patterns or when repeatedly computing popcounts on many values.
- If runtime exposes hardware popcount or library intrinsics, prefer those for performance.

2.2 Memory and security considerations
- Avoid building large intermediate arrays from untrusted input without bounds checks to prevent memory exhaustion; when inputs may be extremely long, stream via iterators and enforce maximum allowable lengths.
- When converting Number to BigInt, ensure values are within expected domain (non-negative) to avoid unexpected RangeErrors documented in reference API.


3. REFERENCE DETAILS (API signatures, parameter checks, exact thrown errors)

3.1 hammingDistance(a, b)
Signature:
  hammingDistance(a: string, b: string) -> number
Parameter validation and exact errors (canonical JS implementation):
  if (typeof a !== 'string' || typeof b !== 'string') throw new TypeError('Both arguments must be strings');
  const ra = Array.from(a); const rb = Array.from(b);
  if (ra.length !== rb.length) throw new RangeError('Strings must have the same length in code points');
Behavior:
  Counts code-point-wise differences using strict inequality (===/!== comparison on code-point strings). Returns integer count >= 0.
Complexity: O(n) time, O(n) extra memory. Iterator variant reduces memory to O(1).

3.2 hammingDistanceBits(x, y)
Signature:
  hammingDistanceBits(x: number|bigint, y: number|bigint) -> number
Parameter validation and exact errors (canonical JS implementation):
  - If typeof x !== 'bigint' and typeof x !== 'number' => throw TypeError('x must be a number or bigint')
  - If typeof y !== 'bigint' and typeof y !== 'number' => throw TypeError('y must be a number or bigint')
  - If x is Number and not Number.isInteger(x) => throw TypeError('x must be an integer')
  - If y is Number and not Number.isInteger(y) => throw TypeError('y must be an integer')
  - If x < 0 or y < 0 => throw RangeError('Integers must be non-negative')
Conversion and core logic:
  const bx = (typeof x === 'bigint') ? x : BigInt(x);
  const by = (typeof y === 'bigint') ? y : BigInt(y);
  if (bx < 0n || by < 0n) throw RangeError('Integers must be non-negative');
  let v = bx ^ by; // BigInt XOR
  // canonical provided implementation (naive bit loop):
  let count = 0;
  while (v) { count += Number(v & 1n); v = v >> 1n; }
  return count;
Notes and tradeoffs:
  - The canonical implementation uses a bit-shift loop. Replace with Kernighan loop for performance on sparse differences, or lookup/parallel-add for dense or width-limited workloads.
  - Never mix Number and BigInt directly in bitwise operators; explicit BigInt conversion is required.

3.3 Popcount implementations (signatures)
- popcountKernighan(v: bigint) -> number
  let count = 0; while (v !== 0n) { v &= v - 1n; count++; } return count;
- popcountShift(v: bigint) -> number
  let count = 0; while (v !== 0n) { count += Number(v & 1n); v >>= 1n; } return count;
- popcountLookup(v: bigint, table: Uint8Array[256]) -> number
  while (v !== 0n) { chunk = Number(v & 0xffn); sum += table[chunk]; v >>= 8n; } return sum;
- popcountParallel64(x: number|bigint) -> number
  Use fixed-width constants (m1, m2, m4, m8, m16, m32, h01) for 64-bit arithmetic variant and return final masked sum; signature depends on fixed integer type.

3.4 JavaScript bitwise semantics and conversion rules
- All Number bitwise operators operate on 32-bit signed integers: inputs are coerced by ToInt32 (wraps/mods), so values above 2^31-1 or negative values will be truncated and may yield incorrect Hamming distances for larger integers.
- BigInt bitwise operators (^, &, |, <<, >>) require both operands to be BigInt; using a Number will throw a TypeError. Use explicit BigInt(x) conversion.
- Shifts on BigInt are arithmetic and accept BigInt shift amount; right-shift on BigInt is arithmetic (sign-propagating) when negative values present—avoid negative inputs.


4. DETAILED DIGEST AND PROVENANCE
Extracted technical content and exact actionable items were taken from these sources on 2026-03-11:
- Wikipedia: Hamming distance — definitions, metric properties, relation to popcount via XOR, error detection/correction formulas (d_min, detect up to d-1, correct floor((d-1)/2)). (content partially truncated in fetch)
- Wikipedia: Hamming weight — popcount definitions, multiple algorithmic implementations including parallel-add masks for 64-bit, Kernighan method, lookup-table approach, and tradeoffs among them. (content partially truncated in fetch)
- MDN String.codePointAt — exact behavior: returns code point for leading surrogate pair, returns only trailing surrogate for trailing surrogate index, returns undefined for out of range index; recommended to iterate with Symbol.iterator or Array.from for code-point-aware processing.
- MDN String[Symbol.iterator] — iterator yields Unicode code points as single-string elements; surrogate pairs preserved; example behavioral notes about splitting grapheme clusters.
- MDN Bitwise Operators — enumerates JS bitwise operator semantics (32-bit coercion for Number bitwise ops, list of operators and shifts) and references to ECMAScript spec for exact operator semantics.
- npm hamming-distance — fetch failed with HTTP 403; package page content not retrieved. Implementation examples in this repository (docs/lib-browser.js embedded in package.json build script) were used as canonical JS function signatures and error messages.

Retrieval date: 2026-03-11


5. ATTRIBUTION AND CRAWL DATA
Sources retrieved (successful/failed):
- https://en.wikipedia.org/wiki/Hamming_distance — fetched (content truncated by fetch tool)
- https://en.wikipedia.org/wiki/Hamming_weight — fetched (content truncated by fetch tool)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt — fetched
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/%40%40iterator — fetched
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators — fetched
- https://www.npmjs.com/package/hamming-distance — fetch failed (HTTP 403)

Crawl notes and data size: fetch responses included multi-kilobyte HTML/text payloads; two Wikipedia pages and three MDN pages returned text content (some responses truncated by fetch max_length). npm page returned 403 and was not included. Total bytes retrieved (approx): 76 KB.


[END DOCUMENT]
