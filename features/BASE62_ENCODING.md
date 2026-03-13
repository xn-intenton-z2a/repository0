# Base62 Encoding Implementation

## Overview

Implement Base62 encoding using characters [0-9a-zA-Z] as the foundation encoding that is URL-safe and widely compatible.

## Character Set

Use exactly these 62 characters in order:
0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ

## Bit Density

Base62 provides approximately 5.95 bits per character, resulting in:
- 22 characters for a 128-bit UUID (vs 24 for base64)
- No padding required due to mathematical properties
- Clean encoding without ambiguous characters

## Implementation Requirements

- Register as encoding named "base62"
- Use big-endian byte order for consistent results
- Handle arbitrary length input buffers
- No padding characters needed

## URL Safety

All Base62 characters are URL-safe without escaping:
- No special characters like +/= from base64
- Safe for use in URLs, filenames, databases
- Case-sensitive but no confusing character pairs

## Performance Characteristics

- Efficient integer arithmetic using JavaScript BigInt
- Minimal memory allocations during encoding/decoding  
- Predictable output length calculation
- Fast validation using character lookup tables

## Edge Cases

- Empty input produces empty output
- Single zero byte encodes to single '0' character
- All-0xFF bytes handled correctly
- Large inputs processed without overflow

## Compatibility

- Output compatible with other Base62 implementations
- Deterministic encoding for identical inputs
- Reversible decoding to exact original bytes

## Acceptance Criteria

- "base62" encoding registered and available via encode/decode functions
- UUID encoding produces exactly 22 characters
- Round-trip correct for all test cases
- No ambiguous or unsafe characters used
- Performance benchmarks meet target speeds
- Unit tests verify mathematical correctness