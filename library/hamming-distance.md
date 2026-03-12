Title: Hamming Distance

Summary

The Hamming distance between two equal-length strings or vectors is the number of positions at which the corresponding symbols differ. For binary values this equals the population count (Hamming weight) of the XOR of the two operands.

Key points

- Definition: number of mismatched positions between two sequences of equal length.
- Complexity: O(n) for length-n sequences.
- Uses: coding theory (error detection/correction), information theory, similarity metrics, cryptography.
- Relation to code design: a code with minimum distance d can detect up to d-1 errors and correct floor((d-1)/2) errors.

Implementation notes

- Strings: iterate indices, increment when chars differ (validate equal length).
- Binary integers: hamming_distance(x,y) = popcount(x ^ y).

Examples

- "karolin" vs "kathrin" → 3
- 0000 vs 1111 → 4

C snippet (Wegner method):

int hamming_distance(unsigned x, unsigned y) {
    int dist = 0;
    for (unsigned val = x ^ y; val; ++dist) {
        val = val & (val - 1); // clears lowest set bit
    }
    return dist;
}

Faster: use CPU popcount instruction or compiler builtin (e.g., __builtin_popcount).

Source: Wikipedia: Hamming distance (definition, examples, code snippets).