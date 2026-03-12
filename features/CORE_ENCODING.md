# Core Binary Encoding Functions

## Purpose

Implement the foundational encode/decode functions that convert arbitrary binary data to printable text representations and back, forming the core of the binary-to-text encoding library.

## Specification

The library must provide two primary functions for encoding and decoding binary data:

- encode(buffer, encoding) - Convert a Buffer or Uint8Array to a printable string using the specified encoding
- decode(str, encoding) - Convert an encoded string back to binary data using the specified encoding

Both functions must support all built-in encodings (base62, base85, base91) and any custom encodings created via createEncoding.

## Requirements

The core encoding functions must guarantee the round-trip property: for any binary input and supported encoding, decode(encode(input, encoding), encoding) must exactly equal the original input.

Input validation must reject invalid encoding names and malformed encoded strings. The functions must handle edge cases including empty buffers, single-byte inputs, and buffers containing all-zero or all-0xFF bytes.

Error handling must provide clear messages for invalid inputs, unknown encodings, and corrupted encoded strings.

## Acceptance Criteria

- encode function accepts Buffer/Uint8Array input and encoding name string
- decode function accepts encoded string and encoding name string  
- Round-trip property verified for all supported encodings
- Edge cases handled: empty buffer, single byte, all-zero bytes, all-0xFF bytes
- Clear error messages for invalid inputs and unknown encodings
- Functions exported as named exports from src/lib/main.js
- Unit tests verify correctness across all encoding types