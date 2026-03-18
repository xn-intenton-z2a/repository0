# CLI_TOOLING

Status: Partial / Not implemented fully

Overview

A small command-line interface provides convenient access to core library functions for humans and scripts. The current src/lib/main.js offers minimal CLI flags (--version, --identity) but does not yet implement the full command surface described here.

Primary commands and options (spec)

- list-encodings [--json]
  - Prints a table of registered encodings with fields: name, charsetSize, bitsPerChar, sample. --json emits a machine-parsable array.
- encode <encodingName> <hex-or-file>
  - Encodes binary data supplied as a 32-character hex string (UUID shorthand) or as a file path; prints encoded string.
- decode <encodingName> <text>
  - Decodes and prints hex bytes; for 16-byte outputs optionally prints dashed UUID.
- compare-uuids
  - Produces a compact table comparing encoded UUID lengths across registered encodings.

Design constraints

- The CLI must be a thin wrapper around the library API (no duplicate encoding logic).
- Keep dependencies minimal and use Node standard libs for argument parsing and stdout/stderr handling.

Acceptance criteria (testable)

- --help or no args prints usage and exits code 0.
- list-encodings --json prints valid JSON parseable into an array of metadata objects with name, charsetSize and bitsPerChar fields.
- encode/decode commands round-trip for at least one representative UUID and for a small binary file path provided.
- compare-uuids reproduces the length comparison results used by the README scripts (when implemented).

Implementation note

- Presently only identity/version flags exist in src/lib/main.js. Implement the remaining commands as a small CLI dispatcher that imports the named exports from src/lib/main.js to avoid duplicate logic.
