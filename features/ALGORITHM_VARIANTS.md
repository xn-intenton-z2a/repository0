# Algorithm Variants

Alternative Hamming distance algorithms and related string/bit comparison functions.

## Requirements

Implement additional algorithms and variants related to Hamming distance:

- Normalized Hamming distance (as percentage of total positions)
- Hamming weight function (popcount) for single integers
- Bitwise similarity functions and metrics
- String similarity percentage calculations
- Custom distance metrics based on Hamming principles

## Acceptance Criteria

- hammingDistanceNormalized(a, b) returns distance as percentage
- hammingWeight(x) function for counting set bits in single integer
- bitwiseSimilarity(x, y) returns similarity percentage for integers
- stringSimilarity(a, b) returns similarity percentage for strings
- All variant functions maintain same validation and error handling
- Comprehensive unit tests for all algorithm variants
- Website demo includes tabs for different algorithm variants

## Algorithm Features

- Normalized distance calculations with percentage output
- Population count (Hamming weight) for individual values
- Similarity metrics that complement distance measurements  
- Threshold-based comparison functions for fuzzy matching
- Batch variants for all new algorithm types
- Performance-optimized implementations for each variant

## Implementation Notes

- Implement variants as additional exported functions
- Reuse core validation and bit manipulation utilities
- Provide clear documentation distinguishing each variant
- Add algorithm choice to CLI interface with flags
- Include variant selection in web interface
- Ensure all variants handle Unicode and large integers consistently