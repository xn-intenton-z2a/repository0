# repo

This repository demonstrates dense binary-to-text encodings and a demo website.

## UUID encoding comparison

The densest encodings provide shorter representations for a v7 UUID (16 bytes):

| Encoding | Bits/char | Charset size | Encoded length (chars for 16 bytes) |
|---|---:|---:|---:|
| base62 | ~5.95 | 62 | 22 |
| base85 | ~6.41 | 85 | 20 |
| dense94 | ~6.55 | 94 | 20 (typically &lt; 22) |

See the website at src/web/index.html for a live comparison and an encodeUUID shortcut demonstration.
