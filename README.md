# repository0

A JavaScript library that explores dense binary-to-text encodings.

## UUID encoding comparison

For a sample UUID (00112233-4455-6677-8899-aabbccddeeff) the encoded lengths are:

- hex (32 chars)
- base64 (no padding): 22 chars
- base62: ~22 chars
- base85: ~20 chars
- dense94 (custom printable set): ~20 chars (densest in builtins)

Usage examples (library):

import { encode, decode, encodeUUID, listEncodings } from './src/lib/main.js';

const bytes = new Uint8Array([0x00,0x11,0x22]);
const s = encode(bytes, 'base62');
const back = decode(s, 'base62');

const short = encodeUUID('00112233-4455-6677-8899-aabbccddeeff', 'dense94');

See tests for more examples.
