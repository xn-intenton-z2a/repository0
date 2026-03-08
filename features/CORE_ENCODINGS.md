# Core Binary-to-Text Encodings

Implement the fundamental encoding algorithms that form the backbone of the dense encoding library. This feature provides the main encode/decode functionality for base62, base85, and base91 encodings.

## Implementation Requirements

The library must export encode and decode functions that work with arbitrary binary data:

- encode(buffer, encoding) - Convert a Buffer or Uint8Array to encoded string
- decode(str, encoding) - Convert encoded string back to Buffer
- Round-trip property guaranteed: decode(encode(x, enc), enc) equals x

## Built-in Encodings

Base62 encoding using charset [0-9a-zA-Z] providing approximately 5.95 bits per character. This encoding is URL-safe and produces 22 characters for a standard UUID.

Base85 encoding implementing either Ascii85 or Z85 variant, providing approximately 6.41 bits per character and producing 20 characters for a UUID.

Base91 encoding providing approximately 6.50 bits per character and producing around 20 characters for a UUID.

## Edge Case Handling

All encodings must correctly handle edge cases including all-zero bytes, all-0xFF bytes, single byte inputs, and empty buffers. The implementation must avoid control characters and ambiguous characters.

## Error Handling

Invalid input strings must throw descriptive errors. Invalid encoding names must throw errors. Buffer inputs must be validated.

## Performance Considerations

Encodings should be reasonably efficient for typical use cases. Memory allocation should be minimal for common buffer sizes.