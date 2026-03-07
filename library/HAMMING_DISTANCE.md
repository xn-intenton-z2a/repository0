DOCUMENT: HAMMING_DISTANCE

TABLE OF CONTENTS
1. Definitions and complexity
2. Binary Hamming computation (XOR + popcount)
3. Efficient popcount implementations (masks, parallel add, Kernighan, lookup, hardware)
4. Language API and method signatures (C, C++, Python, Java, JavaScript)
5. Unicode-aware string handling for Hamming-like operations (JS specifics)
6. Implementation patterns and trade-offs
7. Supplementary technical specifications and constants
8. Reference API signatures, return types, and effects
9. Troubleshooting and performance tuning


NORMALISED EXTRACT (actionable technical points)

1. Definitions and complexity
- Hamming distance for two equal-length sequences is the count of positions with differing symbols. For binary vectors of length n, time complexity is O(n) for naive per-position comparison. For binary integer values, compute v = a XOR b, then Hamming distance = population count(popcount) of v. Space complexity is O(1) for in-place bitwise methods.

2. Binary Hamming computation (XOR + popcount)
- Core pattern: differing_bits = a XOR b; distance = popcount(differing_bits).
- This reduces string/bit comparisons to a single integer XOR followed by a bit-count operation, enabling use of specialized CPU instructions or bit-parallel algorithms.
- For word-sized integer types use compiler intrinsics for popcount where available (GCC/Clang: __builtin_popcount, __builtin_popcountll) to obtain optimal performance.

3. Efficient popcount implementations
- Kernighan's algorithm (val &= val - 1 loop): runtime proportional to number of set bits k; uses O(k) iterations and minimal memory.
- Parallel add (variable mask) method (also called the sideways addition or tree-adder): use successive masks and shifts to sum bits in groups; best-worst-case bounded and independent of k. Masks for 64-bit: m1=0x5555555555555555, m2=0x3333333333333333, m4=0x0f0f0f0f0f0f0f0f, m8=0x00ff00ff00ff00ff, m16=0x0000ffff0000ffff, m32=0x00000000ffffffff, h01=0x0101010101010101. Example sequence: x = (x & m1) + ((x >> 1) & m1); x = (x & m2) + ((x >> 2) & m2); x = (x & m4) + ((x >> 4) & m4); ... final result extract.
- Multiply-and-shift variant (fast on machines with cheap multiply): after reducing to bytes, multiply by h01 and shift right by 56 to accumulate counts.
- Lookup table approach: precompute counts for 16-bit words (table size 65536) and compute popcount by two table lookups for 32-bit words; trade memory for speed.
- Hardware popcount instructions: x86 POPCNT (use compiler intrinsic), ARM NEON VCNT, RISC-V CPOP; prefer intrinsic when present.

4. Language API and method signatures (actionable forms)
- C (binary integers):
  int hamming_distance(unsigned x, unsigned y)
  - Inputs: two unsigned integers (word size as platform). Behavior: returns number of differing bits. Typical implementation: return __builtin_popcount(x ^ y) or use Kernighan/popcount routines.

- C (32/64-bit specialized):
  int hamming_distance32(uint32_t x, uint32_t y) -> int
  int hamming_distance64(uint64_t x, uint64_t y) -> int
  - Use __builtin_popcount and __builtin_popcountll or platform intrinsics.

- Python (strings):
  def hamming_distance(string1: str, string2: str) -> int
  - Inputs: two equal-length sequences. Behavior: raise ValueError if lengths differ. Implementation: iterate positions, increment counter where chars differ. Complexity O(n).

- Java: Use Integer.bitCount(int) or Long.bitCount(long) on (a ^ b) for integer values.

- C++20: use std::popcount(unsigned) from <bit> on (a ^ b).

- JavaScript (for binary data in TypedArray or BigInt): compute XOR then reduce via manual bit-count loops; no native popcount in standard JS, but use BigInt for >32-bit and count with Kernighan technique on numeric chunks.

5. Unicode-aware string handling (JavaScript specifics)
- String.codePointAt(index): returns numeric code point at index; if index points at a leading surrogate, codePointAt returns the combined code point for the surrogate pair; if index out of range returns undefined.
- String[Symbol.iterator](): returns an iterator that yields strings for each Unicode code point (surrogate pairs preserved). Iterating with for...of or [...str] yields logical code points; use codePointAt(0) on each yielded element to obtain numeric code points.
- For Hamming-like comparisons on human-visible characters, iterate grapheme clusters or use the string iterator; naive index-based loops on UTF-16 code units will incorrectly count surrogate pair halves as separate elements.

6. Implementation patterns and trade-offs
- For fixed-length byte/bit arrays: convert blocks to machine words, XOR corresponding words, sum popcounts per word with intrinsics or parallel add method to minimize per-bit loop overhead.
- For sparse differences (few differing bits): Kernighan's loop is superior because runtime is proportional to the number of set bits k in the XOR result.
- For dense or worst-case scenarios: parallel add / multiply-accumulate approaches have stable worst-case performance.
- For extremely high throughput across large datasets, use vectorized instructions (SIMD) or specialized algorithms (Harley–Seal) and consider memory-aligned, block-wise processing.

7. Supplementary technical specifications and constants (hex values for masks)
- 64-bit masks used by parallel add algorithm (exact hex literals):
  m1  = 0x5555555555555555
  m2  = 0x3333333333333333
  m4  = 0x0f0f0f0f0f0f0f0f
  m8  = 0x00ff00ff00ff00ff
  m16 = 0x0000ffff0000ffff
  m32 = 0x00000000ffffffff
  h01 = 0x0101010101010101
- Popcount multiply extraction: after collapsing to byte-level sums, result = (x * h01) >> 56 for 64-bit x processed by the m* sequence.
- Kernighan loop invariant: while (x) { x &= x - 1; ++count; } — loop iterations == number of set bits.

8. Reference API signatures, return types, and effects
- C: int popcount32(uint32_t x)  -> returns 0..32
- C: int popcount64(uint64_t x)  -> returns 0..64
- Compiler intrinsics:
  - GCC/Clang: int __builtin_popcount(unsigned int x) -> int
  - GCC/Clang: int __builtin_popcountll(unsigned long long x) -> int
- Java: int Integer.bitCount(int i) -> count of one-bits in 32-bit int
- Java: int Long.bitCount(long l) -> count of one-bits in 64-bit long
- C++20: unsigned int std::popcount(unsigned) -> count
- Python: int int.bit_count() -> count of set bits in integer (Python 3.10+)
- SQL (MySQL): BIT_COUNT(expr) -> count of set bits in integer expression

BEST PRACTICES
- For integer/binary Hamming: always use XOR + hardware/popcount intrinsic where available. This yields minimal instructions and best throughput.
- For variable-length text where insertions/deletions possible: Hamming is inappropriate; use Levenshtein or Damerau–Levenshtein instead.
- For Unicode text comparisons: operate on grapheme clusters for user-facing comparisons; for technical protocol-level comparisons use code points and be explicit about normalization (NFC/NFD) before comparison.
- For high-performance batch comparisons: batch process aligned words, unroll loops, and use SIMD/popcount vectorization (Harley–Seal or Muła vectorized methods) for throughput.

TROUBLESHOOTING (step-by-step)
- Wrong counts on large buffers: confirm corresponding blocks are compared (no offset), verify block alignment and same endianness logic, ensure no implicit sign extension when reading bytes into larger types.
- Slow counts on sparse data: use Kernighan's loop per word rather than full parallel-add sequence; measure k (average differing bits per word) to select algorithm.
- JS surrogate problems: if comparisons treat surrogate halves as separate, switch to for...of iterator or use String.prototype.normalize() followed by appropriate code point iteration.

DETAILED DIGEST (most valuable content from SOURCES.md)
- Hamming distance: definition, use in coding theory, detection/correction bounds: code with minimum distance d can detect up to d-1 errors and correct floor((d-1)/2) errors.
- Binary computation: XOR + popcount is canonical; compiler intrinsics and CPU instructions (POPCNT, VCNT, CPOP) provide highest performance.
- Popcount algorithms: Kernighan (iterate per set bit), parallel-add (mask-and-shift tree), multiply-and-shift extraction using h01 constant, lookup tables for 16-bit chunks, Harley–Seal and vectorized approaches for top throughput.
- JavaScript specifics: codePointAt and String[Symbol.iterator] semantics—use iterators for code points and codePointAt(0) for numeric values.
- Source retrieval date: 2026-03-07

ATTRIBUTION
Sources crawled (full list):
- Wikipedia: Hamming distance (https://en.wikipedia.org/wiki/Hamming_distance)
- Wikipedia: Hamming weight (https://en.wikipedia.org/wiki/Hamming_weight)
- MDN: String.prototype.codePointAt (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt)
- MDN: String.prototype[Symbol.iterator] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/@@iterator)
- Sean Eron Anderson: bithacks – CountBitsSetParallel (https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel)
- npm hamming-distance package: fetch failed (403) so package content was not obtained

DATA SIZE RETRIEVED (approximate)
- Wikipedia Hamming distance: ~18 KB
- Wikipedia Hamming weight: ~18 KB
- MDN codePointAt: ~3 KB
- MDN Symbol.iterator: ~2 KB
- Sean Eron Anderson bithacks page: ~48 KB
- npm package page: 0 KB (403 Forbidden)

END OF DOCUMENT
