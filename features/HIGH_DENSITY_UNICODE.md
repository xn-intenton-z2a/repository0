# HIGH_DENSITY_UNICODE

## Summary

Introduce a carefully curated, high-density printable Unicode encoding as an additional built-in encoding. The feature defines charset selection rules, validation, and usage patterns so the core library can offer a denser alternative to base62/base85/base91 while remaining safe for JSON, terminals, and the website demo.

## Motivation

The mission aims to push binary-to-text density using printable characters. Extending the library with a Unicode-based encoding allows approaching theoretical density limits inside a single-repository implementation, enabling the shortest possible printable v7 UUID representations while keeping fallbacks to ASCII-safe encodings.

## Scope

- Add one new built-in encoding named base95_unicode (name may be adjusted in implementation) implemented in src/lib/main.js. The encoding must be registerable and visible in listEncodings().
- Provide charset selection and validation rules that ensure characters are printable, non-control, and unlikely to break JSON, shells, or common terminals.
- Implement minimal conversion utilities and unit tests in tests/unit/ to validate round-trip correctness and UUID length improvements.
- Update README comparison table and the website demo to include the new encoding's results.

## Charset selection rules

- Characters must be Unicode codepoints classified as printable (General Category other than Cc, Cf, Cs) and renderable in common fonts.
- Prefer characters in the BMP (U+0021..U+07FF) and exclude whitespace characters, quotes (")., backslash, grave accent, and characters known to be problematic in JSON, shells, or Markdown.
- Avoid ambiguous glyphs likely to cause human confusion (where possible), and provide a configurable alternate charset via createEncoding for users who require stricter subsets (e.g., URL-safe or terminal-safe sets).

## Public API

- listEncodings() should include the new encoding metadata: name, charsetSize, bitsPerChar (theoretical), exampleEncodedUUIDLength, and sample charset snippet.
- encode(buffer, encoding) and decode(str, encoding) must support the new encoding without breaking round-trip guarantees.
- encodeUUID(uuid, encoding?) should support explicitly selecting the new encoding; when no encoding is specified, the default densest encoding may prefer the new encoding if it proves shorter.

## Behaviour

- The implementation must be deterministic: given the same charset and input it must produce identical output across runs.
- The new encoding must be usable by createEncoding (i.e., same internal machinery) so tests can register a narrower or wider unicode charset and validate behavior.
- listEncodings() must report the theoretical bitsPerChar computed as log2(charsetSize) and an expected UUID output length for a 16-byte UUID.

## Acceptance criteria

1. A new encoding called base95_unicode (or equivalent) is present in listEncodings() with correct charsetSize and bitsPerChar metadata.
2. encode and decode support the new encoding and satisfy round-trip equality for arbitrary buffers and edge cases: empty buffer, single byte, all-zero, all-0xFF, and typical UUID bytes.
3. Encoding a 16-byte UUID with the new encoding yields a printable representation shorter than base64 (fewer than 24 characters) for the densest charset chosen.
4. Unit tests cover the new encoding: charset validation, round-trip for edge cases, and comparison against base64 length for a canonical v7 UUID.
5. The README comparison table is updated to include the new encoding and its measured encoded UUID length.
6. The website demo (src/web/) can consume benchmarkUUID() or compareEncodings() and show the new encoding in the comparison UI.

## Notes

- This feature must be achievable entirely inside src/lib/main.js, tests, README, and the web demo; no external services or new top-level files are required.
- If fonts or rendering concerns arise for the demo, provide a fallback example using a strictly ASCII-safe subset registered via createEncoding.
- Keep the charset explicit and documented in code comments to aid maintainability and future audits.
