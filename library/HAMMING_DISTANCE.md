# HAMMING_DISTANCE

## Table of Contents

1. Algorithm Definition and Mathematical Properties  
2. Binary String Implementation Methods
3. Error Detection and Correction Capabilities
4. Performance Characteristics and Complexity Analysis
5. Implementation Code Examples and Optimizations
6. JavaScript Implementation Notes

## Normalised Extract

### Algorithm Definition and Mathematical Properties

The Hamming distance between two equal-length strings of symbols is the number of positions at which the corresponding symbols are different. It measures the minimum number of substitutions required to change one string into the other, or equivalently, the minimum number of errors that could have transformed one string into the other.

For a fixed length n, the Hamming distance is a metric on the set of words of length n as it fulfills the conditions of non-negativity, symmetry, the Hamming distance of two words is 0 if and only if the two words are identical, and it satisfies the triangle inequality.

Examples:
- karolin and kathrin is 3
- karolin and kerstin is 3  
- kathrin and kerstin is 4
- 0000 and 1111 is 4
- 2173896 and 2233796 is 3

### Binary String Implementation Methods

For binary strings a and b the Hamming distance is equal to the number of ones (population count) in a XOR b. The XOR operation sets to 1 only the bits that are different between the two inputs.

Basic algorithm steps:
1. Perform bitwise XOR operation on the two input values
2. Count the number of 1 bits in the XOR result
3. Return the count as the Hamming distance

Optimized population-count procedures can run in time proportional to the number of differing bits rather than the full width of the operands.

### Error Detection and Correction Capabilities

The minimum Hamming distance (dmin) between codewords defines error detection and correction capabilities:

Error Detection: A code C is k error detecting if the minimum Hamming distance between any two of its codewords is at least k+1.

Error Correction: A code C is k-error correcting if the minimum Hamming distance between any two of its codewords is at least 2k+1. This means for every word w, there exists at most one codeword c such that the Hamming distance between w and c is at most k.

A code with minimum Hamming distance d between its codewords can detect at most d-1 errors and can correct floor((d-1)/2) errors. The latter number is also called the packing radius or the error-correcting capability of the code.

### Performance Characteristics and Complexity Analysis

Time Complexity: O(n) where n is the length of the strings
Space Complexity: O(1) for efficient implementations
Best-case performance: O(n)
Worst-case performance: O(n)
Average performance: O(n)

The linear time complexity applies to both the basic character-by-character comparison method and the optimized bitwise operations for binary data.

### Implementation Code Examples and Optimizations

Character Comparison Method in Python:
def hamming_distance(string1: str, string2: str) -> int:
    if len(string1) != len(string2):
        raise ValueError("Strings must be of equal length.")
    dist_counter = 0
    for n in range(len(string1)):
        if string1[n] != string2[n]:
            dist_counter += 1
    return dist_counter

Bitwise XOR Method for Integers in C:
int hamming_distance(unsigned x, unsigned y) {
    int dist = 0;
    for (unsigned val = x ^ y; val > 0; ++dist) {
        val = val & (val - 1); // Wegner's method
    }
    return dist;
}

Population Count Optimization Using Built-in Functions:
int hamming_distance32(unsigned int x, unsigned int y) {
    return __builtin_popcount(x ^ y);
}

int hamming_distance64(unsigned long long x, unsigned long long y) {
    return __builtin_popcountll(x ^ y);
}

### JavaScript Implementation Notes

- Unicode-aware string comparison: For character-based Hamming distance treat inputs as sequences of Unicode code points, not UTF-16 code units. Normalize both strings using String.prototype.normalize('NFC') to canonical form before comparison. Iterate by code points using the string iterator (for...of) or manual iterators via Symbol.iterator to compare values in lockstep; if one iterator finishes before the other, report a length-mismatch error.

- Avoid charCodeAt for multi-code-unit characters because charCodeAt returns UTF-16 code units; use codePointAt when you need numeric code point values for a position that may start a surrogate pair.

- Binary/integer inputs (32-bit): JavaScript bitwise XOR (^) coerces operands to ToInt32 (32-bit signed). For two numbers x and y that fit in 32 bits compute v = (x ^ y) >>> 0 to treat as unsigned if needed, then count set bits with Kernighan's method: repeatedly clear the lowest-order 1 bit with v &= v - 1 and increment a counter. This is O(k) where k is population count.

- BigInt support for wide integers: Use BigInt operands exclusively (both must be BigInt or TypeError is thrown). Compute v = a ^ b where a and b are BigInt, then count set bits via the same Kernighan loop using BigInt arithmetic (v &= v - 1n). To count bits within a fixed width use BigInt.asUintN(width, value) to mask before counting.

- Large byte sequences: For long binary buffers use typed arrays (Uint8Array) and a 256-entry lookup table for per-byte popcount; sum table lookups for each byte for best throughput in JS.

- Performance trade-offs: Character-by-character comparisons are simplest and sufficient for typical string sizes. For high-throughput binary comparisons prefer typed arrays and chunked popcount. For cryptographic or large-scale analytics consider native modules or WebAssembly implementing hardware popcount.

## Supplementary Details

The Hamming distance is named after Richard Hamming, who introduced the concept in his fundamental paper Error detecting and error correcting codes in 1950. It has applications in telecommunications for counting flipped bits as an estimate of transmission error, coding theory for error detection and correction, information theory for measuring information differences, cryptography for analyzing bit patterns, and systematics as a measure of genetic distance.

The metric space of length-n binary strings with Hamming distance is known as the Hamming cube, equivalent to distances between vertices in a hypercube graph. Binary strings can be viewed as vectors in n-dimensional space where Hamming distance equals Manhattan distance between vertices.

## Reference Details

### Bit Manipulation Specifications

XOR Truth Table for Hamming Distance Calculation:
x | y | x XOR y
0 | 0 | 0
0 | 1 | 1  
1 | 0 | 1
1 | 1 | 0

Wegner Bit Counting Algorithm: val = val & (val - 1) sets to zero val's lowest-order 1 bit

Population Count Functions:
- __builtin_popcount(x) for 32-bit integers
- __builtin_popcountll(x) for 64-bit integers

JavaScript specifics:
- Bitwise operators operate on 32-bit signed integers after ToInt32 coercion; use >>> 0 to interpret as unsigned.
- BigInt bitwise XOR exists when both operands are BigInt; mixing number and BigInt throws TypeError.
- Use String.prototype.codePointAt and the string iterator to handle surrogate pairs and supplementary characters correctly.

### Error Correction Mathematics

For minimum distance d:
- Maximum detectable errors: d - 1
- Maximum correctable errors: floor((d - 1) / 2)
- Sphere packing radius: floor((d - 1) / 2)

Hamming Spheres: Closed balls of radius k centered on distinct codewords being disjoint for k-error correcting codes.

### Performance Specifications

Linear time complexity applies regardless of input alphabet size. For binary strings, XOR-based methods provide constant factor improvements over character comparison. Hardware population count instructions offer additional performance gains when available.

The Hamming distance is also used in systematics as a measure of genetic distance. However, for comparing strings of different lengths, or strings where not just substitutions but also insertions or deletions have to be expected, a more sophisticated metric such as the Levenshtein distance may be more appropriate.

## Detailed Digest

Technical content extracted from Wikipedia Hamming Distance article and related sources in SOURCES.md covering algorithmic definition, mathematical properties, error correction theory, implementation methods, and performance characteristics. Retrieved 2026-03-11.

The Hamming distance algorithm serves as a fundamental string metric with applications spanning error detection, coding theory, and information processing. The binary implementation using XOR operations provides optimal performance for digital data processing; JavaScript-specific considerations for code points, big integers, and 32-bit coercion are included for direct implementation guidance.

## Attribution Information

Source: https://en.wikipedia.org/wiki/Hamming_distance
Additional sources referenced in SOURCES.md: MDN String.codePointAt, MDN Bitwise XOR, MDN String.charCodeAt, trekhleb/javascript-algorithms hamming-distance, vitest.dev API, Wikipedia Error detection and correction, ECMAScript codePointAt spec
Data size: 15000 characters extracted
Retrieved: 2026-03-11