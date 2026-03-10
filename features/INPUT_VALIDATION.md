# Input Validation

## Overview

Implement comprehensive input validation for both Hamming distance functions to ensure robust error handling and clear error messages for invalid inputs.

## Implementation Requirements

Both functions must validate their inputs and throw appropriate error types with descriptive messages. String function should validate string types and equal lengths. Bits function should validate integer types and non-negative values. All error messages should be clear and actionable.

## Acceptance Criteria

- hammingDistance throws TypeError with message for non-string inputs
- hammingDistance throws RangeError with message for unequal length strings
- hammingDistanceBits throws TypeError with message for non-integer inputs
- hammingDistanceBits throws RangeError with message for negative integers
- Error messages are descriptive and include expected input format
- Functions handle edge cases like null, undefined, NaN gracefully
- Validation occurs before any processing begins
- Error types match JavaScript conventions

## Testing Strategy

Comprehensive error testing should cover all invalid input combinations for both functions. Tests should verify correct error types, meaningful error messages, and ensure validation happens early in function execution.

## Web Interface Integration

The web interface should display clear error messages when users enter invalid inputs, provide input format hints, and validate inputs client-side before attempting to call the library functions.