BASE62

# Summary

Implement base62 encoding and decoding for Uint8Array using the character set 0-9a-zA-Z. This feature provides a compact, URL-safe printable encoding as a baseline density option and a canonical UUID shorthand (strip dashes, encode 16 bytes, reverse).

# Motivation

Base62 is a widely used printable alphabet with predictable density (~5.95 bits/char). The library needs a reliable, well-documented base62 implementation to compare against denser encodings and to provide a stable default.

# Specification

- Export named functions: encodeBase62(uint8Array) -> string, decodeBase62(string) -> Uint8Array.
- Provide a convenience UUID shorthand: encodeUUIDBase62(uuidString) and decodeUUIDBase62(encodedString). The shorthand strips dashes from input UUID, uses the 16-byte value, encodes it, and reverses the final string (as required by mission shorthand behavior).
- Charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" (62 chars).
- Compute and document bits per character (approx 5.9542 bits/char) and expected encoded length for 16 bytes (22 characters).

# Tests / Acceptance Criteria

- Round-trip property: decodeBase62(encodeBase62(buf)) === buf for arbitrary Uint8Array inputs, including empty, single-byte, all-zero, and all-0xFF buffers.
- UUID shorthand: decodeUUIDBase62(encodeUUIDBase62(uuid)) equals original canonical UUID bytes for a variety of UUIDs.
- Exported named functions exist in src/lib/main.js and are covered by unit tests in tests/unit/.
- Documented bits-per-character and expected UUID encoded length in README comparison table.
