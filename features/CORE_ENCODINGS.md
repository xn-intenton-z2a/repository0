# Core Encoding Implementation

Implement the fundamental encoding and decoding functions with built-in support for progressively denser character sets.

## Overview

This feature provides the core encode/decode functionality that forms the foundation of the library. It implements three standard encodings with increasing bit density: base62, base85 (Ascii85/Z85), and base91.

## Core Functions

The main.js module must export these primary functions:

- encode(buffer, encoding) — Convert arbitrary binary data to printable text using the specified encoding
- decode(str, encoding) — Convert encoded text back to original binary data
- listEncodings() — Return metadata about available encodings including bit density and character set info

## Built-in Encodings

### Base62 Encoding
Character set: 0-9a-zA-Z (62 characters)
Bit density: approximately 5.95 bits per character
URL-safe and widely compatible
Expected UUID length: 22 characters

### Base85 Encoding (Ascii85/Z85)
Character set: 85 printable ASCII characters excluding problematic ones
Bit density: approximately 6.41 bits per character  
Expected UUID length: 20 characters
Must avoid control characters and quotes to maintain JSON compatibility

### Base91 Encoding
Character set: 91 carefully selected printable characters
Bit density: approximately 6.50 bits per character
Expected UUID length: approximately 20 characters
Highest density while maintaining broad printable character compatibility

## Requirements

All encodings must satisfy the round-trip property: decode(encode(x, enc), enc) equals x for any binary input x and encoding enc.

Character sets must exclude control characters, ambiguous characters (like 0/O, 1/l/I in contexts where confusion matters), and characters that cause issues in common contexts (quotes, backslashes).

Error handling must be robust for invalid input data and unsupported encoding names.

## Acceptance Criteria

- encode() and decode() functions handle arbitrary binary data correctly
- All three encodings (base62, base85, base91) are implemented and working
- Round-trip property verified for edge cases: empty buffer, single byte, all-zero bytes, all-0xFF bytes
- listEncodings() returns accurate metadata for each encoding
- UUID encoding produces shorter results than base64 (< 24 chars) for base85 and base91
- All functions exported as named exports from src/lib/main.js
- Comprehensive unit tests covering normal cases and edge cases