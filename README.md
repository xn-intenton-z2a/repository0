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

Using the sample UUID `00112233-4455-6677-8899-aabbccddeeff` (16 bytes), the table below shows measured encoded outputs and lengths for common encodings registered in this library (computed deterministically by the library's encode function):

| Encoding | Encoded output (example) | Length |
|---------:|:-------------------------|------:|
| hex      | <code>00112233445566778899aabbccddeeff</code> | 32 |
| base64 (no padding) | <code>ABEiM0RVZneImaq7zN3u/w</code> | 22 |
| base62   | <code>07PsO2B9tnG1CEDAVcE7Z</code> | 21 |
| base85   | <code>01T@sA}t!Ia9#$GK=@o0</code> | 20 |
| base91   | <code>!M3xBlD/v'3M^\P(My{</code> | 19 |
| ascii-printable-no-ambiguous | <code>!eQfthbMcw!TGv(`fTd</code> | 19 |

The densest registered encodings (base91 and the high-density ASCII variant) produce 19 characters for this 16-byte UUID, which is fewer than base64's 22 characters.

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

## Charset sanitisation

When defining custom encodings with `defineEncoding(name, charset)` the library validates the supplied charset:

- Control characters (U+0000..U+001F, U+007F) and any whitespace are rejected and cause defineEncoding to throw.
- Visually ambiguous characters are removed from the charset before registration: `0`, `O`, `1`, `l`, `I` are stripped.
- If the charset becomes invalid after sanitisation (fewer than 2 unique characters) an error is thrown.

This ensures encodings use only safe, printable, and unambiguous characters by default.

## License

MIT
