# BASE85

Overview

Provide a base85 encoding (Ascii85 or Z85 compatible) as a built-in encoding to increase density above base62.

Specification

- Charset: a recognized base85 charset chosen for printable compatibility and safety. Implementation must avoid control characters.
- Density: approximately 6.41 bits per character; target encoded UUID length is about 20 characters.
- Round-trip: decode(encode(bytes, "base85"), "base85") must equal bytes for all vectors.

Acceptance criteria

- A built-in encoding named base85 is available and documented.
- Unit tests verify round-trip behavior and that the encoded length for a canonical 16-byte UUID matches the expected 20-character target.
- listEncodings returns correct metadata for base85.