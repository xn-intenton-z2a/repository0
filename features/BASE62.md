# BASE62

Overview

Implement the base62 encoding as a built-in encoding using the character set 0-9 a-z A-Z. This encoding is URL-safe and serves as the baseline dense encoding required by the mission.

Specification

- Charset: 62 characters consisting of digits then lower-case then upper-case letters. No padding characters.
- Density: approximately 5.95 bits per character; a 16-byte UUID should encode to 22 characters.
- Round-trip: decode(encode(bytes, "base62"), "base62") must equal bytes for all vectors.

Acceptance criteria

- The repository exposes a built-in encoding named base62 registered at startup.
- Unit tests assert that encoding a known 16-byte UUID yields a 22-character string and that round-trip equality holds for all edge cases.
- listEncodings includes an entry for base62 with accurate charsetSize and bitsPerChar values.