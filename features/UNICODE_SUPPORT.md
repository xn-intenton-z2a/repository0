# Unicode String Handling

## Overview

Ensure the hammingDistance function correctly handles Unicode strings by comparing code points rather than UTF-16 code units, supporting proper internationalization and emoji handling across the library and web interface.

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

## Web Interface Integration

The web interface at src/web/index.html properly handles Unicode input and displays Unicode strings correctly in both input fields and result visualizations.

## Testing Requirements

Comprehensive tests validate Unicode handling with strings containing emojis, accented characters, mathematical symbols, and mixed Unicode content. Tests verify consistent behavior across different Unicode scenarios.

## CLI Support

The CLI interface properly handles Unicode arguments from command line input and displays Unicode strings correctly in terminal output across different platforms.

## Performance Considerations

Unicode handling maintains reasonable performance while ensuring correctness, using efficient iteration methods that avoid unnecessary string conversions or multiple passes through the data.

## Acceptance Criteria

- [ ] Function correctly handles strings with emojis and multi-byte Unicode characters
- [ ] String length calculation counts actual characters, not UTF-16 code units
- [ ] Character iteration handles surrogate pairs properly
- [ ] Unicode normalization is handled consistently
- [ ] International text including right-to-left languages works correctly
- [ ] Performance remains reasonable for typical Unicode string lengths
- [ ] Unit tests validate Unicode scenarios with emojis, accented characters, and complex scripts
- [ ] Web interface displays Unicode strings correctly in inputs and outputs
- [ ] CLI properly handles Unicode command line arguments and output
- [ ] Visual diff highlighting works correctly with Unicode characters