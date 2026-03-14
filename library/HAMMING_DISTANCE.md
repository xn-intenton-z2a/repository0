NORMALISED EXTRACT
Definition
Hamming distance between two equal-length strings or bit-strings is the count of positions at which the corresponding symbols differ. For bit-strings x and y of length n: H(x,y) = sum_{i=0..n-1} [x_i != y_i]. For numeric words, Hamming distance equals the population count (Hamming weight) of the bitwise XOR: H(x,y) = popcount(x XOR y).

Table of contents
1. Definition and properties
2. Algorithms (bitwise, word-level, streaming)
3. JavaScript implementation patterns
4. Complexity and performance considerations
5. Edge cases and validation

Detailed information
1. Definition and properties
- Works only for equal-length sequences; for variable lengths either define as undefined, pad/truncate, or treat missing positions as mismatches per application policy.
- Symmetric: H(a,b)=H(b,a). Values range 0..n for length n.

2. Algorithms
- Naive per-position: iterate indices i, increment counter when a[i] !== b[i]. Straightforward for strings and arrays; linear time O(n), O(1) extra space.
- Word/XOR + popcount: convert aligned machine-word-sized chunks, compute w = chunkA XOR chunkB, add popcount(w) to accumulator. Use CPU popcount instruction where available or fast software popcount.
- Streaming: process in fixed-size buffers for large inputs to limit memory usage; accumulate differences per buffer.

3. JavaScript implementation patterns
- Strict length enforcement pattern:
  Signature: function hammingDistance(a: string, b: string): number
  Behavior: throw or return -1 if a.length !== b.length depending on policy.
- Code-point aware comparison: iterate using String.prototype[Symbol.iterator] or convert to arrays of code points to avoid surrogate-pair mismatches when strings contain astral plane characters.
- Efficient binary comparison: when comparing binary data (Uint8Array), XOR each byte and add byte-popcount (use lookup table of size 256 or use optimized 32-bit parallel popcount on DataView word reads).

4. Complexity and performance
- Time: O(n) where n is number of positions compared; constant factors vary by chunk size and popcount implementation.
- Memory: O(1) additional for streaming/word methods; O(n) if expanding strings to arrays of code points.

5. Edge cases and validation
- Surrogate pairs: comparing UTF-16 code units directly can misreport differences for Unicode code points beyond BMP; prefer code-point iteration if semantic character equality is required.
- Binary vs text: define whether inputs are raw bytes or text and choose appropriate iteration.

SUPPLEMENTARY DETAILS
- Recommended popcount implementations: hardware POPCNT (x86) or software: Kernighan's method, lookup table (256-entry), or the parallel bit count (Hacker's Delight / bithacks) for 32/64-bit words.
- Use TypedArray views and DataView to align on 32/64-bit words when implementing XOR+popcount in JS native code or WASM.

REFERENCE DETAILS
- Function signature examples (specifying exact behavior):
  - hammingDistance(a: string, b: string): number  -- throws RangeError if lengths differ.
  - hammingDistanceBytes(a: Uint8Array, b: Uint8Array): number -- returns count of differing bytes; throws if lengths differ.
- Return: integer 0..n
- Implementation pattern: for Uint8Array use for (i=0;i<n;i++){acc += POP8[a[i]^b[i]];} where POP8 is 256-entry table of bit counts.

DETAILED DIGEST
Source: https://en.wikipedia.org/wiki/Hamming_distance
Retrieved: 2026-03-14
Extracted content: formal definition, use-cases in error-detecting/correcting codes, relation to bitwise XOR and population count, mathematical properties (metric, bounds), algorithms (naive, xor+popcount). Data size retrieved: ~161.7 KB.

ATTRIBUTION
Content derived from Wikipedia: Hamming distance (public domain/CC BY-SA depending on page); crawl size ~161.7 KB.