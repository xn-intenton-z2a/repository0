# UUID Encoding Specialization

Provide convenient functions specifically optimized for encoding v7 UUIDs to achieve maximum density. This feature builds on the core encodings to deliver the shortest possible printable UUID representations.

## UUID-Specific Functions

Export dedicated UUID functions that handle the common UUID encoding workflow:

- encodeUUID(uuid) - Accept UUID string (with or without dashes), encode to shortest representation
- decodeUUID(str, encoding) - Decode back to standard UUID string format with dashes
- compareUUIDEncodings(uuid) - Return comparison table of all encoding lengths for a given UUID

## Input Flexibility 

The encodeUUID function must accept UUIDs in multiple formats: with dashes (8-4-4-4-12), without dashes (32 hex chars), or as a 16-byte buffer. Output should consistently use the most compact encoding available.

## Automatic Encoding Selection

When no encoding is specified, encodeUUID should automatically select the densest available encoding. Users can override this by specifying a particular encoding name.

## UUID Format Validation

Input validation must verify proper UUID format and length. Invalid UUIDs should produce clear error messages. The decoder must reconstruct proper UUID format with dashes in the canonical 8-4-4-4-12 pattern.

## Benchmarking Support

The compareUUIDEncodings function should return a structured comparison showing character counts for each encoding method, enabling users to evaluate density trade-offs.

## Integration with Core Library

UUID functions leverage the same underlying encoding implementations as the general-purpose encode/decode functions, ensuring consistency and avoiding code duplication.