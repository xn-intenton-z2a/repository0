# UUID Encoding Shortcuts

## Purpose

Provide specialized functions for encoding and decoding v7 UUIDs, the primary benchmark for measuring encoding density in this library.

## Specification

The library must provide UUID-specific convenience functions:

- encodeUUID(uuid) - Accept a UUID string (with or without dashes), convert to 16 bytes, and encode using the densest available encoding
- decodeUUID(str) - Decode a UUID string back to standard UUID format with dashes

These functions automatically strip dashes from input UUIDs and focus on achieving the shortest possible printable representation.

## Requirements

The UUID functions must handle standard UUID formats including hyphenated (8-4-4-4-12) and compact (32 hex chars) representations.

The encodeUUID function should default to the densest available encoding but allow an optional encoding parameter to specify alternatives.

Output must be deterministic and optimized for minimum character count while maintaining readability and avoiding ambiguous characters.

## Acceptance Criteria

- encodeUUID accepts both hyphenated and compact UUID strings
- decodeUUID returns standard hyphenated UUID format
- Default encoding produces shorter output than base64 (under 24 characters)
- Optional encoding parameter supported in encodeUUID
- Round-trip property: decodeUUID(encodeUUID(uuid)) equals original UUID
- Functions handle v7 UUID format correctly
- Unit tests verify encoding density benchmarks
- Functions exported as named exports from src/lib/main.js