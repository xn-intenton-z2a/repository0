# String Hamming Distance Function

## Overview

Implement the core hammingDistance function that computes the Hamming distance between two strings of equal length. The Hamming distance is the number of positions where the characters differ.

## Functionality

The hammingDistance function accepts two string parameters and returns a non-negative integer representing the number of differing character positions. The function must handle Unicode strings correctly by comparing code points rather than UTF-16 code units.

## Input Validation

The function validates that both inputs are strings and throws a TypeError for non-string arguments. It also validates that both strings have the same length and throws a RangeError if they differ in length.

## Edge Cases

The function handles empty strings by returning 0 when both strings are empty. It correctly processes strings containing Unicode characters including emojis, accented characters, and multi-byte sequences.

## API Design

The function is exported as a named export from the main library module. It follows a simple signature pattern that makes it easy to import and use in various contexts.

## Testing Requirements

Comprehensive unit tests verify normal operation with ASCII strings, Unicode strings, empty strings, and error conditions. Tests confirm the exact error types and messages for invalid inputs.

## Web Integration

The web interface at src/web/index.html has placeholder functionality that will use this function via the calculateStringDistance function. The web demo provides real-time calculation with visual feedback.

## Examples

Basic usage includes comparing simple ASCII strings like "karolin" and "kathrin" which should return 3. Unicode examples demonstrate proper handling of characters like "café" and "care" or emoji sequences.

## Acceptance Criteria

- [ ] `hammingDistance("karolin", "kathrin")` returns `3`
- [ ] `hammingDistance("", "")` returns `0` 
- [ ] `hammingDistance("a", "bb")` throws `RangeError`
- [ ] Function handles Unicode strings correctly (compare code points, not UTF-16 code units)
- [ ] Function throws `TypeError` for non-string arguments
- [ ] Function is exported as named export from `src/lib/main.js`
- [ ] Comprehensive unit tests cover all cases
- [ ] Web interface calculateStringDistance function uses the library function
- [ ] Behaviour tests verify web integration works correctly