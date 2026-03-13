# Base91 Encoding Implementation

## Overview

Implement Base91 encoding to push density even higher, achieving approximately 6.50 bits per character for maximum compactness while maintaining printable output.

## Character Set

Base91 uses 91 printable ASCII characters, excluding:
- Space (0x20) - can cause issues in text processing
- Backslash (0x5C) - escape character problems
- Single quote (0x27) - shell and string literal issues  
- Double quote (0x22) - JSON and string problems
- Delete (0x7F) - not printable

Resulting character set:
!"#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~

## Bit Density

Base91 achieves approximately 6.50 bits per character:
- Approximately 20 characters for a 128-bit UUID
- Better density than Base85 while remaining printable
- Approaches theoretical maximum for printable character sets

## Algorithm Approach

Base91 uses a different algorithm than simple radix conversion:
- Maintains a bit accumulator and extracts 6-7 bits per output character
- Variable-length encoding based on available entropy
- More complex than Base62/85 but achieves higher density

## Implementation Complexity

- Requires careful bit manipulation and state management
- More complex encode/decode logic than fixed-radix systems
- Need thorough testing for correctness across all inputs

## Character Selection Rationale

Excluded characters chosen to maximize compatibility:
- Safe in shell commands and scripts
- Safe in JSON and XML contexts
- Safe in most database storage systems
- Printable and distinguishable

## Performance Considerations

- Bit manipulation may be slower than integer arithmetic
- Trade-off between density and encoding speed
- Acceptable for the density improvement achieved

## Edge Case Handling

- Empty input produces empty output
- Single bytes encoded correctly
- Large inputs processed without error
- Deterministic output for identical inputs

## Acceptance Criteria

- "base91" encoding registered and functional
- UUID encoding produces ~20 characters (better than Base85)
- Round-trip correctness verified extensively
- Character set avoids problematic ASCII characters
- Performance acceptable relative to density improvement
- Unit tests cover complex bit manipulation edge cases