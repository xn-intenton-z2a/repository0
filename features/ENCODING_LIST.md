# ENCODING_LIST

Overview

Provide a library-level and CLI/web-level facility to enumerate available encodings and their metadata. Metadata includes name, charsetSize, bitsPerChar (number, two decimals), and a short charset sample.

Requirements

- listEncodings(): returns an array of objects {name, charsetSize, bitsPerChar, sample}.
- CLI support: `node src/lib/main.js --list-encodings [--json]` prints either a human table or JSON when --json is specified.
- Web demo: src/web should be able to render the same metadata to a small table for interactive inspection and for the README comparison.

Acceptance criteria

- listEncodings returns at least the built-in encodings (base62, base85, base91) and any user-registered encodings.
- Returned array is sorted by bitsPerChar descending.
- Unit test validates format and ordering, and that bitsPerChar calculation matches log2(charsetSize) within 0.01.
- CLI prints valid JSON when --json flag is present; tests assert CLI JSON is parseable and contains expected fields.

Implementation notes

- Keep CLI printing small and fast; do not load heavy dependencies for formatting tables.
- Provide a sample HTML fragment generator in examples/ for the README to reuse.
