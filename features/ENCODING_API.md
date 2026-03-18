# ENCODING_API

Overview

Define the public API surface exported as named exports from src/lib/main.js. The API is intentionally small and focused on pure encoding/decoding operations and runtime registration/listing of encodings.

Public functions and signatures

- encode(data: Uint8Array, encodingName: string): string
  - Encodes arbitrary binary data to a printable string using the named encoding.
- decode(text: string, encodingName: string): Uint8Array
  - Decodes an encoded string back to the original bytes; must throw on invalid input.
- defineEncoding(name: string, charset: string, options?: {allowAmbiguous?: boolean}): EncodingMetadata
  - Registers a new encoding and returns metadata {name, charsetSize, bitsPerChar}.
- listEncodings(): EncodingMetadata[]
  - Returns metadata for all available encodings sorted by bitsPerChar descending.
- encodeUUIDShorthand(uuid: string, encodingName?: string): string
- decodeUUIDShorthand(encoded: string, encodingName?: string): string

Behavioral requirements

- All functions must validate input types and throw TypeError or RangeError with descriptive messages on incorrect input.
- All functions must be pure (no I/O), deterministic, and synchronous.
- Named exports must exist exactly as documented so tests can import them from src/lib/main.js.

Acceptance criteria

- src/lib/main.js exports the exact named functions above.
- Unit tests import the named exports and assert correct behavior and error handling.
- API documentation examples appear in README and examples/ demonstrating minimal usage.

Implementation notes

- Keep implementation small and well-covered by tests; avoid hidden global state beyond the encoding registry which is exposed via listEncodings().
