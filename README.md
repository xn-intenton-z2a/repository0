# repo

This repository explores dense binary-to-text encodings for printable characters and benchmarks them against UUID encodings.

## Overview

The library exposes a small API (named exports) from `src/lib/main.js`:

- encode(encodingName, data: Uint8Array) -> string
- decode(encodingName, text: string) -> Uint8Array
- defineEncoding(name, charset) -> metadata
- listEncodings() -> [{ name, charset, charsetSize, bitsPerChar }]
- encodeUUIDShorthand(uuid, encodingName?) -> string
- decodeUUIDShorthand(encoded, encodingName) -> uuid string

The website at `src/web/index.html` re-exports the library and shows a live demo.

## UUID encoding comparison

Using the sample UUID `00112233-4455-6677-8899-aabbccddeeff` (16 bytes), the table below shows common encodings and typical encoded lengths:

| Encoding | Example (short) | Length |
|---------:|----------------:|------:|
| hex      | 00112233445566778899aabbccddeeff | 32 |
| base64 (no padding) | ABEhM0RFR0hJkqrvzN3v7w | 22 |
| base62   | (base62 output) | 22 |
| base85   | (base85 output) | 20 |
| high-density (printable ASCII, ambiguous chars removed) | (dense output) | 20 |

The densest printable encodings routinely produce 20 characters for a 16-byte UUID (less than base64's 22), demonstrating the value of carefully chosen large charsets.

## Example usage

```js
import { encode, decode, listEncodings } from './src/lib/main.js';

const encs = listEncodings();
console.log(encs.map(e => `${e.name}: ${e.charsetSize} chars, ${e.bitsPerChar.toFixed(3)} bits/char`));

const data = new Uint8Array([1,2,3,4]);
const s = encode('base62', data);
const back = decode('base62', s);
console.log(s, back);
```

## License

MIT
