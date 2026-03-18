# ENCODING_API

Status: Implemented (src/lib/main.js)

Overview

The public API surface is exported as named exports from src/lib/main.js. The API is intentionally small and focused on pure encoding/decoding operations and runtime registration/listing of encodings.

Public functions and signatures (exported)

- encode(encodingName: string, data: Uint8Array): string
- decode(encodingName: string, text: string): Uint8Array
- defineEncoding(name: string, charset: string, options?: object): EncodingMetadata
- listEncodings(): EncodingMetadata[]
- encodeUUIDShorthand(uuid: string, encodingName?: string): string
- decodeUUIDShorthand(encoded: string, encodingName: string): string

Behavioral requirements (enforced)

- All functions validate input types and throw TypeError or RangeError with descriptive messages on incorrect input.
- Functions are pure, synchronous and deterministic with no I/O side effects.
- The encoding registry is exposed via listEncodings() which returns metadata sorted by densest first.

Acceptance criteria (testable)

- src/lib/main.js exports the named functions above; unit tests import these names directly and verify behavior (see tests/unit/main.test.js and tests/unit/encoding.test.js).
- Error conditions are tested: invalid charset, duplicate registration, unknown encoding name, invalid UUID formats.
- Round-trip encode/decode correctness is asserted by unit tests covering edge cases.

Implementation notes

- Keep the registry small and observable; avoid hidden global state beyond the registry accessible via listEncodings().
