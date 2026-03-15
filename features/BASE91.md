# BASE91

Status: implemented (closed issue #3033)

Overview

Provide a base91 encoding as a built-in encoding to explore higher-density printable encodings beyond base85.

Specification

- Charset: the established base91 character set or an equivalent printable set avoiding control characters and ambiguous glyphs.
- Density: approximately 6.5 bits per character; encoded UUID length should be approximately 19-20 characters depending on implementation details.
- Round-trip: decode(encode(bytes, "base91"), "base91") must equal bytes for all vectors.

Acceptance criteria

- A built-in encoding named base91 is available and documented.
- Unit tests verify round-trip and that encoded UUID length is shorter than base64 for the densest encoding when compared across built-ins.
- listEncodings returns correct metadata for base91.