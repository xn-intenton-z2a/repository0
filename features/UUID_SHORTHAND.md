# UUID_SHORTHAND

Overview

Provide a shorthand API for encoding and decoding UUIDs (v7 and other 128-bit UUIDs) that: strips dashes from canonical UUID strings, decodes the 32 hex characters to 16 bytes, encodes those bytes using a chosen encoding, then returns the encoded string reversed. The decode counterpart reverses the string, decodes bytes, and returns a normalized dashed lowercase UUID string.

Requirements

- encodeUUIDShorthand(uuid: string, encodingName?: string): string
  - Accept uppercase/lowercase, with or without dashes, and optional surrounding braces.
  - Normalize input then parse exactly 32 hex characters into 16 bytes.
  - Default encodingName should be the currently configured densest built-in encoding.
  - After encoding the 16 bytes, return the encoded string reversed.
- decodeUUIDShorthand(encoded: string, encodingName?: string): string
  - Reverse the input string, decode using the provided encoding, validate 16 bytes produced, and return canonical dashed, lowercase UUID (8-4-4-4-12).
- Errors: invalid UUID input or invalid encoded text should throw descriptive errors.

Acceptance criteria

- Round-trip property: decodeUUIDShorthand(encodeUUIDShorthand(uuid, enc), enc) === normalized uuid (lowercase, dashed) for representative UUIDs including sample, all-zero, and random UUIDs.
- Unit tests cover inputs with/without dashes, uppercase input, and invalid inputs that must raise errors.
- For the library's densest encoding, encoded shorthand output for a sample UUID is strictly shorter than base64 (22 chars).

Implementation notes

- Implement normalization helper that lowercases and inserts dashes for 32-hex-character inputs.
- Reversing the encoded string is purely a reversible transformation; document rationale and include tests that demonstrate reversibility.
