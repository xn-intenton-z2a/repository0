# ENCODING_LIST

Status: implemented (closed issue #3033)

Overview

Specify the encoding registry and the shape of encoding metadata returned to callers so clients can inspect available alphabets and density measures.

Specification

- listEncodings(): returns an array of objects with shape: name (string), charsetSize (integer), bitsPerChar (number), sampleChars (short representative string).
- Built-in encodings base62, base85, base91 must be present at initialization.
- bitsPerChar is computed as log2(charsetSize) with a numeric value accurate to at least two decimal places.

Acceptance criteria

- listEncodings returns accurate metadata and includes built-ins.
- Unit tests assert the presence and correctness of name, charsetSize and bitsPerChar for each built-in encoding.
- The README comparison table references the values returned by listEncodings for verification.