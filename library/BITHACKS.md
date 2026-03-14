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
  Behavior: yields a mask containing only the least significant 1 bit of x (two's complement semantics).

2.2 Clear lowest set bit
- Expression: x & (x - 1)
  Behavior: clears the least significant 1 bit of x; useful for iterating set bits (Kernighan loop).

2.3 Set/Clear/Toggle bits
- Set bit n: x |= (1 << n)
- Clear bit n: x &= ~(1 << n)
- Toggle bit n: x ^= (1 << n)

2.4 Round up to next power of two (32-bit example)
- Sequence:
  x -= 1;
  x |= x >> 1;
  x |= x >> 2;
  x |= x >> 4;
  x |= x >> 8;
  x |= x >> 16;
  x += 1;
- Result: smallest power of two >= original value (undefined if overflow beyond width).

2.5 Count trailing zeros (De Bruijn)
- Procedure: isolate LSB, multiply by deBruijn constant, shift, and table-lookup to get index of trailing zero in O(1) operations. Constants and table depend on word width (32/64).

2.6 Parity
- Compute parity via successive XOR folds and small lookup (e.g., map 4-bit value to parity using 0x6996 constant) or via reduction of popcount modulo 2.

3. SWAR popcount
- SWAR (SIMD Within A Register) sequences aggregate counts across subfields to compute popcount without table or loop; see Hamming weight doc for standard 32-bit sequence.

PLATFORM NOTES
- Prefer hardware POPCNT or compiler intrinsics when available. Use SWAR or table-based fallbacks for portability.
- Be careful with signed right shifts in languages where sign-propagating shift differs from logical shift; use unsigned shifts for logical behavior.

REFERENCE DETAILS
- Useful function signatures (language-agnostic):
  isolateLSB(x) -> mask
  clearLSB(x) -> value
  nextPowerOfTwo(x) -> value
  ctzDeBruijn(x) -> index (0..wordWidth-1)

DETAILED DIGEST
Source: https://graphics.stanford.edu/~seander/bithacks.html — retrieved 2026-03-14
Data obtained: canonical bit-manipulation tricks (isolate/clear LSB, next power-of-two, de Bruijn ctz, parity, SWAR popcount) with code patterns and constants.

ATTRIBUTION
Source: Sean Eron Anderson — Bit Twiddling Hacks (graphics.stanford.edu/~seander/bithacks.html). Retrieved 2026-03-14. Data size retrieved: ~98 KB (HTML). Public-domain code snippets on page; aggregate descriptions copyrighted by author; consult original page for licensing details.
