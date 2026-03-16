# BASE85

Status: implemented (closed issue #3033) — retained as record; acceptance criteria preserved.

Overview

Provide a base85 encoding (Z85 compatible) as a built-in encoding to increase density above base62.

Specification

- Charset: Z85 (ZeroMQ RFC 32). Exact ordered string (85 characters):
  0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#
- Notes: Z85 encodes 4 bytes -> 5 characters and defines no padding; binary input length must be divisible by 4. A 16-byte UUID is a 4*4 byte frame and requires no padding.
- Density: approximately 6.41 bits per character; a 16-byte UUID should encode to 20 characters using Z85.
- Round-trip: decode(encode(bytes, "base85"), "base85") must equal bytes for all test vectors.

Acceptance criteria

- A built-in encoding named base85 (Z85) is available and documented in the registry.
- Unit tests verify round-trip behavior on required vectors (empty, single-byte, all-zero, all-0xFF, random buffers) and specifically assert that encoding the canonical 16-byte UUID yields a 20-character string.
- listEncodings returns correct metadata for base85 including charsetSize = 85 and bitsPerChar accurate to at least two decimal places.
- Implementations validate frame sizes and throw descriptive errors for non-multiple-of-4 input lengths.

References

- See library/Z85.md for the canonical alphabet, algorithm, and test vectors used to validate implementations.
