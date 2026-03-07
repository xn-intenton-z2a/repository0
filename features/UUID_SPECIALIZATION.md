# UUID Encoding Specialization

Provide optimized functions specifically for UUID encoding and decoding with performance enhancements and convenience features.

## Overview

While the core encoding functions handle arbitrary binary data, UUIDs are a common use case that benefits from specialized handling. This feature adds dedicated UUID functions that automatically handle formatting and provide the shortest possible representations.

## Specialized Functions

The main.js module must export these UUID-specific functions:

- encodeUUID(uuid) — Encode a UUID string to its shortest printable representation
- decodeUUID(str) — Decode a short representation back to standard UUID format

## UUID Processing

The encodeUUID function must accept UUIDs in standard format (with or without hyphens) and automatically:
- Strip hyphens from the input UUID
- Convert the hexadecimal string to binary (16 bytes)
- Apply the densest available encoding
- Return the shortest possible printable representation

The decodeUUID function must reverse this process and return a properly formatted UUID string with hyphens in the correct positions.

## Performance Optimizations

UUID functions should be optimized for this specific 16-byte use case:
- Direct hexadecimal to binary conversion without intermediate steps
- Optimized encoding paths that take advantage of the fixed 128-bit length
- Minimal memory allocation and string manipulation
- Fast validation of UUID format

## Format Flexibility

encodeUUID must accept multiple input formats:
- Standard UUID with hyphens: 550e8400-e29b-41d4-a716-446655440000
- UUID without hyphens: 550e8400e29b41d4a716446655440000
- Uppercase or lowercase hexadecimal

decodeUUID must always return the standard lowercase format with hyphens.

## Error Handling

Robust validation for malformed UUIDs with clear error messages.
Graceful handling of encoded strings that don't decode to valid 16-byte data.

## Acceptance Criteria

- encodeUUID() accepts standard UUID formats with and without hyphens
- decodeUUID() returns properly formatted UUIDs with hyphens
- Round-trip property: decodeUUID(encodeUUID(uuid)) equals the original UUID in standard format
- UUID encoding produces results shorter than base64 (< 24 chars)
- Performance benchmarks show measurable improvement over generic encode/decode for UUID use case
- Comprehensive tests covering various UUID formats and edge cases
- Functions exported as named exports from src/lib/main.js