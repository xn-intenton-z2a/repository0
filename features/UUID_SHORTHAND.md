# UUID_SHORTHAND

Overview

Provide a shorthand API for encoding and decoding 128-bit UUIDs that normalises common input formats and exposes a compact representation using any registered encoding. The shorthand functions operate on canonical 128-bit UUID bytes and rely on the core encode/decode API.

Behavior

- encodeUUIDShorthand(uuid: string, encodingName?: string): string
  - Accepts canonical UUID strings with or without dashes, uppercase or lowercase, and optional surrounding braces.
  - Normalises the input into 32 hexadecimal characters, converts to 16 bytes, selects an encoding (if encodingName is omitted the repository's densest registered encoding is used), encodes the bytes, and returns the encoded string.
- decodeUUIDShorthand(encoded: string, encodingName: string): string
  - Decodes the provided encoded string using the supplied encodingName, validates that decoding produces exactly 16 bytes, and returns a canonical dashed lowercase UUID string (8-4-4-4-12).

Notes on symmetry

- Implementations may choose to allow decodeUUIDShorthand to accept an optional encodingName and default to the densest encoding; current repository tests always provide the encodingName on decode to avoid ambiguity.

Acceptance criteria

- Round-trip property: for each registered encoding, decodeUUIDShorthand(encodeUUIDShorthand(uuid, encName), encName) equals the canonical lowercase dashed uuid for representative UUIDs (sample, all-zero, all-0xFF, and a deterministic random UUID).
- Input normalisation: encodeUUIDShorthand accepts uppercase, lowercase, dashed, and non-dashed UUID forms and normalises them before encoding; tests should verify equivalence.
- Error handling: invalid UUID input (wrong length, non-hex characters) should throw a descriptive error; invalid or unknown encodingName on decode should throw a descriptive error.
- Length check: for the repository's densest encoding, the shorthand encoded output for a sample UUID must be strictly shorter than base64 (22 characters).

Implementation notes

- Provide small helpers hexToBytes and bytesToUuid to centralise normalisation and validation.
- Document the chosen default behaviour for decode when encodingName is omitted; tests should reflect the chosen behaviour consistently.
