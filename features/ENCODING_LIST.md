# ENCODING_LIST

Summary

Provide a deterministic listing mechanism that returns encoding metadata suitable for UIs and automated comparison. The list must include all registered encodings (built-ins and user-created) and compute derived metrics used by tests and documentation.

Metadata fields

Each encoding metadata entry must include the following fields:

- name: canonical encoding name
- charsetSize: integer number of characters in the alphabet
- bitsPerChar: computed as log2(charsetSize) to at least 4 decimal places
- urlSafe: boolean indicating whether the alphabet is safe for URLs without quoting
- exampleLengthFor16Bytes: integer computed as ceil(128 / bitsPerChar)

APIs

- listEncodings(): returns an array of metadata objects.
- getEncoding(name): returns the encoding object and metadata for the named encoding or null if unknown.

# ACCEPTANCE CRITERIA

- listEncodings returns entries for all built-in encodings and any created encodings with correct computed fields.
- exampleLengthFor16Bytes is accurate and used by tests that verify UUID output lengths.
- Unit tests assert that the returned bitsPerChar and exampleLengthFor16Bytes match expected values for base62, Z85, and printable94.
