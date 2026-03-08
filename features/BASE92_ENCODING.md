# BASE92_ENCODING

# Overview

Introduce a high-density printable encoding named base92 that targets greater bits-per-character than base85/base91 while staying within safe printable ASCII characters.
This feature defines the charset, encoding algorithm constraints, API behaviour for the built-in encoding, and tests for UUID length comparison.

# Motivation

Pushing density reduces the length of encoded v7 UUIDs. A carefully chosen 92-character printable subset delivers denser packing while avoiding control and ambiguous glyphs.

# Specification

Charset:

- Select 92 printable ASCII characters excluding space and common ambiguous glyphs.
- Charset must be ordered and deterministic. The feature specifies the recommended alphabet but leaves final alphabet choice to implementation tests.

Encoding behaviour:

- Provide a built-in registration under the name base92 during library initialization using createEncoding.
- Compute bits-per-character as log2(charset.length) and expose as bitsPerChar in listEncodings.
- encodeUUID(uuid) when using base92 must produce a string shorter than base64's 24 characters for the same UUID (target: 22 or fewer chars if achievable).

Edge-cases:

- The algorithm must support arbitrary binary input (not only multiples of power-of-two bit lengths). Padding or variable-length final group must be reversible.

# Tests

Unit tests in tests/unit/base92.test.js must include:

- Round-trip for random buffers and the 16-byte UUID buffer.
- Comparison of lengths: base62, base85, base91 and base92 encoding lengths for the same UUID; assert base92 is shortest (or strictly shorter than base64's 24 chars).
- Charset validation (no duplicates, all printable, length = 92).

# Acceptance criteria

- base92 added as a built-in encoding and registered at library start.
- listEncodings includes base92 with correct charset length and computed bitsPerChar.
- Round-trip tests pass for base92 for the same buffers as core tests.
- Encoded UUID length for base92 is less than 24 characters (base64 length) and is the shortest among built-ins in the comparison tests.
