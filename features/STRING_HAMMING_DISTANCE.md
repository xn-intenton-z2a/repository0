# String Hamming Distance

## Overview

Implement the core hammingDistance function that computes the Hamming distance between two strings of equal length. The function should count the number of positions where characters differ between the two input strings.

## Implementation Requirements

The function must be exported as a named export from src/lib/main.js with the signature hammingDistance(a, b). It should handle Unicode strings correctly by comparing code points rather than UTF-16 code units. The function must validate that both inputs are strings and have equal length.

## Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0  
- hammingDistance("hello", "hello") returns 0
- hammingDistance("abc", "xyz") returns 3
- Function throws TypeError for non-string arguments
- Function throws RangeError for strings of unequal length
- Unicode characters are handled correctly
- Function is exported as named export from main.js

## Testing Strategy

Unit tests should cover normal cases with various string lengths, edge cases with empty strings, Unicode character handling, and comprehensive error cases for invalid inputs. Tests should verify exact character-by-character comparison logic.

## Web Interface Integration

The web interface should provide input fields for two strings and display the calculated Hamming distance result. It should show error messages for invalid inputs and highlight the differing character positions visually.