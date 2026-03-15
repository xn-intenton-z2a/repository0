# repo

This repository implements a small library that explores dense binary-to-text encodings for printable characters.

## UUID encoding comparison (example)

| Encoding | bits/char (approx) | UUID length (16 bytes) |
|---|---:|---:|
| hex | 4.00 | 32 |
| base64 (no padding) | 6.00 | 22 |
| base62 | 5.95 | 22 |
| base85 | 6.41 | 20 |
| base91 | 6.50 | 20 |
| densest | ~6.48 | 20 |

## Usage

import { encode, decode, listEncodings, encodeUUID, decodeUUID } from './src/lib/main.js';

// encode arbitrary bytes
const bytes = new Uint8Array([0,1,2,3,255]);
const s = encode(bytes, 'base62');
const out = decode(s, 'base62'); // Uint8Array

// encode a UUID string
const uuid = '00112233-4455-6677-8899-aabbccddeeff';
const encoded = encodeUUID(uuid, 'densest');
const decoded = decodeUUID(encoded, 'densest');

// create a custom encoding (characters must be printable U+0021..U+007E and not ambiguous)
// const custom = createEncoding('ABCDEFGH...');

See src/web/index.html for a live demo that computes lengths for a sample UUID.
