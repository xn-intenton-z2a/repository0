# String Hamming Distance

Core string comparison function that computes the Hamming distance between two strings of equal length.

## Requirements

Implement hammingDistance(a, b) function that counts character differences between strings:

- Accept two string parameters of equal length
- Return the number of positions where characters differ
- Handle Unicode strings correctly by comparing code points, not UTF-16 code units
- Throw RangeError for strings of unequal length
- Throw TypeError for non-string arguments
- Handle empty strings (should return 0)

## Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("hello", "world") returns 4
- hammingDistance("a", "bb") throws RangeError
- hammingDistance(123, "abc") throws TypeError
- hammingDistance("café", "care") handles Unicode correctly
- Function is exported as named export from src/lib/main.js
- Unit tests cover all cases including edge cases and errors
- Website demo allows interactive string comparison

## Implementation Notes

- Use proper Unicode iteration with for...of or Array.from
- Validate input types before length comparison
- Provide clear error messages for validation failures
- Optimize for readability over performance for core algorithm