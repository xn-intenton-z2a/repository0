# Bitwise Hamming Distance Function

## Overview

Implement the hammingDistanceBits function that computes the Hamming distance between two non-negative integers by counting the number of differing bits in their binary representations.

## Functionality

The hammingDistanceBits function accepts two integer parameters and returns the count of bit positions where the binary representations differ. This is calculated using bitwise XOR followed by population count.

## Input Validation

The function validates that both inputs are non-negative integers and throws a TypeError for non-integer arguments. It throws a RangeError for negative integers since negative numbers have implementation-dependent binary representations.

## Algorithm Implementation

The function uses efficient bitwise operations to compute the result. It performs XOR on the two numbers to identify differing bits, then counts the number of 1 bits in the result using Brian Kernighan's algorithm or built-in bit counting methods.

## Edge Cases

The function handles zero inputs correctly, returning 0 when both numbers are zero. It works with large integers within JavaScript's safe integer range and handles the maximum safe integer values properly.

## API Design

The function is exported as a named export alongside the string Hamming distance function. It maintains consistency with the library's naming conventions and error handling patterns.

## Testing Requirements

Unit tests cover basic bit operations, edge cases with zero, large numbers within safe integer bounds, and all error conditions with appropriate error types and messages.

## Web Integration

The web interface at src/web/index.html has placeholder functionality that will use this function via the calculateBitDistance function. The web demo displays binary representations with visual highlighting of differing bits.

## Examples

Basic usage includes comparing integers like 1 and 4 which have binary representations 001 and 100, resulting in a Hamming distance of 2. Examples also demonstrate zero cases and larger integer comparisons.

## Acceptance Criteria

- [ ] `hammingDistanceBits(1, 4)` returns `2` (binary: 001 vs 100)
- [ ] `hammingDistanceBits(0, 0)` returns `0`
- [ ] Function throws `TypeError` for non-integer arguments  
- [ ] Function throws `RangeError` for negative integers
- [ ] Function works correctly with large integers within JavaScript safe integer range
- [ ] Function is exported as named export from `src/lib/main.js`
- [ ] Comprehensive unit tests cover normal cases, edge cases, and error cases
- [ ] Web interface calculateBitDistance function uses the library function
- [ ] Behaviour tests verify web integration works correctly