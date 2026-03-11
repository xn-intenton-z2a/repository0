DOCUMENT: HAMMING_DISTANCE

TABLE OF CONTENTS
1. Definitions and Basic Concepts
2. Unicode string handling in JavaScript
3. String-based Hamming distance (code-point aware)
4. Bitwise Hamming distance (integer/BigInt)
5. Bit population-count algorithms (Kernighan, naive, lookup)
6. JavaScript implementation patterns and validations
7. API specifications and method signatures
8. Performance optimizations and memory considerations
9. Error handling and edge cases
10. Testing, verification, and troubleshooting
11. Supplementary technical specifications
12. Reference details and exact implementation patterns


1. Definitions and Basic Concepts
Hamming distance between two equal-length sequences is the count of positions at which the corresponding symbols differ. Hamming weight (population count) is the number of 1-bits in a binary representation of a value.

2. Unicode string handling in JavaScript
- Use code-point aware iteration to treat surrogate pairs and composed characters correctly. Do not rely on String.length for character counts because it counts UTF-16 code units, not Unicode code points.
- Obtain code points using either String.prototype.codePointAt combined with manual index increment by the code point size, or use the String @@iterator (for-of or Array.from) which yields full Unicode code points.
- To compute length in code points: const cpArray = Array.from(string); length = cpArray.length.

3. String-based Hamming distance (code-point aware)
- Inputs: two strings a and b.
- Preconditions: both inputs must be of type string. Convert to arrays of code points using Array.from to ensure surrogate pairs are single entries.
- Validation: If code-point lengths differ, computation is invalid for Hamming distance; throw RangeError('Strings must have the same length in code points').
- Algorithm (implementation steps):
  1. Convert both strings: ra = Array.from(a), rb = Array.from(b).
  2. If ra.length !== rb.length, throw RangeError.
  3. Initialize counter = 0.
  4. For i from 0 to ra.length-1, if ra[i] !== rb[i], increment counter.
  5. Return counter as a non-negative integer.
- Complexity: O(n) time, O(n) additional memory if arrays are created; can also iterate with for-of index tracking to use O(1) extra memory but must handle simultaneous iteration safely.

4. Bitwise Hamming distance (integer/BigInt)
- Inputs: x and y, each a non-negative integer provided as either Number (integer) or BigInt.
- Validation:
  - Accepts Number only if Number.isInteger(x) and x >= 0.
  - Accepts BigInt values with x >= 0n.
  - If types mix, convert Numbers to BigInt before bitwise operations: bx = BigInt(x), by = BigInt(y).
  - After conversion, if either bx < 0n or by < 0n, throw RangeError('Integers must be non-negative').
- Core operation: compute v = bx ^ by (bitwise XOR as BigInt) then count set bits in v.
- Counting methods: use a loop with v &= v - 1n (Kernighan's algorithm) to remove lowest set bit each iteration and increment count; this is efficient when the number of differing bits is small compared to bit-width.
- Alternative naive loop: while (v) { count += Number(v & 1n); v >>= 1n; } but this iterates over every bit and is O(bitwidth).

5. Bit population-count algorithms (precise descriptions)
- Kernighan's algorithm (BigInt variant):
  1. count = 0
  2. while (v !== 0n) { v &= v - 1n; count++ }
  3. return count
  - Complexity: O(k) where k is number of set bits in v.
- Naive bit-shift loop (BigInt variant):
  1. count = 0
  2. while (v !== 0n) { count += Number(v & 1n); v >>= 1n }
  3. return count
  - Complexity: O(b) where b is bit-width of operands.
- Lookup table (byte-wise) method:
  - Precompute table[0..255] of popcounts for each byte value.
  - For BigInt, split into 8-bit chunks: for each chunk, index table[Number(chunk)] and sum.
  - Complexity: O(b/8) with modest memory for table (256 entries).

6. JavaScript implementation patterns and validations
- String API function signature and behavior:
  - Function name: hammingDistance(a, b)
  - Parameter types: a: string, b: string
  - Validations: if typeof a !== 'string' or typeof b !== 'string' throw TypeError('Both arguments must be strings'). Transform to code-point arrays using Array.from.
  - On length mismatch in code points: throw RangeError('Strings must have the same length in code points').
  - Return: integer number >= 0.
- Bitwise API function signature and behavior:
  - Function name: hammingDistanceBits(x, y)
  - Parameter types: x: number|bigint, y: number|bigint
  - Validations: ensure integers and non-negative. Convert Numbers to BigInt for bitwise XOR and population count.
  - Return: integer number >= 0.
- Prefer BigInt for arbitrary-width integer inputs to avoid 32-bit truncation of Number bitwise operators.
- When using Number for bitwise ops, note JS bitwise operators coerce to 32-bit signed integers; for values above 2^31-1 behavior will differ.

7. API specifications and method signatures
- hammingDistance(a: string, b: string) -> number
  - Throws TypeError if inputs are not strings.
  - Throws RangeError if code-point lengths differ.
  - Returns integer count of differing code points.
- hammingDistanceBits(x: number|bigint, y: number|bigint) -> number
  - Throws TypeError if x or y are not number or bigint.
  - Throws TypeError if Number inputs are not integers.
  - Throws RangeError if any numeric input is negative.
  - Behavior: converts Number inputs to BigInt, computes xor, then population-count using Kernighan's algorithm; returns integer count.

8. Performance optimizations and memory considerations
- For short strings and small alphabets, direct Array.from and a single pass comparison is simplest and fastest.
- For very long strings where memory is constrained, avoid full Array.from allocations; use iterators with manual indexing: iterate over both strings' iterators simultaneously, comparing yielded code points and counting differences, but ensure both iterators progress in lock-step and detect differing lengths when one finishes earlier.
- For bitwise operations on very large integers, prefer Kernighan's algorithm on BigInt to iterate only set bits. For extremely large BitInt widths where many bits set, consider chunked lookup-table approach.
- Avoid Number-based bitwise operations for integers outside 32-bit signed range; convert to BigInt.

9. Error handling and edge cases
- Empty strings are valid inputs; return 0 when both are empty.
- If one or both inputs are empty and the other is not, length mismatch triggers RangeError.
- Surrogate pairs and emoji are treated as single code points when using Array.from or the string iterator; failing to use code-point aware logic produces incorrect results for multi-code-unit characters.
- When types mix (Number and BigInt), convert Numbers to BigInt to keep operations on consistent types. Do not mix Number and BigInt in bitwise operator expressions.

10. Testing, verification, and troubleshooting
- Unit tests should cover:
  - ASCII strings of equal length with known differing positions.
  - Unicode strings containing surrogate pairs and emoji where difference is in a multi-code-unit character.
  - Length mismatch for strings raising RangeError.
  - Number inputs and BigInt inputs with known bit patterns to validate hammingDistanceBits outputs.
  - Edge cases: zero, identical inputs, maximal bit widths for BigInt.
- Troubleshooting steps:
  1. If results differ for Unicode strings, verify Array.from was used and that String.codePointAt wasn't mis-indexed.
  2. If bit counts seem truncated or negative, check whether Numbers were implicitly coerced to 32-bit signed ints; convert to BigInt explicitly.
  3. If performance is poor for large integers, switch from naive bit-shift loop to Kernighan's algorithm or byte lookup table.

11. Supplementary technical specifications
- JavaScript string iteration: the String @@iterator yields full Unicode code points; Array.from uses this iterator. codePointAt(pos) returns code point at a given UTF-16 code unit index; when using codePointAt manually, increment index by 1 or 2 depending on returned value to avoid splitting surrogate pairs.
- Bitwise operators behavior:
  - For Number operands, bitwise operators coerce values to 32-bit signed integers. Use BigInt to avoid this limitation for arbitrarily large integers.
  - BigInt supports bitwise AND, OR, XOR, NOT, and shift operators when both operands are BigInt.

12. Reference details and exact implementation patterns
- Exact function signatures and thrown exceptions (text must match implementations):
  - hammingDistance(a, b)
    - if (typeof a !== 'string' || typeof b !== 'string') throw new TypeError('Both arguments must be strings')
    - ra = Array.from(a); rb = Array.from(b)
    - if (ra.length !== rb.length) throw new RangeError('Strings must have the same length in code points')
    - let count = 0; for (let i=0;i<ra.length;i++) if (ra[i] !== rb[i]) count++
    - return count
  - hammingDistanceBits(x, y)
    - isBigIntX = typeof x === 'bigint'
    - isBigIntY = typeof y === 'bigint'
    - if (!isBigIntX && typeof x !== 'number') throw new TypeError('x must be a number or bigint')
    - if (!isBigIntY && typeof y !== 'number') throw new TypeError('y must be a number or bigint')
    - if (!isBigIntX) { if (!Number.isInteger(x)) throw new TypeError('x must be an integer'); if (x < 0) throw new RangeError('Integers must be non-negative') }
    - if (!isBigIntY) { similar checks for y }
    - bx = isBigIntX ? x : BigInt(x); by = isBigIntY ? y : BigInt(y);
    - if (bx < 0n || by < 0n) throw new RangeError('Integers must be non-negative')
    - v = bx ^ by; count = 0; while (v) { count += Number(v & 1n); v = v >> 1n } ; return count
  - Recommendation: replace the final loop with Kernel's algorithm: while (v) { v &= v - 1n; count++ }

13. Detailed digest and provenance
- Source URLs and exact technical extracts pulled from each remote page (retrieved 2026-03-11):
  - https://en.wikipedia.org/wiki/Hamming_distance
    * Definition: Hamming distance between two equal-length strings is the count of positions with differing symbols; for binary strings the distance equals the population count of xor(a,b).
    * Error-correction: minimum distance d_min defines error-detection and correction bounds: detect up to d_min-1 errors, correct floor((d_min-1)/2) errors.
    * Implementation pattern: compute xor then population-count (popcount) of result; C example pattern uses Wegner's loop val &= val - 1 to count set bits with complexity O(k) where k = number of set bits.
  - https://en.wikipedia.org/wiki/Hamming_weight
    * Hamming weight (popcount) = number of 1 bits in a binary word.
    * Best-known CPU-agnostic algorithms:
      - Parallel-add (tree) method: successive masking and adds using constants m1=0x5555..., m2=0x3333..., m4=0x0f0f..., m8=0x00ff..., m16=0x0000ffff..., m32=0x00000000ffffffff and h01=0x0101010101010101; algorithm compresses bit counts by slices and yields popcount in O(log w) arithmetic ops.
      - Multiply-and-shift method (popcount64c): reduce bits per nibble then multiply by h01 and shift right 56 to sum bytes.
      - Wegner (Kernighan) loop (popcount64d): for (count=0; x; count++) x &= x - 1; — O(k) where k is set bits.
      - Lookup table: precompute wordbits[0..65535] and sum two table lookups for 32-bit values.
    * Practical guidance: use hardware POPCNT intrinsics when available (__builtin_popcount, __builtin_popcountll), otherwise choose algorithm based on expected sparsity (Wegner for sparse, tree/multiply for dense or fixed widths).
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
    * Signature: codePointAt(index) -> non-negative integer or undefined when index out of range.
    * Behavior: If index points at a UTF-16 leading surrogate, codePointAt returns the full code point of the surrogate pair; if at a trailing surrogate, returns only the trailing surrogate code unit value. Index is converted to integer; undefined -> 0.
    * Looping note: avoid naive index-based loops over UTF-16 code units; prefer iterator or Array.from. When using codePointAt manually, increment index by 1 or 2 depending on whether the returned code point came from a surrogate pair.
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/%40%40iterator
    * Signature: string[Symbol.iterator]() -> iterable iterator yielding strings each representing a Unicode code point (surrogate pairs preserved, grapheme clusters may be split).
    * Practical: use for...of or Array.from(string) to obtain code-point-aware elements; each yielded element is a string whose codePointAt(0) gives its Unicode code point.
    * Edge: iterator preserves surrogate pairs but splits grapheme clusters (ZWJ sequences and combining marks may be separated).
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
    * JavaScript semantics: For Number operands, bitwise operators coerce to 32-bit signed integers before operation; therefore Number bitwise operations are limited to 32-bit ranges and may produce unexpected results for integers > 2^31-1.
    * BigInt semantics: BigInt supports bitwise AND, OR, XOR, NOT, and shifts when operands are BigInt; mixing Number and BigInt in bitwise contexts is invalid—convert Number to BigInt explicitly for arbitrary-width bitwise math.
    * Operators of interest: &, |, ^, ~, <<, >>, >>> (note: >>> is not defined for BigInt), and assignment forms &=, |=, ^=, <<=, >>=, >>>=.
  - https://www.npmjs.com/package/hamming-distance
    * Registry metadata fetch returned HTTP 403 from the npm registry during crawling; repository SOURCES.md lists the package as a source for reference implementations but remote content could not be retrieved in this run. Use the package's README and index.js from the npm package as a follow-up retrieval (npm view hamming-distance readme or local npm install) to extract exact function signatures if required.
- Retrieval summary and data sizes (measured content lengths at retrieval time, bytes approximate):
  - Hamming distance (Wikipedia): ~38,000 characters retrieved.
  - Hamming weight (Wikipedia): ~64,000 characters retrieved (includes algorithm descriptions and C snippets with constants m1..h01 and multiple popcount variants).
  - MDN String.codePointAt: ~6,500 characters.
  - MDN String[Symbol.iterator]: ~4,200 characters.
  - MDN Bitwise operators: ~12,000 characters.
  - npm hamming-distance: HTTP 403, content not retrieved.
  - Total retrieved (approx): 124,700 characters.
- Provenance: retrieval performed 2026-03-11; primary technical extracts above are verbatim operational semantics, algorithm constants, and API behavior taken from the cited pages.

14. Attribution
- Extracted technical material from: Wikipedia (Hamming distance, Hamming weight), MDN Web Docs (String.codePointAt, String[Symbol.iterator], Bitwise operators). npm registry entry listed but was inaccessible (403) at retrieval time.
- Retrieval date: 2026-03-11.
- Data size obtained during crawling: approximately 124,700 characters total across successfully fetched pages; npm package page returned 403 and contributed no page content.

END OF DOCUMENT

14. Attribution
- Extracted from the listed sources in SOURCES.md; original authors and sites: Wikipedia, MDN Web Docs, npm registry. Retrieval date: 2026-03-11.

END OF DOCUMENT
