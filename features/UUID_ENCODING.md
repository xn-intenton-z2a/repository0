# UUID Encoding Shorthand

## Overview

Provide convenient functions specifically for encoding UUIDs using the most compact representations, since UUID encoding is the primary benchmark for this library.

## UUID API

Export these specialized functions:

- encodeUUID(uuid) - Encode a UUID string to shortest available encoding
- decodeUUID(str) - Decode back to standard UUID format with dashes

## UUID Input Formats

Accept these UUID input formats:
- Standard format with dashes: 01234567-89ab-cdef-0123-456789abcdef
- Compact format without dashes: 0123456789abcdef0123456789abcdef
- Uppercase or lowercase hex digits
- v4, v6, v7 UUID variants (any valid UUID format)

## Default Encoding Selection

- encodeUUID() uses the highest density encoding available
- If multiple encodings exist, select by bit density descending
- Provide optional second parameter to specify encoding explicitly

## UUID Output Format

- encodeUUID() returns string in the densest available encoding
- decodeUUID() always returns lowercase UUID with dashes in standard format
- Preserve the exact binary representation through the conversion

## Validation

- Reject invalid UUID input with descriptive TypeError
- Detect malformed hex digits or wrong length
- Validate decoded result produces valid UUID format

## Performance Target

- UUID encoding must produce shorter output than base64 (< 24 characters)
- Encoding and decoding should complete in under 1ms for single UUID
- Memory efficient - no intermediate string allocations

## Acceptance Criteria

- encodeUUID and decodeUUID functions exported from main.js
- Handles all standard UUID input formats correctly
- Output shorter than base64 encoding for densest encoding available
- Round-trip preserves exact UUID value
- Comprehensive validation with clear error messages
- Unit tests verify all UUID formats and edge cases