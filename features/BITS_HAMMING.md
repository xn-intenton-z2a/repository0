# Bits Hamming Distance

Integer comparison function that computes the Hamming distance between two non-negative integers by counting differing bits.

## Requirements

Implement hammingDistanceBits(x, y) function that counts bit differences between integers:

- Accept two non-negative integer parameters
- Return the number of bit positions where values differ
- Handle integers up to JavaScript's safe integer limit
- Throw RangeError for negative integers
- Throw TypeError for non-integer arguments
- Handle zero values correctly

## Acceptance Criteria

- hammingDistanceBits(1, 4) returns 2 (binary 001 vs 100)
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits(7, 4) returns 2 (binary 111 vs 100)
- hammingDistanceBits(15, 0) returns 4 (binary 1111 vs 0000)
- hammingDistanceBits(-1, 5) throws RangeError
- hammingDistanceBits(3.5, 7) throws TypeError
- Function is exported as named export from src/lib/main.js
- Unit tests cover edge cases including large integers
- Website demo shows binary representation and bit comparison

## Implementation Notes

- Use bitwise XOR operation followed by bit counting
- Implement efficient bit counting algorithm
- Validate inputs are integers and non-negative
- Handle edge case of comparing with zero
- Consider performance for large integers within safe limits