# Base91 Encoding Implementation

## Purpose

Implement base91 encoding to achieve the highest practical encoding density at approximately 6.50 bits per character, targeting approximately 20 characters for UUID encoding.

## Specification

Base91 encoding uses 91 printable ASCII characters, approaching the theoretical limit for printable character density while maintaining safety across different systems and protocols.

The character set excludes only: space, backslash, single quote, and double quote to maximize compatibility while achieving maximum density.

Base91 uses a variable-length encoding scheme that can achieve closer to the theoretical maximum bits per character compared to fixed-radix encodings.

## Requirements

The base91 character set must be: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~-

The implementation must use the standard base91 algorithm with accumulator and bit-packing for optimal density. The algorithm processes bits incrementally rather than in fixed chunks.

Encoding must handle arbitrary input lengths and produce deterministic output. The variable-length nature requires careful state management during encoding and decoding.

## Acceptance Criteria

- Uses 91-character printable ASCII set excluding space, quotes, backslash
- Encoding density approximately 6.50 bits per character
- UUID encoding produces approximately 20 characters or fewer
- Variable-length bit-packing algorithm implemented correctly
- Handles arbitrary binary input lengths correctly
- Perfect round-trip property maintained
- Performance competitive with other encoding methods
- Compatible with core encode/decode interface
- Comprehensive test coverage including edge cases