# Base85 Encoding Implementation

## Purpose

Implement base85 encoding (Ascii85/Z85 variant) providing higher density encoding at approximately 6.41 bits per character, producing 20-character UUID representations.

## Specification

Base85 encoding uses 85 printable ASCII characters to achieve higher encoding density than base62. The implementation should follow the Z85 specification which avoids problematic characters like quotes and backslashes.

The Z85 character set excludes: " ' \ and other potentially problematic characters while maximizing printability and avoiding ambiguity.

For UUID encoding, base85 should produce exactly 20 characters, representing a significant improvement over base64 and base62.

## Requirements

The implementation must use the Z85 character set: 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#

The encoding algorithm must process data in 4-byte chunks (32 bits) to 5-character chunks (log2(85^5) ≈ 32.4 bits) with appropriate padding handling.

Error handling must detect and reject malformed base85 strings during decoding.

## Acceptance Criteria

- Uses Z85 character set avoiding problematic characters
- Encoding density approximately 6.41 bits per character  
- UUID encoding produces exactly 20 characters
- Processes 4-byte to 5-character chunks efficiently
- Handles padding for inputs not divisible by 4 bytes
- Perfect round-trip fidelity verified by tests
- Compatible with core encode/decode interface
- Clear error messages for invalid base85 strings
- Performance benchmarks demonstrate efficiency gains