ENCODINGS

TABLE OF CONTENTS
- RFC4648 (Base16, Base32, Base64)
- BINARY_TO_TEXT (overview)
- ASCII85 (Ascii85 specification)
- Z85 (ZeroMQ Z85 specification)
- BASE91 (summary)
- BASE_X (npm base-x usage)
- ASCII_PRINTABLES (printable ASCII range)
- UUID7 (fetch status and guidance)
- DIGEST & RETRIEVAL DETAILS
- ATTRIBUTION
- USAGE NOTES & BEST PRACTICES
- TROUBLESHOOTING

---

RFC4648 (Base16, Base32, Base64)

NORMALISED EXTRACT
Base16 (hex)
- Alphabet: 0123456789ABCDEF (canonical uppercase; implementations may accept lowercase when decoding).
- Encoding: For each input byte b, emit two characters: hex[(b >> 4) & 0xF] then hex[b & 0xF]. No padding is used.
- Decoding: Parse two hex characters per output byte; reject non-hex characters in strict mode.

Base32 (RFC 4648 "Standard Base32")
- Alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZ234567
- Bit grouping: operate on 40-bit blocks (5 octets -> 8 output characters). Each output character encodes 5 bits.
- Padding: '=' used to make output length a multiple of 8 characters. Final-block rules (input bytes -> output chars + '='):
  * 1 input byte -> 2 output chars + 6 '='
  * 2 bytes -> 4 output chars + 4 '='
  * 3 bytes -> 5 output chars + 3 '='
  * 4 bytes -> 7 output chars + 1 '='
- Decoding: Map each valid char to a 5-bit value, accumulate bit-buffer and extract octets. On input with padding, validate padding length matches the trailing partial block size.

Base64 (RFC 4648)
- Alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
- Grouping: Read input three octets -> 24 bits -> split into four 6-bit values -> map to alphabet.
- Padding: '=' used to make output length a multiple of 4. Final-block rules:
  * input length mod 3 == 1 -> output two Base64 chars then '=='
  * input length mod 3 == 2 -> output three chars then '='
- Base64url (URL-safe): Alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_ . Padding is optional in some applications; when decoding, add 0-2 '=' characters to reach a multiple of 4 if padding omitted.
- Decoding: Map chars to 6-bit values, concatenate and extract 8-bit octets. Strict decoders reject invalid chars and incorrect padding; lenient decoders may ignore whitespace and tolerate missing padding per configuration.

SUPPLEMENTARY DETAILS
- Streaming implementation pattern (all variants): maintain a small bit-buffer (integer) and bit count; append input bytes, and while the buffer contains enough bits to emit an output symbol, extract the highest-order bits required and map to alphabet; on final flush, emit remaining symbols and apply padding policy.
- Error handling modes: strict (reject unknown characters, incorrect padding) and permissive (ignore whitespace, accept missing padding on base64url); expose a configuration option to choose behavior.

REFERENCE DETAILS
Standard API patterns (language-agnostic)
- Base16.encode(input: byte[]) -> string: for each byte b append HEX[(b>>4)&0xF] then HEX[b&0xF]
- Base16.decode(input: string) -> byte[]: validate length even; for i in 0..len/2-1 combine two hex digits into one byte

- Base32.encode(input: byte[]) -> string: process 5-byte blocks -> 8 chars; for partial blocks follow padding rules above
- Base32.decode(input: string, options?: {strict?: boolean}) -> byte[]: map alphabet characters to 5-bit values, accumulate and extract bytes; validate padding if strict

- Base64.encode(input: byte[]) -> string: for each 3-byte group v=(b0<<16)|(b1<<8)|b2 produce indices: (v>>18)&0x3F, (v>>12)&0x3F, (v>>6)&0x3F, v&0x3F; map to alphabet and apply padding
- Base64.decode(input: string, options?: {urlSafe?: boolean, strict?: boolean}) -> byte[]: normalize base64url to standard alphabet if urlSafe, add padding if missing when permissive, map chars to 6-bit values, reconstruct bytes

DETAILED DIGEST
- Source: RFC 4648 — The Base16, Base32, and Base64 Data Encodings (IETF). Retrieved 2026-03-18. Fetched ~87.5 KB. Extracted alphabets, bit-grouping rules, and padding semantics for Base16, Base32, Base64 and base64url.

---

BINARY_TO_TEXT (overview)

NORMALISED EXTRACT
- Binary-to-text encodings convert arbitrary byte sequences into printable strings using a defined alphabet and packing scheme. Core trade-offs: density (bits per output character), allowable character set for transport/embedding, presence and semantics of padding, and canonical vs variant alphabets.
- Typical choices: Base16 (safe, inefficient), Base32 (safer subset of printable chars, moderate efficiency), Base64 (compact, uses +/ which may be problematic in URLs), Base64url (URL-safe variant), Base85/Ascii85, Z85 (source-code safe 4->5 packing), Base91 (higher packing efficiency, more complex logic), and custom alphabets via base-x libraries.

SUPPLEMENTARY DETAILS
- Choose encoding by compactness vs transport safety. Z85 is ideal for 4-byte-aligned binary frames passed in source code. Base64url is recommended for embedding in URLs and filenames when interoperability with HTTP APIs is required.

DETAILED DIGEST
- Source: Wikipedia — Binary-to-text encoding. Retrieved 2026-03-18. Fetched ~128.0 KB. Extracted classification and trade-offs.

---

ASCII85 (Ascii85)

NORMALISED EXTRACT
- Block size: 4 input octets -> 32-bit unsigned integer V (big-endian). Produce 5 output characters by dividing V by successive powers of 85 to obtain five base-85 digits, then add 33 to each digit to map into ASCII printable range: encoded_char = 33 + digit (range '!' (33) through 'u' (117)).
- Special-case: the 4-byte zero sequence (V == 0) may be compressed to the single character 'z' in variants that support it; decoders that accept 'z' must expand it to four zero bytes.
- Final partial block handling: pad the remaining bytes with zero bytes, encode to 5 chars, then truncate the encoded output to (n+1) characters where n is the number of input leftover bytes; decoder must be told original length to remove padding bytes.

REFERENCE DETAILS
- encodeAscii85(input: byte[]) -> string: for each 4-byte chunk form V=(b0<<24)|(b1<<16)|(b2<<8)|b3; if V==0 and z-support enabled output 'z'; otherwise compute digits by successive division by 85 and output chars chr(33 + digits[0..4]) in big-endian order; handle final partial block as described.
- decodeAscii85(input: string) -> byte[]: reverse the process; accept 'z' shorthand if configured; for final partial group pad digits and then truncate to expected original byte count.

DETAILED DIGEST
- Source: Wikipedia — Ascii85 article. Retrieved 2026-03-18. Fetched ~110.4 KB. Extracted the grouping rules, offset 33 mapping, and 'z' shorthand behavior.

---

Z85 (ZeroMQ Z85)

NORMALISED EXTRACT
- Z85 is a 4-octet to 5-character encoding using a curated 85-character alphabet chosen for readability and safety in source code and command-line contexts.
- Requirement: binary frame length MUST be divisible by 4; encoded string length MUST be divisible by 5. Applications must pad frames to meet this requirement when necessary.
- Z85 alphabet (index 0..84) in order (85 characters):
  0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#
- Encoding: treat 4 bytes as a 32-bit big-endian integer V; for i from 4 down to 0 compute idx = (V / 85^i) % 85 and output ALPHABET[idx]. Decoding: for each 5-char group compute V = sum(ALPHABET_INDEX(char_j) * 85^(4-j)) and emit four octets big-endian: (V>>24)&0xFF, (V>>16)&0xFF, (V>>8)&0xFF, V&0xFF.

REFERENCE DETAILS
- encodeZ85(input: byte[]) -> string: require input length % 4 == 0; for each 4-byte block compute V and output 5 chars per above mapping. Result length = (input_len / 4) * 5.
- decodeZ85(input: string) -> byte[]: require input length % 5 == 0; for each 5-char block compute V and emit 4 bytes.

DETAILED DIGEST
- Source: ZeroMQ RFC 32 (Z85). Retrieved 2026-03-18. Fetched ~103 KB. Extracted formal specification and the exact alphabet table.

---

BASE91 (summary)

NORMALISED EXTRACT
- Base91 provides higher packing efficiency than Base64 by using an alphabet of 91 printable characters and a bit-buffer approach that alternates between extracting 13 and 14 bits to form two output characters from the accumulated bits.
- Core encoding loop uses variables b (bit buffer) and n (number of bits in buffer). Input bytes are appended to b << n; while n has more than 13 bits, extract v = b & 8191; if v > 88 then consume 13 bits else extract 14 bits with v = b & 16383; then output two characters computed from v divided by 91 and modulus 91 using the base91 alphabet.

SUPPLEMENTARY DETAILS
- Base91 achieves ~1.189 bytes per output byte efficiency vs Base64's 1.333. Implementation requires careful bit-buffering logic; error-prone parts are the 13/14-bit decision threshold and handling final leftover bits.

REFERENCE DETAILS
- encodeBase91(input: byte[]) -> string: maintain integer b=0, n=0; for each input byte append to buffer and run extraction loop as above; map v to two characters: ALPHABET[v % 91] and ALPHABET[v / 91]; on final flush if n>0 emit remaining output according to algorithm.
- decodeBase91(input: string) -> byte[]: reverse process, accumulate value from pairs of input characters and extract bytes while managing bit counts.

DETAILED DIGEST
- Source: base91 reference at base91.sourceforge.net. Retrieved 2026-03-18. Fetched ~103.1 KB. Consult source for the exact 91-character alphabet and reference C implementation.

---

BASE_X (npm base-x usage)

NORMALISED EXTRACT
- The npm package base-x constructs custom base encoders/decoders from a provided alphabet string. It is a factory that returns encode/decode functions tailored to the alphabet.

REFERENCE DETAILS (API signatures)
- baseX(alphabet: string) -> { encode(input: Uint8Array | Buffer) -> string, decode(input: string) -> Buffer }
- Typical JS usage: const baseX = require('base-x'); const bs58 = baseX(BASE58_ALPHABET); encoded = bs58.encode(Buffer.from([...])); decoded = bs58.decode(encoded);

NOTES
- During crawling the npm HTML page returned HTTP 403 on direct HTML fetch; for authoritative README consult the npm registry or package repository via npm or a registry client.

---

ASCII_PRINTABLES (printable ASCII range)

NORMALISED EXTRACT
- Printable ASCII code points: decimal 32 (space) through 126 (tilde) inclusive. Count = 95 characters. Use this range when selecting alphabets to avoid control characters.

REFERENCE DETAILS
- Code range: [32, 126] inclusive.

DETAILED DIGEST
- Source: Wikipedia — ASCII printable characters. Retrieved 2026-03-18. Fetched ~428.2 KB.

---

UUID7 (source fetch status)

FETCH STATUS
- Attempted fetch: https://github.com/uuid6/uuid7 returned HTTP 404 on 2026-03-18. No authoritative content retrieved from the provided URL.

GUIDANCE
- UUIDv7 is a time-ordered UUID proposal; for canonical layout and epoch semantics consult IETF drafts or authoritative library READMEs referenced from the IETF draft (search for uuidv7, uuid6, or IETF uuid revision work).

---

DIGEST & RETRIEVAL DETAILS
- Retrieval date (all sources): 2026-03-18 UTC
- Sources fetched and sizes (approx):
  * RFC 4648 — The Base16, Base32, and Base64 Data Encodings — ~87.5 KB
  * Wikipedia — Binary-to-text encoding — ~128.0 KB
  * Wikipedia — Ascii85 — ~110.4 KB
  * ZeroMQ RFC 32 — Z85 — ~103 KB
  * base91.sourceforge.net — ~103.1 KB
  * npm package base-x — HTTP 403 on HTML fetch (registry access blocked)
  * Wikipedia — ASCII printable characters — ~428.2 KB
  * GitHub uuid6/uuid7 — HTTP 404 (not available at provided URL)

ATTRIBUTION
- RFC 4648 — IETF (RFC 4648)
- Binary-to-text encoding, Ascii85, ASCII printable characters — Wikipedia articles
- Z85 — ZeroMQ RFC 32 (Pieter Hintjens / iMatix)
- Base91 — Joachim Henke (reference impl at SourceForge)
- base-x — npm package base-x (registry / package README)

USAGE NOTES & BEST PRACTICES
1. Prefer RFC4648 Base64 or Base64url for general interoperability; prefer base64url when embedding in URLs or filenames. Agree with communicating parties on padding policy.
2. Use Z85 when you need compact, source-code-safe 4->5 packing and can ensure input length is padded to a 4-byte multiple.
3. Use Ascii85 only when interacting with systems that require it; be explicit about whether 'z' shorthand is supported.
4. Use base-x to construct custom encoders (e.g., Base58) by supplying a validated alphabet string; prefer well-known alphabets for interoperability.
5. Implement decoders with selectable strict or permissive modes: strict rejects illegal characters and incorrect padding; permissive tolerates whitespace and, for base64url, missing padding.
6. When writing streaming encoders/decoders, test with incremental inputs that exercise partial blocks and ensure buffer flush semantics are correct.

TROUBLESHOOTING
- Unexpected characters during decode: verify alphabet and character-set mapping; in strict mode return error with position information.
- Incorrect output length: check padding policy and whether the encoder omitted or included '=' characters; for Z85 confirm input length was padded to 4 bytes.
- Interop failures with URLs: use Base64url or percent-encode standard Base64 when necessary.
- base-x or npm registry failures: use npm registry client (npm view base-x) or the package repository mirror if direct HTML fetch fails due to cloud protections.

END OF DOCUMENT
