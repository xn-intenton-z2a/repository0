Title: Count Bits Set (Parallel) — Bithacks

Summary

Sean Eron Anderson's bithacks collection documents efficient bit-manipulation idioms. The parallel (SWAR) population-count approach progressively sums bits in groups using masks (m1, m2, m4, ...), reducing per-chunk counts until a full word count is obtained.

Algorithm outline (64-bit example)

- Define masks: m1 = 0x5555..., m2 = 0x3333..., m4 = 0x0f0f..., m8 = 0x00ff00ff..., etc.
- Combine bits in pairs, then nibbles, then bytes:
  x = (x & m1) + ((x >> 1) & m1)
  x = (x & m2) + ((x >> 2) & m2)
  x = (x + (x >> 4)) & m4
  x = (x * h01) >> 56  // collects byte sums into high byte

Variants

- popcount64a: mask-and-add tree (24 ops)
- popcount64b: reduced arithmetic (17 ops)
- popcount64c: uses one multiply (12 ops) — fastest on machines with fast multiply
- popcount64d: Wegner's loop (x &= x-1) — best when few bits set

Notes

- Choose variant based on CPU features (fast multiply, vector instructions, or POPCNT instruction availability).
- The page includes many additional bit tricks and portable caveats (signed shifts, endianness and portability considerations).

Source: Sean Eron Anderson, "Bit Twiddling Hacks" — Count Bits Set (Parallel) section.