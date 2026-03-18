ENCODINGS

TABLE OF CONTENTS
- RFC4648 (Base16, Base32, Base64)
- BINARY_TO_TEXT (overview)
- ASCII85 (Ascii85 specification)
- Z85 (ZeroMQ Z85 specification)
- BASE91 (summary)
- BASE_X (npm base-x usage)
- ASCII_PRINTABLES (printable ASCII range)
- UUID7 (source fetch status)
- DIGEST & RETRIEVAL DETAILS
- ATTRIBUTION

---

RFC4648 (Base16, Base32, Base64)

NORMALISED EXTRACT
- Base16 (hex): alphabet = "0123456789ABCDEF". Encoding: for each input byte, output two hex digits: high nibble then low nibble. No padding. Decoding: parse two hex characters per output byte.

- Base32 (RFC 4648 "Standard Base32"): alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567". Bit grouping: operate on 40-bit blocks (5 octets -> 8 output chars). Each output char encodes 5 bits. Padding: '=' used; output length must be multiple of 8 characters. Final block padding rules (input bytes -> output chars + '=' padding):
  * 1 input byte -> 2 output chars + 6 '='
  * 2 bytes -> 4 output chars + 4 '='
  * 3 bytes -> 5 output chars + 3 '='
  * 4 bytes -> 7 output chars + 1 '='
Decoding: map each valid char to 5-bit value and reassemble into octets; ignore/validate padding per application policy.

- Base64 (RFC 4648 standard): alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/". Grouping: read input 3 octets -> 24 bits -> split into four 6-bit values -> map to alphabet. Padding: '=' used to make output length multiple of 4. Final block rules:
  * input length mod 3 == 1 -> output two Base64 chars then '=='
  * mod 3 == 2 -> output three chars then '='
Decoding: map characters to 6-bit values, concatenate and extract 8-bit octets. MIME/legacy variants may insert line breaks (e.g., 76 chars per line) — RFC4648 itself treats line breaks as not part of encoding and interoperable implementations should either reject or ignore whitespace according to context.

- Base64url (URL-safe): alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_". Same grouping rules; padding is optional (some applications omit '='). When decoding, if padding omitted add 0-2 '=' to reach multiple of 4 before standard decode.

SUPPLEMENTARY DETAILS
- Decoders MUST validate input characters are in the chosen alphabet; for strict decoders reject unknown chars. Lenient decoders MAY ignore whitespace or tolerate missing padding (base64url case) if application requires interoperability.
- Implementation notes: operate on byte buffers (unsigned values). For streaming implementations maintain a bit-buffer and flush full output characters as they become available.

REFERENCE DETAILS (exact patterns and signatures)
- Base16 encode(byte[] in) -> string: for i in 0..len-1: append hex[(in[i] >> 4) & 0xF]; append hex[in[i] & 0xF]
- Base32 encode(byte[] in) -> string: emit groups of 5 bytes -> 8 chars; final partial block handling as per padding rules above.
- Base64 encode(byte[] in) -> string: for each 3-byte group form 24-bit big-endian value v = (b0<<16)|(b1<<8)|b2; produce indices: (v>>18)&0x3F, (v>>12)&0x3F, (v>>6)&0x3F, v&0x3F; map to alphabet; apply padding if needed.

DETAILED DIGEST
- Source: https://datatracker.ietf.org/doc/html/rfc4648 (retrieved 2026-03-18) (fetched ~87.5 KB). Extracted exact alphabets, bit-grouping rules, and padding rules for Base16/Base32/Base64 and the base64url variant.

---

BINARY_TO_TEXT (overview)

NORMALISED EXTRACT
- Binary-to-text encodings convert arbitrary byte sequences to printable strings using a defined alphabet and packing scheme.
- Trade-offs: efficiency (bits per output char), safe character set for transport, presence/absence of padding, canonical vs variant alphabets.
- Common encodings: Base16 (hex), Base32, Base64, Base85/Ascii85, Z85 (ZeroMQ), Base91, various custom alphabets (base-x libraries).

SUPPLEMENTARY DETAILS
- Choose encoding by required compactness vs. transport safety: Base64 is compact but includes '+' and '/' which may be problematic in URLs; base64url fixes this. Z85 provides 4-byte -> 5-char packing similar to Ascii85 but with a carefully chosen 85-character set suitable for source code.

REFERENCE DETAILS
- No single API defined here; use the specific encoding sections below for implementation patterns.

DETAILED DIGEST
- Source: https://en.wikipedia.org/wiki/Binary-to-text_encoding (retrieved 2026-03-18) (fetched ~128.0 KB). Extracted overview and list of algorithm families and trade-offs.

---

ASCII85 (Ascii85)

NORMALISED EXTRACT
- Encoding groups 4 input octets into a 32-bit big-endian integer V. Produce 5 output characters by repeatedly dividing by 85 to obtain five base-85 digits (most-significant first). Map digits to ASCII by adding 33: encoded_char = 33 + digit (range: '!' (33) .. 'u' (117)).
- Special-case: the sequence of 4 zero bytes (V == 0) may be compressed to the single character 'z' (depends on variant); decoders that accept 'z' MUST expand it back to four zero octets.
- Final partial block: if fewer than 4 bytes, pad the final block with zero bytes, encode to 5 chars, then truncate encoded output to (n+1) characters where n is number of input leftover bytes (per variant rules) and do NOT emit padding characters; decoder reconstructs original length by tracking expected input length.

SUPPLEMENTARY DETAILS
- Ascii85 implementations must decide whether to support 'z' shorthand and whether to allow whitespace or line-breaks in input. The Adobe BinaryEncode (btoa/ascii85) and RFC/adopted variants differ slightly; consult the variant in use.

REFERENCE DETAILS
- encodeAscii85(bytes) -> string: iterate 4-byte chunks -> V=(b0<<24)|(b1<<16)|(b2<<8)|b3; if V==0 then output 'z' (if variant supports it), else for i=4..0: digit[i]=V%85; V/=85; output chars = chr(33 + digits[4])..chr(33 + digits[0])
- decodeAscii85(str) -> bytes: reverse process; treat 'z' as 4 zero octets when present.

DETAILED DIGEST
- Source: https://en.wikipedia.org/wiki/Ascii85 (retrieved 2026-03-18) (fetched ~110.4 KB). Extracted grouping rule, mapping offset 33, and special-case 'z'.

---

Z85 (ZeroMQ Z85)

NORMALISED EXTRACT
- Z85 encodes 4 octets -> 5 printable ASCII characters using an 85-character alphabet chosen for readability and safety in source code.
- The binary frame length MUST be divisible by 4 and the string frame length MUST be divisible by 5. Applications must pad frames to meet this requirement when necessary.
- Z85 alphabet (index 0..84) in order (85 characters):
  0..9:  0 1 2 3 4 5 6 7 8 9
 10..19: a b c d e f g h i j
 20..29: k l m n o p q r s t
 30..39: u v w x y z A B C D
 40..49: E F G H I J K L M N
 50..59: O P Q R S T U V W X
 60..69: Y Z . - : + = ^ ! /
 70..79: * ? & < > ( ) [ ] {
 80..84: } @ % $ #
- Encoding: read 4 bytes as 32-bit big-endian integer V; for i from 4 downto 0: output alphabet[(V / 85^i) % 85]; decoding does the reverse by accumulating value = value*85 + index and then emitting the 4 octets big-endian.

SUPPLEMENTARY DETAILS
- Z85 is specifically designed to be source-code safe (no quotes, control chars). Implementations must ensure buffer sizes: encoded length = (input_len / 4) * 5; decoded length = (str_len / 5) * 4.

REFERENCE DETAILS
- encodeZ85(bytes) -> string: for each 4 byte block: V = (b0<<24)|(b1<<16)|(b2<<8)|b3; for i=4..0: idx = (V / 85^i) % 85; output ALPHABET[idx]
- decodeZ85(str) -> bytes: for each 5-char group compute V = sum(ALPHABET_INDEX(char_j) * 85^(4-j)); emit (V>>24)&0xFF, (V>>16)&0xFF, (V>>8)&0xFF, V&0xFF

DETAILED DIGEST
- Source: https://rfc.zeromq.org/spec:32/ (retrieved 2026-03-18) (fetched ~103 KB). Extracted full alphabet table and formal encoding/decoding rules.

---

BASE91 (summary)

NORMALISED EXTRACT
- Base91 is a higher-radix binary-to-text encoding using 91 printable ASCII characters to achieve greater compactness than Base64.
- Encoding operates with a bit-buffer method: accumulate input bits into a value (v) and, while v has enough bits (>=13), extract 13 or 14 bits to produce two output characters whose combined value is represented in base91 using the 91-character alphabet. The implementation alternates between taking 13 and 14 bits depending on the value to maximize packing efficiency.

SUPPLEMENTARY DETAILS
- Base91 achieves ~1.189 bytes per output byte efficiency vs Base64's 1.333. Implementation is more complex and requires careful bit-buffering logic and correct alphabet.

REFERENCE DETAILS
- encodeBase91(bytes) -> string: maintain variable b=0, n=0; for each input byte: b |= byte << n; n += 8; while n > 13: v = b & 8191; if v > 88: b >>= 13; n -= 13; else: v = b & 16383; b >>= 14; n -= 14; output two characters: ALPHABET[v % 91], ALPHABET[v / 91] (alphabet and exact bit thresholds per reference implementation)

DETAILED DIGEST
- Source: http://base91.sourceforge.net/ (retrieved 2026-03-18) (fetched ~103.1 KB). Extracted algorithm description and reference implementation notes; for the precise 91-character alphabet consult the source directly (page fetched).

---

BASE_X (npm base-x usage)

NORMALISED EXTRACT
- The npm package base-x constructs arbitrary base encoders/decoders from a provided alphabet string.

REFERENCE DETAILS (API signatures)
- baseX(alphabet: string) -> object with methods:
  * encode(input: Uint8Array | Buffer) -> string
  * decode(input: string) -> Buffer (or Uint8Array)
- Usage pattern (common JavaScript style):
  const baseX = require('base-x')
  const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  const bs58 = baseX(BASE58)
  const encoded = bs58.encode(Buffer.from([0x00,0x01]))
  const decoded = bs58.decode(encoded)

DETAILED DIGEST
- Source: https://www.npmjs.com/package/base-x (registry fetch via npm may be blocked; initial web fetch returned 403). Registry JSON queried during retrieval failed; consult package README for full examples. (npm HTML fetch returned HTTP 403 on attempted crawl 2026-03-18.)

---

ASCII_PRINTABLES (printable ASCII range)

NORMALISED EXTRACT
- Printable ASCII code points are the 95 values from 32 (space) through 126 (tilde ~) inclusive. Sequence: space (32), then punctuation and symbols, digits 0..9 (48..57), punctuation, uppercase A..Z (65..90), punctuation, lowercase a..z (97..122), punctuation through 126.
- Usefulness: pick an alphabet from this set when designing encodings to avoid control characters.

REFERENCE DETAILS
- Code range: [32, 126] inclusive, count = 95 characters.

DETAILED DIGEST
- Source: https://en.wikipedia.org/wiki/ASCII#Printable_characters (retrieved 2026-03-18) (fetched ~428.2 KB). Extracted the exact codepoint range and list of printable characters.

---

UUID7 (source fetch status)

FETCH STATUS
- Attempted fetch: https://github.com/uuid6/uuid7 returned HTTP 404 on 2026-03-18. No authoritative content retrieved from that exact URL.

NOTE
- UUIDv7 is a new time-ordered UUID draft (see IETF drafts and the uuidrevision/uuidv7 draft RFCs). For authoritative bit-layout and epoch semantics, consult the IETF draft for UUIDv7 or the implementing library's README. This library entry records that the provided GitHub URL was not reachable and requires an alternate source.

---

DIGEST & RETRIEVAL DETAILS
- Retrieval date: 2026-03-18 (UTC)
- Sources fetched and sizes (as returned by fetch tool):
  * https://datatracker.ietf.org/doc/html/rfc4648 — fetched ~87.5 KB
  * https://en.wikipedia.org/wiki/Binary-to-text_encoding — fetched ~128.0 KB
  * https://en.wikipedia.org/wiki/Ascii85 — fetched ~110.4 KB
  * https://rfc.zeromq.org/spec:32/ — fetched ~103 KB
  * http://base91.sourceforge.net/ — fetched ~103.1 KB
  * https://www.npmjs.com/package/base-x — HTTP 403 on HTML fetch; registry JSON attempted but blocked by remote; no authoritative README captured
  * https://en.wikipedia.org/wiki/ASCII#Printable_characters — fetched ~428.2 KB
  * https://github.com/uuid6/uuid7 — HTTP 404; not available via provided URL

ATTRIBUTION
- RFC4648: The Base16, Base32, and Base64 Data Encodings — IETF, RFC 4648
- Ascii85: Wikipedia (Ascii85 article) and historical Adobe/ACM references
- Z85: ZeroMQ RFC 32 (Z85) — Pieter Hintjens / iMatix
- Base91: Joachim Henke (base91 reference impl) at sourceforge
- base-x: npm package base-x (author and README available from package registry) — attempted fetch blocked by HTTP 403
- ASCII printable characters: Wikipedia
- UUID7: referenced GitHub URL not reachable; consult IETF UUID revision drafts for canonical spec

USAGE NOTES & BEST PRACTICES (actionable)
1. Prefer RFC4648 Base64 or Base64url for general interoperability; prefer base64url when embedding in URLs or filenames. Always agree on padding policy between encoder and decoder.
2. Use Z85 when you need compact, source-code-safe 4->5 packing with a defined 85-character alphabet. Ensure inputs are padded to 4-byte multiples prior to encoding.
3. Use Ascii85 only when interacting with systems that specifically require it; be mindful of the 'z' shortcut and variant differences.
4. Use base-x to construct custom encoders (e.g., Base58) by supplying a validated alphabet string; prefer well-known alphabets for interoperability.
5. When implementing decoders, be explicit about error handling: illegal character -> error; incorrect padding -> error or strict/lenient mode controlled by caller.

END OF DOCUMENT
