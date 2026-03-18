# HIGH_DENSITY

Status: Done (builtin: ascii-printable-no-ambiguous)

Overview

Support for registering high-density encodings from a provided charset string. The repository ships a built-in high-density printable-ASCII encoding named ascii-printable-no-ambiguous which excludes visually ambiguous characters.

Requirements

- defineEncoding(name: string, charset: string) registers an encoding and returns metadata {name, charsetSize, bitsPerChar}.
- Registration validates unique characters and minimum size (>=2).
- The builtin ascii-printable-no-ambiguous is derived from codepoints 33..126 excluding ambiguous characters 0/O and 1/l/I, yielding charsetSize = 89 (implementation detail) and bitsPerChar ≈ Math.log2(89) ~ 6.48.

Acceptance criteria (testable)

- defineEncoding successfully registers a new encoding and the new encoding passes round-trip tests for the same vectors as built-ins (empty, single-byte, 16-byte zero/FF, and deterministic random vectors).
- defineEncoding throws on duplicate characters or charset length < 2 (unit tests assert thrown RangeError/TypeError).
- listEncodings includes ascii-printable-no-ambiguous and reports accurate charsetSize and bitsPerChar (tests compare bitsPerChar to Math.log2(charsetSize) within 0.01).
- Using ascii-printable-no-ambiguous as the densest encoding produces encoded UUID lengths strictly less than base64 (22 characters) for representative UUIDs (see tests/unit/encoding.test.js).

Implementation notes

- The library normalises and rejects duplicate characters at registration time.
- For higher density custom alphabets prefer explicit defineEncoding calls so tests can control and verify properties.
