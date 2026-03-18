# UUID_SHORTHAND

Status: Implemented (src/lib/main.js)

Overview

Shorthand helpers for 128-bit UUIDs that normalise common input formats and provide compact encoded representations using any registered encoding.

Behavior

- encodeUUIDShorthand(uuid: string, encodingName?: string): string
  - Accepts dashed or non-dashed hex UUIDs, uppercase or lowercase, normalises to 32 hex chars, converts to 16 bytes, selects an encoding (defaults to densest registered), and returns encoded string.
- decodeUUIDShorthand(encoded: string, encodingName: string): string
  - Decodes using encodingName, validates 16-byte output, and returns canonical dashed lowercase UUID.

Acceptance criteria (testable)

- Round-trip: decodeUUIDShorthand(encodeUUIDShorthand(uuid, encName), encName) equals canonical lowercase dashed uuid for representative UUIDs (sample, all-zero, all-0xFF, deterministic random UUID).
- Normalisation: encodeUUIDShorthand accepts upper/lower/dashed/non-dashed inputs and normalises them prior to encoding; tests validate equivalence.
- Error handling: invalid UUID input or unknown encodingName throws descriptive errors.

Implementation notes

- Helpers hexToBytes and bytesToUuid centralise validation and canonicalisation; these are present in src/lib/main.js.
