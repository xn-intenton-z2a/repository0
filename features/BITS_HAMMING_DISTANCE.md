# Bits Hamming Distance

## Overview

Implement the hammingDistanceBits function that computes the Hamming distance between two non-negative integers by counting the number of differing bits in their binary representations.

## Implementation Requirements

The function must be exported as a named export from src/lib/main.js with the signature hammingDistanceBits(x, y). It should handle large integers efficiently and validate that inputs are non-negative integers. The implementation should use bitwise operations for optimal performance.

## Acceptance Criteria

- hammingDistanceBits(1, 4) returns 2 (binary 001 vs 100)
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits(7, 0) returns 3 (binary 111 vs 000)
- hammingDistanceBits(15, 8) returns 3 (binary 1111 vs 1000)
- Function throws TypeError for non-integer arguments
- Function throws RangeError for negative integers
- Handles large integers within JavaScript safe integer range
- Function is exported as named export from main.js

## Testing Strategy

Unit tests should cover various integer combinations including powers of 2, edge cases with zero, maximum safe integers, and comprehensive error cases for invalid inputs like floats, negative numbers, and non-numeric types.

## Web Interface Integration

The web interface should provide input fields for two integers with validation, display the binary representations of both numbers, highlight differing bits visually, and show the calculated Hamming distance result.