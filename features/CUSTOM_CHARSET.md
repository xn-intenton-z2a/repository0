# CUSTOM_CHARSET

Status: implemented (closed issue #3033) — retained as record; acceptance criteria preserved.

Overview

Allow consumers to create custom encodings from a supplied charset string so experiments with denser alphabets are possible while enforcing safety constraints.

Specification

- defineEncoding(name, charsetString) registers a new encoding where each character in charsetString is a distinct output symbol.
- Validation: charsetString must be at least 2 characters, contain only printable ASCII characters (codepoints U+0021 to U+007E except space), and must not include characters judged visually ambiguous: 0, O, 1, l, I. Duplicate characters are disallowed.
- bitsPerChar = log2(charsetSize) and must be computed and returned by listEncodings.
- The implementation must not permit charsets that would introduce control characters or whitespace into encoded outputs.

Acceptance criteria

- defineEncoding creates a usable encoding that passes round-trip tests for representative buffers.
- Attempts to define invalid charsets are rejected with descriptive errors and unit tests cover these cases.
- listEncodings reflects new custom encodings with correct bitsPerChar and charsetSize.