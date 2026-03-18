# HIGH_DENSITY

Status: Done

Overview

Provide a high-density printable ASCII encoding that omits visually ambiguous characters. This encoding is registered as ascii-printable-no-ambiguous and is available for benchmarking and demos.

Acceptance criteria

1. defineEncoding rejects or sanitises input charsets containing control characters (U+0000–U+001F, U+007F), whitespace, or ambiguous characters '0','O','1','l','I'.
2. listEncodings() includes ascii-printable-no-ambiguous with a computed charsetSize and bitsPerChar consistent with the registered charset.
3. Round-trip tests for this encoding pass for edge-case inputs.
