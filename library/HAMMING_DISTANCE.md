# HAMMING_DISTANCE

## Table of Contents
- Definition and Core Algorithm
- Binary String Implementation
- Error Detection and Correction
- Performance Characteristics
- Implementation Examples

## Definition and Core Algorithm

The Hamming distance between two strings of equal length is the number of positions at which the corresponding symbols are different. It measures the minimum number of substitutions required to change one string into the other.

For binary strings a and b, the Hamming distance equals the number of ones in a XOR b (population count).

Time complexity: O(n) for all cases
Space complexity: O(n)

The algorithm works by:
1. Comparing each corresponding pair of characters/bits
2. Counting the number of positions where they differ
3. Returning the total count

## Binary String Implementation

For binary data, the most efficient approach uses bitwise XOR followed by population count:

1. XOR the two values: x ^ y sets bits to 1 only where x and y differ
2. Count the number of 1 bits in the result using population count

The XOR operation creates a bit pattern where 1 indicates differing bits and 0 indicates matching bits.

Population count can be implemented using:
- Brian Kernighan algorithm: repeatedly clear lowest set bit
- Built-in processor instructions like __builtin_popcount
- Lookup tables for smaller bit widths

## Error Detection and Correction

A code with minimum Hamming distance d can:
- Detect at most d-1 errors
- Correct floor((d-1)/2) errors

For k-error detection: minimum distance must be at least k+1
For k-error correction: minimum distance must be at least 2k+1

This forms the basis for error-correcting codes where codewords are separated by sufficient Hamming distance to enable error recovery.

## Performance Characteristics

Hamming distance calculation is:
- Linear time O(n) in string length
- Constant space O(1) for storage
- Highly parallelizable for SIMD operations
- Cache-friendly due to sequential access patterns

Bitwise operations are typically faster than character-by-character comparison, especially for longer binary sequences.

## Implementation Examples

String comparison approach:
- Iterate through each position
- Compare characters at same index
- Increment counter for mismatches
- Handle equal-length requirement

Bitwise approach for integers:
- XOR the two values
- Count set bits in result
- Use efficient bit counting algorithm
- Handle different integer sizes appropriately

## Supplementary Details

The Hamming distance forms a metric space when applied to fixed-length strings, satisfying:
- Non-negativity: d(x,y) >= 0
- Symmetry: d(x,y) = d(y,x) 
- Identity: d(x,y) = 0 if and only if x = y
- Triangle inequality: d(x,z) <= d(x,y) + d(y,z)

For binary strings of length n, the Hamming space forms an n-dimensional hypercube where each vertex represents a unique bit pattern and edges connect vertices differing by exactly one bit.

Applications include:
- Telecommunications for signal error estimation
- Cryptography for analyzing bit differences
- Bioinformatics for genetic distance measurement
- Computer graphics for color difference calculation

## Reference Details

Algorithm implementations must handle:
- Input validation for equal-length strings
- Character encoding considerations for text strings
- Integer overflow for very long sequences
- Performance optimization for specific use cases

For JavaScript string implementation:
- Use charAt() or bracket notation for character access
- Handle Unicode code points with codePointAt() if needed
- Consider string.length for bounds checking
- Implement early termination for performance

For JavaScript binary implementation:
- Use bitwise XOR (^) operator for difference detection
- Implement population count via bit manipulation
- Handle 32-bit integer limitations
- Consider BigInt for larger values

Bit counting techniques:
- Brian Kernighan: val = val & (val - 1) repeatedly
- Built-in functions where available
- Lookup tables for 8-bit chunks
- SIMD instructions for parallel counting

## Detailed Digest

Technical content extracted from Wikipedia Hamming Distance article and supporting JavaScript documentation sources on 2026-03-11.

The Hamming distance is a fundamental concept in information theory measuring the number of differing positions between equal-length strings. Named after Richard Hamming, it has applications in coding theory, telecommunications, and cryptography.

The metric properties make it suitable for error detection and correction systems. The relationship to XOR operations enables efficient binary implementations using population count algorithms.

For JavaScript implementation, the key considerations are string access methods, character encoding handling, and bitwise operation limitations. The algorithm scales linearly with input size and can be optimized using various bit manipulation techniques.

## Attribution Information

Sources crawled:
- Wikipedia Hamming Distance: 15000 characters
- MDN String codePointAt: 6500 characters  
- MDN Bitwise XOR: 4200 characters
- MDN String charAt: 5800 characters
- Wikipedia Bitwise Operations: 15000 characters
- MDN Numbers and Dates Guide: 10000 characters

Total data size: 56500 characters
Retrieved: 2026-03-11T22:01:03Z