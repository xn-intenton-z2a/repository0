POPCOUNT

TABLE OF CONTENTS
1. NORMALISED EXTRACT
  1.1 Definition
  1.2 Core algorithms (explicit steps)
    1.2.1 Kernighan (loop-by-ones)
    1.2.2 Parallel/word bit-twiddling (32-bit)
    1.2.3 64-bit / BigInt variants (constants as BigInt)
    1.2.4 Byte-wise and table lookup
  1.3 CPU support and intrinsics
2. SUPPLEMENTARY DETAILS
  2.1 Performance considerations and choosing algorithms
  2.2 Streaming and chunking for large buffers
  2.3 Endianness and packing notes
3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)
  3.1 popcount32(number) -> number
  3.2 popcountBigInt(bigint) -> number
  3.3 popcountUint8Array(bytes: Uint8Array) -> number
  3.4 Exact bit-twiddling sequence and constants
4. TROUBLESHOOTING AND PROCEDURES
  4.1 Validation steps
  4.2 Edge cases (negative numbers, floats, non-integers)
5. SOURCE DIGEST AND RETRIEVAL METADATA
6. ATTRIBUTION

1. NORMALISED EXTRACT

1.1 Definition
- Population count (popcount) returns the number of 1-bits in a binary word. For two bit-vectors A and B, Hamming distance = popcount(A XOR B).

1.2 Core algorithms (explicit steps)

1.2.1 Kernighan (loop-by-ones)
- Input: unsigned integer x (or bigint)
- Steps: count = 0; while (x != 0) { x = x & (x - 1); count += 1; } return count
- Complexity: O(k) where k = number of 1s; good for sparse ones.

1.2.2 Parallel/word bit-twiddling (32-bit)
- Input: 32-bit unsigned integer x
- Steps (exact sequence):
  1. x = x - ((x >>> 1) & 0x55555555);
  2. x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  3. x = (x + (x >>> 4)) & 0x0F0F0F0F;
  4. return (x * 0x01010101) >>> 24;
- Result: returns integer 0..32. Uses unsigned right shift >>> to treat values as uint32.

1.2.3 64-bit / BigInt variants (constants as BigInt)
- Replace constants with BigInt equivalents and use arithmetic/bitwise on BigInt. Example constants: 0x5555555555555555n, 0x3333333333333333n, 0x0f0f0f0f0f0f0f0fn, 0x0101010101010101n.
- Use logical shifts implemented via >> and << on BigInt; unsigned semantics: use BigInt.asUintN(width, value) if reducing size.

1.2.4 Byte-wise and table lookup
- Precompute table[0..255] of popcount for single byte. Sum table[byte] for each byte in buffer for fastest throughput on small word sizes and when memory locality is high.

1.3 CPU support and intrinsics
- On modern CPUs prefer hardware POPCNT instruction when available. In C/C++ use __builtin_popcount / __builtin_popcountll or compiler intrinsics which map to the POPCNT opcode. On JS, use WebAssembly or native bindings to access hardware popcount; otherwise use the software algorithms above.

2. SUPPLEMENTARY DETAILS

2.1 Performance considerations and choosing algorithms
- If input integers are dense (many 1s) prefer parallel bit-twiddling or builtins; if sparse, Kernighan is often faster.
- For large byte buffers use table lookup + vectorized reads (Uint32 / BigUint64) to amortize work.

2.2 Streaming and chunking for large buffers
- Process in aligned machine-word chunks (32-bit or 64-bit) then handle remaining bytes with table lookup.
- When streaming, maintain partial word accumulator; flush when full word is available and sum popcounts.

2.3 Endianness and packing notes
- Popcount is endian-agnostic for a given sequence of bits when interpreted consistently; only matters when reinterpreting byte order into multi-byte words.
- When loading bytes into 32/64-bit words for parallel algorithms, choose consistent little-endian or big-endian mapping.

3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)

3.1 popcount32(number) -> number
- Parameters: number (will be coerced to Uint32 via >>>0)
- Returns: integer 0..32
- Effects: none (pure function). Implementation uses the parallel bit-twiddling sequence above.

3.2 popcountBigInt(bigint) -> number
- Parameters: bigint (arbitrary precision)
- Returns: integer >= 0 (JavaScript Number, may exceed 2^53 if input has >2^53 ones; in that case return BigInt count or throw depending on API design)
- Implementation: Kernighan loop on BigInt using x &= x - 1n or chunk into 64-bit windows and use table/parallel methods.

3.3 popcountUint8Array(bytes: Uint8Array) -> number
- Parameters: bytes: Uint8Array
- Returns: integer sum of ones across the buffer
- Implementation: read in 32-bit or 64-bit aligned words, apply popcount32/popcount64, then apply byte table to remainder.

3.4 Exact bit-twiddling sequence and constants (32-bit)
- Sequence given in 1.2.2, constants: 0x55555555, 0x33333333, 0x0F0F0F0F, 0x01010101.
- For 64-bit, use corresponding 64-bit constants suffixed with n if BigInt.

4. TROUBLESHOOTING AND PROCEDURES

4.1 Validation steps
- Ensure inputs are integers: coerce Numbers with >>>0 for Uint32, throw on NaN/Infinity.
- For BigInt API ensure argument is typeof bigint or convertible via BigInt(x).

4.2 Edge cases
- Negative numbers: treat via unsigned conversion (>>>0) for Number APIs.
- Very large BigInts: return type consideration—if Number cannot hold the popcount value, return BigInt count or error.

5. SOURCE DIGEST AND RETRIEVAL METADATA
- Source fragments used: Wikipedia Hamming distance (popcount relation), Hacker's Delight reference cited in that article, MDN BigInt page for BigInt bitwise behavior.
- Retrieval date: 2026-03-07T20:27:36.378Z
- Note: population_count Wikipedia fetch returned HTTP 429; used Hamming_distance page and MDN BigInt for BigInt specifics.

6. ATTRIBUTION
- Content derived from: Wikipedia: Hamming distance (https://en.wikipedia.org/wiki/Hamming_distance), MDN: BigInt (https://developer.mozilla.org/)
- Crawl notes: some source fetches were truncated or rate-limited.
