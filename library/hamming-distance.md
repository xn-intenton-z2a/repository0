Title: Hamming Distance

Summary

The Hamming distance between two equal-length strings or vectors is the number of positions at which the corresponding symbols differ. For binary values this equals the population count (Hamming weight) of the XOR of the two operands: distance(a, b) = popcount(a ^ b).

Key points

- Definition: number of mismatched positions between two sequences of equal length.
- Complexity: O(n) for length‑n sequences when implemented by scanning or O(1) for fixed-width machine integers using popcount hardware/intrinsics.
- Uses: coding theory (error detection/correction), information theory, similarity metrics, cryptography.
- Relation to codes: a code with minimum distance d detects up to d-1 errors and corrects floor((d-1)/2) errors.

Examples

- "karolin" vs "kathrin" → 3
- 0000 vs 1111 → 4

Implementations

- For strings: iterate indices and count mismatches (validate equal length).
- For integers: return popcount(x ^ y). Use compiler intrinsics when available (e.g. __builtin_popcount, __builtin_popcountll) or hardware POPCNT for best performance.

C example (Wegner method):

int hamming_distance(unsigned x, unsigned y) {
    int dist = 0;
    for (unsigned val = x ^ y; val; ++dist) {
        val = val & (val - 1); // clears lowest set bit
    }
    return dist;
}

Python example (strings):

def hamming_distance(s1: str, s2: str) -> int:
    if len(s1) != len(s2):
        raise ValueError("Strings must be of equal length")
    return sum(1 for a, b in zip(s1, s2) if a != b)

Source: https://en.wikipedia.org/wiki/Hamming_distance