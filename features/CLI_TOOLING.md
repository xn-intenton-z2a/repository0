# CLI_TOOLING

Status: Partial — CLI surface exists but full command set is not yet implemented and tested.

Overview

A small command-line interface provides convenient access to the library for humans and automation. The CLI is a thin wrapper around the public API exported by src/lib/main.js and must not duplicate core encoding logic. The entrypoint remains node src/lib/main.js (package.json: start:cli) but a dispatcher will expose these commands with predictable exit codes and machine-readable options.

Commands

- list-encodings [--json]
  - Prints a table of registered encodings with fields: name, charsetSize, bitsPerChar, sample. --json emits a machine-parsable array of objects.
- encode <encodingName> <hex-or-file>
  - Encodes binary data supplied as: a 32-character hex string (UUID shorthand) or a file path. Prints encoded string and exits 0.
- decode <encodingName> <text> [--uuid]
  - Decodes and prints hex bytes; when --uuid is supplied and output is exactly 16 bytes, prints canonical dashed UUID instead.
- compare-uuids
  - Prints a compact table comparing encoded UUID lengths across registered encodings. Exit code 0 on success.
- --help
  - Prints usage and exits 0. If invalid args or runtime errors occur, print message to stderr and exit non-zero.

Design constraints

- The CLI must import and reuse the library API (encode, decode, listEncodings, encodeUUIDShorthand, decodeUUIDShorthand) to guarantee behaviour parity with unit tests.
- Avoid introducing new dependencies; use Node built-ins for argument parsing and I/O.
- Output must be stable and machine-testable (JSON flag, deterministic ordering of encodings by bitsPerChar descending).

Acceptance criteria (testable)

- CLI presence: running node src/lib/main.js --help or invoking npm run start:cli -- --help prints usage text and exits with code 0.
- JSON output: running node src/lib/main.js list-encodings --json prints valid JSON parseable to an array where each object contains name (string), charsetSize (number), and bitsPerChar (number with at most two decimals).
- Encode/Decode parity: tests in tests/unit/cli.test.js spawn the CLI to run encode and decode and assert the printed encoded/decoded outputs exactly match results from the library functions called directly (no differing logic allowed).
- Error handling: invoking encode with an unknown encoding or invalid input returns a non-zero exit code and prints a descriptive error to stderr; tests assert exit code and stderr patterns.
- compare-uuids: CLI command prints a table where each cell length equals the length of encodeUUIDShorthand(uuid, encoding) from the library; tests verify one canonical sample UUID produces the same densest-encoding length reported by unit tests (densest < 22 requirement).

Testing notes

- Tests should be implemented at tests/unit/cli.test.js using child_process.spawnSync or spawn to invoke node src/lib/main.js with arguments and examine stdout/stderr and exit code.
- Ensure tests assert deterministic ordering (listEncodings ordered by bitsPerChar descending) when examining CLI output without --json.
- Keep CLI test suite small and focused so CI runs quickly.

Implementation notes

- Implement the dispatcher in src/cli.js or augment src/lib/main.js with a concise CLI mode; keep logic thin and well-covered by tests.
- Provide clear exit codes: 0 success, 2 usage error, 1 runtime error.
- Document the CLI usage in README.md and examples/ directory with a short usage snippet demonstrating list-encodings and compare-uuids.
