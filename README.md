# repository0 - Dense Encoding Library

This project explores dense printable encodings for binary data, optimized to produce the shortest printable representation for a UUID.

UUID encoding comparison

| Encoding | Charset length | bitsPerChar | uuidLength | notes |
|---|---:|---:|---:|---|
| base62 | 62 | ~5.9542 | 22 | alphanumerics [0-9a-zA-Z] |
| base85 | 85 | ~6.4094 | 20 | Z85-like printable set |
| base91 | 91 | ~6.5078 | 20 | high-density printable ASCII subset |

Usage example

```js
import { encodeUUID, decodeUUID, listEncodings } from './src/lib/main.js';
const uuid = '01234567-89ab-cdef-0123-456789abcdef';
const enc = 'base85';
const s = encodeUUID(uuid, enc);
console.log(s);
console.log(decodeUUID(s, enc));
console.log(listEncodings());
```

See examples/encode-uuid.js for a reproducible script that encodes a canonical v7 UUID and writes examples/output.json.
