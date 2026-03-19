NORMALISED EXTRACT

Definition
Hamming distance between two strings of equal length: the number of positions at which the corresponding symbols are different.
For binary vectors (bit-strings), it equals the number of differing bits.
Properties
- Metric: satisfies non-negativity, identity of indiscernibles, symmetry, triangle inequality.
- For binary words, Hamming distance d(x,y) = Hamming weight(x XOR y).

TABLE OF CONTENTS
1. Definition
2. Relation to Hamming weight (popcount)
3. Metric properties and implications
4. Use cases and algorithms

DETAILED CONTENT
1. Definition
- Given two equal-length strings s and t, Hamming(s,t) = count(i | s[i] != t[i]).
- Must require equal lengths; otherwise undefined or error.

2. Relation to Hamming weight (popcount)
- For integers or binary vectors: Hamming(x,y) = popcount(x XOR y).
- popcount is the count of ones in a binary representation.

3. Metric properties and implications
- Triangle inequality: for strings a,b,c, H(a,c) <= H(a,b) + H(b,c).
- Enables use in nearest-neighbour searches, error-correcting codes, and clustering.

4. Use cases and algorithms
- Error detection/correction: minimum Hamming distance determines error-correcting capability.
- Computing between strings: iterate code points and increment mismatch count.
- Computing between integers: compute XOR then apply efficient popcount.

SUPPLEMENTARY DETAILS

Specifications
- Input constraints: equal-length sequences for symbol Hamming distance; non-negative integers for bit Hamming distance.
- Input validation: TypeError for wrong types; RangeError for unequal lengths or negative integers.

IMPLEMENTATION NOTES
- For strings, compare Unicode code points (not UTF-16 code units).
- For integers, use x ^ y then population count.
- Complexity: O(n) for strings (n = number of code points), O(1) bit operations for fixed-size integers (complexity proportional to word size).

REFERENCE DETAILS

API patterns (JS)
- stringHamming(s,t): validate both strings, ensure equal code point length, iterate code points in parallel, return mismatch count.
- intHamming(a,b): validate non-negative integers, compute x = a ^ b, return popcount(x).

POPULATION COUNT (popcount) methods
- Kernighan's: while (x) { x &= x - 1; count++; }
- Builtins: use BigInt bit operations for >32-bit integers; for 32-bit use Number and >>> 0 with optimized bit tricks.

DIGEST

Source: https://en.wikipedia.org/wiki/Hamming_distance
Retrieved: 2026-03-19
Size fetched: (Wikipedia HTML) ~160 KB

ATTRIBUTION
Content extracted from Wikipedia: Hamming distance (public domain/CC BY-SA as applicable). URL: https://en.wikipedia.org/wiki/Hamming_distance
