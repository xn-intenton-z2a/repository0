# HIGH_DENSITY

Overview

Allow creating custom, higher-density encodings from a provided charset string. Support character-sets drawn from printable ASCII U+0021..U+007E (excluding space) and by default disallow visually ambiguous characters (0/O, 1/l/I). Provide utilities to calculate bits-per-character and to register the encoding under a name for later use.

Requirements

- defineEncoding(name: string, charset: string) registers a new encoding and returns metadata (name, charsetSize, bitsPerChar).
- Validation rules:
  - Charset must contain only printable ASCII characters in range U+0021..U+007E except space.
  - Charset must not include duplicate characters.
  - By default ambiguous characters 0, O, 1, l, I are rejected; allow an explicit allowAmbiguous option for test scenarios.
- Bits-per-character calculation: report bitsPerChar = log2(charsetSize) to two decimal places.
- Encodings created via defineEncoding must be usable by encode/decode and must appear in listEncodings().

Acceptance criteria

- defineEncoding registers an encoding that passes round-trip encode/decode tests for a representative set of inputs including the UUID bytes.
- Charset validation is enforced; supplying invalid characters or duplicates causes a thrown error which tests assert.
- A maximal printable charset (all allowed printable ASCII minus space and optional ambiguous characters) produces an encoding whose UUID output length is strictly less than base64 (22 characters) when used as the densest encoding.
- listEncodings includes the new encoding with accurate metadata.

Implementation notes

- Normalize and de-duplicate the charset at registration; throw if normalization changes length.
- Store metadata with: name, charsetSize, bitsPerChar (number), safeCharsetSample (first 16 chars) and creation timestamp.
