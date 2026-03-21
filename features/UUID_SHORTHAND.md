# UUID_SHORTHAND

Summary

Define and test a compact shorthand for encoding UUIDs as described by the mission: strip hyphens, parse hex into 16 bytes, optionally reverse the byte order, then encode using any registered encoding.

Behaviour

- encodeUuidShorthand(uuidString, encodingName, options)
  - Removes hyphens from uuidString.
  - Validates that the remaining string is 32 hex characters.
  - Converts hex pairs to a 16-byte Uint8Array in canonical order (byte 0 from first hex pair).
  - If options.reverse is true (default per mission), reverse the 16-byte array before encoding.
  - Use encode(encodingName, bytes) to produce the final string and return it.

- decodeUuidShorthand(encodedString, encodingName, options)
  - Decodes into a 16-byte Uint8Array using decode.
  - If options.reverse is true, reverse the bytes back.
  - Convert bytes into canonical hyphenated UUID string (8-4-4-4-12) using lowercase hex.

Rationale

- The mission explicitly requires the shorthand to include stripping dashes and reversing bytes; the option allows implementers to disable reversal for interoperability, but tests should assert the mission-default behaviour.

# ACCEPTANCE CRITERIA

- encodeUuidShorthand is exported and unit-tested for valid inputs, nil UUID, and malformed inputs (should throw on invalid hex length or invalid characters).
- decodeUuidShorthand reverses the operation and returns the canonical hyphenated lowercase UUID string.
- Round-trip tests assert that decodeUuidShorthand(encodeUuidShorthand(uuid)) equals the normalized uuid for a variety of sample UUIDs.
- Tests verify that the encoded shorthand length across encodings matches listEncodings exampleLengthFor16Bytes for the selected encoding.
