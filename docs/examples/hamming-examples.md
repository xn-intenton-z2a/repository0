# Hamming Distance Examples

This directory contains example outputs demonstrating the Hamming distance functions.

## String Hamming Distance Examples

| String A | String B | Distance | Explanation |
|----------|----------|----------|-------------|
| "karolin" | "kathrin" | 3 | Positions 1, 2, and 4 differ |
| "hello" | "hallo" | 1 | Position 1 differs (e vs a) |
| "" | "" | 0 | Empty strings have no differences |
| "same" | "same" | 0 | Identical strings |

## Bit Hamming Distance Examples

| Integer A | Integer B | Binary A | Binary B | Distance | Explanation |
|-----------|-----------|----------|----------|----------|-------------|
| 1 | 4 | 001 | 100 | 2 | Bits 0 and 2 differ |
| 0 | 0 | 000 | 000 | 0 | Identical values |
| 7 | 4 | 111 | 100 | 2 | Bits 0 and 1 differ |
| 15 | 0 | 1111 | 0000 | 4 | All 4 bits differ |

## Error Cases

### String Function Errors
- `hammingDistance("a", "bb")` → RangeError: Strings must have equal length
- `hammingDistance(123, "abc")` → TypeError: Both arguments must be strings

### Bit Function Errors  
- `hammingDistanceBits(-1, 5)` → RangeError: Arguments must be non-negative
- `hammingDistanceBits("abc", 5)` → TypeError: Both arguments must be integers