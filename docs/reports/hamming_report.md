# Hamming Functions Report

This report demonstrates the hammingDistance and hammingDistanceBits functions with sample outputs.

Examples

- hammingDistance('karolin', 'kathrin') -> 3
- hammingDistance('', '') -> 0
- hammingDistanceBits(1, 4) -> 2

The implementation compares Unicode code points for strings and uses BigInt for numeric bit comparisons to support integers beyond 32 bits.
