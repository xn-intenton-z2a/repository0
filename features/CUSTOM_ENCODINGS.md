# CUSTOM_ENCODINGS

Summary

Allow users to define ephemeral custom encodings at runtime by supplying a unique name and a printable charset. Custom encodings integrate with the same encode/decode API and appear in listEncodings().

Motivation

Experimentation with bespoke charsets enables exploration of denser printable representations while allowing users to constrain characters for their application contexts (URLs, terminals, JSON, QR payloads).

Scope

- Implement createEncoding(name, charset) exported from src/lib/main.js. It registers an encoding for the current module instance.
- Validate charset: all characters must be printable, no duplicates, minimum 2 characters, warn on characters likely to cause JSON/URL/terminal issues.
- Persist custom encoding only in-memory for the module lifetime; include its metadata in listEncodings().

Public API

- createEncoding(name, charset)
- createEncoding returns metadata: name, charsetSize, bitsPerChar (theoretical)

Acceptance criteria

- createEncoding rejects duplicate names that collide with built-in encodings and returns a clear error.
- createEncoding validates charsets and rejects non-printable or duplicate-character sets.
- Encodings created via createEncoding work with encode and decode and pass round-trip tests for sample inputs including UUIDs.
- listEncodings includes custom encodings and reports correct theoretical bitsPerChar.
- Unit tests cover failed validation paths and successful registration and round-trip behavior for a sample high-density charset.

Notes

Document guidance for choosing charsets that balance density and portability; encourage avoiding quotes, backslashes, and problematic whitespace by default.