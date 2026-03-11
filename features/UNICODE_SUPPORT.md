# Unicode Support

Proper Unicode string handling for accurate character-level comparison in Hamming distance calculations.

## Requirements

Handle Unicode strings correctly by working with code points rather than UTF-16 code units:

- Support all Unicode characters including emoji and symbols
- Handle combining characters and grapheme clusters appropriately
- Normalize Unicode inputs when necessary
- Compare actual characters, not byte representations
- Work with strings containing surrogates pairs correctly

## Acceptance Criteria

- hammingDistance("🙂😀", "😀🙂") returns 2
- hammingDistance("café", "care") works with accented characters  
- hammingDistance("👨‍💻", "👩‍💻") handles complex emoji sequences
- Strings with same visual characters but different encodings compare correctly
- Length calculation uses character count, not byte count
- Unit tests include comprehensive Unicode test cases
- Website demo supports Unicode input and display

## Implementation Notes

- Use for...of loops or Array.from for proper iteration
- Consider String.prototype.normalize for consistent comparison
- Be aware of grapheme cluster boundaries for complex characters
- Test with various Unicode categories: basic multilingual, emoji, symbols
- Document Unicode handling behavior in README
- Ensure consistent behavior across different JavaScript engines