# ENCODING_API

Status: Done

Overview

Public API exported as named exports from src/lib/main.js: encode, decode, defineEncoding, listEncodings, encodeUUIDShorthand, decodeUUIDShorthand. Inputs and outputs use Uint8Array for binary data and strings for encoded text.

Acceptance criteria

1. src/lib/main.js exports the named functions above as named exports.
2. encode(name, Uint8Array) -> string and decode(name, string) -> Uint8Array; round-trip property holds across encodings for arbitrary inputs.
3. defineEncoding(charsetString) validates the charset (no control characters, no whitespace, excludes ambiguous characters '0','O','1','l','I') and registers a new encoding visible via listEncodings().
4. Unit tests assert exported symbols exist and behave as specified.

Notes

Include concise JSDoc on public exports to aid downstream TypeScript declaration generation.
