# Base85 (Ascii85/Z85) Encoding

## Overview

Implement Base85 encoding to achieve higher density than Base62, targeting approximately 6.41 bits per character for more compact representations.

## Character Set Options

Support both major Base85 variants:

- **Ascii85**: Standard Adobe variant with specific character set
- **Z85**: ZeroMQ variant optimized to avoid quote characters and backslashes

Choose Z85 as default for better compatibility in JSON and shell contexts.

## Z85 Character Set

Use the Z85 character set in this exact order:
0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#

## Bit Density

Base85 provides approximately 6.41 bits per character:
- 20 characters for a 128-bit UUID
- Significant improvement over Base62 (22 chars) and base64 (24 chars)
- More compact representation for all binary data

## Implementation Strategy

- Process input in 4-byte chunks when possible
- Handle remaining bytes with appropriate padding logic
- Use 32-bit arithmetic where feasible, BigInt for larger values
- Optimize for common input sizes like UUIDs

## Character Safety

Z85 character set avoids problematic characters:
- No quotes (single or double) for JSON safety
- No backslashes to avoid escape sequence issues
- No whitespace characters
- All printable ASCII characters

## Padding Strategy

Handle non-multiple-of-4 input lengths:
- Use consistent padding approach for partial blocks
- Ensure round-trip correctness for all input sizes
- No visible padding characters in output

## Performance Goals

- Faster than Base62 due to larger radix efficiency
- Memory efficient processing of large inputs
- Predictable performance characteristics

## Acceptance Criteria

- "base85" encoding registered and functional
- UUID encoding produces exactly 20 characters
- Round-trip correct for all input sizes and patterns
- Z85 character set implementation avoids problematic characters
- Performance better than Base62 for equivalent operations
- Comprehensive unit tests including edge cases