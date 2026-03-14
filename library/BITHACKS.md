TITLE: BITHACKS

TABLE OF CONTENTS
1. Purpose and scope
2. Common bit-manipulation primitives
  2.1 Isolate lowest set bit
  2.2 Clear lowest set bit
  2.3 Set/Clear/Toggle bits
  2.4 Rounding to power-of-two
  2.5 Count trailing zeros (De Bruijn method)
  2.6 Parity and small-popcount tricks
3. SWAR popcount (reference)
4. Platform-specific notes
5. Reference details
6. Detailed digest (source: Sean Eron Anderson — Bit Twiddling Hacks) — retrieved 2026-03-14
7. Attribution and data size

NORMALISED EXTRACT — Practical primitives
2.1 Isolate lowest set bit
- Expression: y = x & -x
  Behavior: yields a mask containing only the least significant 1 bit of x (assuming two's complement).

2.2 Clear lowest set bit
- Expression: x & (x - 1)
  Behavior: clears the least significant 1 bit of x; useful for iterating set bits (Kernighan loop).

2.3 Set/Clear/Toggle bits
- Set: x |= (1 << n)
- Clear: x &= ~(1 << n)
- Toggle: x ^= (1 << n)

2.4 Round up to next power of two (for 32-bit x)
- Sequence:
  x -= 1;
  x |= x >> 1;
  x |= x >> 2;
  x |= x >> 4;
  x |= x >> 8;
  x |= x >> 16;
  x += 1;
- Result: smallest power of two >= original value (undefined if result overflows width).

2.5 Count trailing zeros (De Bruijn)
- Use isolated-LSB times de Bruijn constant and table lookup to compute index of trailing zero for word-sized integers with O(1) ops.
- Outline: y = (x & -x) * deBruijnConstant >> shift; index = table[y]; where deBruijnConstant and shift depend on word width.

2.6 Parity
- Compute parity (odd/even number of set bits) via XOR folds and a small lookup: fold via successive XOR-right shifts then map 4-bit value to parity using constant table (e.g., 0x6996).

3. SWAR popcount
- See Hamming weight SWAR sequence (in Hamming weight doc). The bithacks page contains multiple optimized variants and language-specific notes.

PLATFORM NOTES
- Prefer hardware intrinsics (POPCNT) on x86_64 when performance matters. For portability, include fallback SWAR or table-based routines.
- Beware signed shifts in some languages; use unsigned shifts where required.

REFERENCE DETAILS
- Useful functions:
  isolateLSB(x) -> mask
  clearLSB(x) -> value
  nextPowerOfTwo(x) -> value
  ctzDeBruijn(x) -> index (0..wordWidth-1)

DETAILED DIGEST
Source: https://graphics.stanford.edu/~seander/bithacks.html — retrieved 2026-03-14
Data obtained: canonical bit-manipulation tricks (isolate/clear LSB, next power-of-two, de Bruijn ctz, parity, SWAR popcount) with code patterns and constants.

ATTRIBUTION
Source: Sean Eron Anderson — Bit Twiddling Hacks (graphics.stanford.edu/~seander/bithacks.html) — retrieved 2026-03-14. Data size retrieved: ~98 KB (HTML). Public-domain snippets per page; aggregate descriptions copyrighted by author (see original page).