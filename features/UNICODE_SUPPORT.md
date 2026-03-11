# Unicode String Handling

## Overview

Ensure the hammingDistance function correctly handles Unicode strings by comparing code points rather than UTF-16 code units, supporting proper internationalization and emoji handling.

## Code Point Comparison

The function uses proper Unicode iteration methods to compare actual characters rather than UTF-16 surrogate pairs. This ensures accurate distance calculation for strings containing emojis, accented characters, and other multi-byte Unicode sequences.

## String Length Calculation

Length validation uses Unicode-aware methods to count actual characters rather than code units. This prevents incorrect length mismatch errors when comparing strings with the same number of visible characters but different UTF-16 representations.

## Character Iteration

The implementation iterates through strings using methods that properly handle Unicode boundaries, ensuring each comparison operates on complete characters rather than partial surrogate pairs.

## Normalization Considerations

The function handles Unicode normalization consistently, though it does not perform automatic normalization to allow developers control over string comparison behavior based on their specific requirements.

## International Text Support

Full support for international text including right-to-left languages, combining characters, and complex scripts ensures the library works correctly in global applications.

## Testing Requirements

Comprehensive tests validate Unicode handling with strings containing emojis, accented characters, mathematical symbols, and mixed Unicode content. Tests verify consistent behavior across different Unicode scenarios.

## Performance Considerations

Unicode handling maintains reasonable performance while ensuring correctness, using efficient iteration methods that avoid unnecessary string conversions or multiple passes through the data.