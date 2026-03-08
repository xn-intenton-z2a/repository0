# UUID_SPECIALIZATION

Summary

Provide dedicated, optimized helpers for encoding and decoding RFC-4122 UUIDs to produce the shortest printable representations and to validate formats. These functions use the core encoders but implement UUID-specific parsing, validation, and minimal-allocation paths.

Motivation

UUIDs are the benchmark for the project; specialized functions ensure convenience, correctness, and small representations without burdening callers with hex parsing details.

Scope

- Implement encodeUUID(uuid) and decodeUUID(str) exported from src/lib/main.js.
- encodeUUID accepts standard UUID formats with or without hyphens, upper or lower case, and returns the densest encoding string by default or accepts an encoding name to override.
- decodeUUID accepts an encoded string and returns a canonical lowercase hyphenated UUID string.
- Provide validation for malformed inputs and clear error messages.

Behavior

- encodeUUID strips hyphens, parses the 32-hex-digit UUID to 16 bytes, then encodes using the densest available encoding unless an explicit encoding is provided.
- decodeUUID decodes with the specified or inferred encoding and returns a validated canonical UUID in lowercase with hyphens.

Acceptance criteria

- encodeUUID accepts inputs with hyphens, without hyphens, and mixed case, producing deterministic outputs.
- decodeUUID returns canonical UUID strings with hyphens and lowercased hex.
- Round-trip property: decodeUUID(encodeUUID(input)) equals the canonical form of the original UUID for all valid inputs.
- Unit tests cover format variations and error cases (invalid hex length, non-hex characters, decoding to wrong length).
- The default densest encoding produces a UUID representation shorter than base64 (fewer than 24 characters).

Notes

Keep the UUID helpers small and explicit; prefer correctness and clarity over micro-optimizations that complicate tests.