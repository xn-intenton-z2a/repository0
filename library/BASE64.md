TITLE: BASE64

Table of Contents
- Normalised extract: RFC4648 base64 rules and variants
- Technical details: bit grouping, padding, URL-safe variant mapping
- Supplementary details: length formula, streaming encoding notes
- Reference details: exact encoding algorithm for Uint8Array (encode/decode signatures)
- Digest: source URLs and retrieval metadata
- Attribution

Normalised extract
RFC 4648 Base64 represents binary data using a 64-character alphabet. Standard alphabet: A-Z a-z 0-9 + / . URL-safe variant replaces + with - and / with _ and may omit padding "=". Encoding groups 3 bytes (24 bits) into 4 sextets (6 bits each). Padding: if final quantum has 1 byte -> produce two base64 chars plus two '='; if 2 bytes -> produce three base64 chars plus one '='. Base64 (no padding) is widely used as a compact printable representation; for 16-byte payload (UUID) base64 output length without padding is ceil(128/6)=22 characters.

Technical details
- Bits per character: 6
- Alphabet (standard): "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
- Alphabet (URL-safe): "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
- Length formula: outputChars = ceil((inputBytes * 8) / 6)
- Padding behavior (RFC4648): final quantum padded with '=' characters to produce output length multiple of 4 unless using the "no padding" variant.

Exact encode algorithm (Uint8Array -> string)
- Input: Uint8Array bytes
- Process: iterate over bytes, accumulating into a 24-bit buffer: buffer = (buffer << 8) | nextByte; bitsInBuffer += 8
- While bitsInBuffer >= 6: bitsInBuffer -= 6; index = (buffer >> bitsInBuffer) & 0x3F; append alphabet[index]
- After consuming input, if bitsInBuffer > 0: pad the remaining bits by shifting left (6 - bitsInBuffer) and output one more alphabet char
- If standard-padded output required: append '=' up to make length % 4 == 0
- URL-safe variant: after forming output, replace '+'->'-', '/'->'_', and optionally strip '=' padding

Exact decode algorithm (string -> Uint8Array)
- Input: base64 string (optionally with URL-safe chars and without padding)
- Normalize: replace '-'->'+', '_'->'/' if URL-safe; add '=' padding to reach length multiple of 4 if needed for a padded decoder
- For each character: val = alphabetIndex(char) (0..63); accumulate buffer = (buffer << 6) | val; bitsInBuffer += 6; while bitsInBuffer >= 8: bitsInBuffer -=8; outputByte = (buffer >> bitsInBuffer) & 0xFF; append to output
- Stop when padding encountered or all chars processed

Supplementary details
- Streaming: keep buffer and bits count across chunks; output bytes when bitsInBuffer >= 8
- Performance: table-driven lookup for alphabet index speeds decode
- Security: validate allowed characters before decode; reject non-alphabet characters unless explicitly allowed by config

Reference details (method signatures)
- encode(bytes: Uint8Array, urlSafe?: boolean, pad?: boolean) => string
- decode(text: string) => Uint8Array
- Behavior: encode(..., urlSafe=true, pad=false) produces compact UUID-length outputs (22 chars for 16 bytes)

Digest
- Sources fetched: https://en.wikipedia.org/wiki/Base64 (retrieved 2026-03-19) — ~182 KB HTML

Attribution
- Source: Wikipedia "Base64" (RFC4648 summary). Retrieved 2026-03-19. Data size fetched: ~182 KB.