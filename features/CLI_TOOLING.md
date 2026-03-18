# CLI_TOOLING

Status: In progress — CLI surface exists; implement and test the full command set and ensure parity with the library API.

Overview

A small command-line interface provides convenient access to the library for humans and automation. The CLI is a thin wrapper around the public API exported by src/lib/main.js and must not duplicate core encoding logic. The CLI entrypoint remains node src/lib/main.js (package.json: start:cli) but a concise dispatcher will expose the following commands with predictable exit codes and machine-readable options.

Commands

- list-encodings [--json]
  - Prints a table of registered encodings with fields: name, charsetSize, bitsPerChar, sample. --json emits a machine-parsable array of objects.
- encode <encodingName> <hex-or-file>
  - Encodes binary data supplied as: a 32-character hex string (UUID shorthand) or a file path. Prints the encoded string only to stdout and exits 0.
- decode <encodingName> <text> [--uuid]
  - Decodes and prints hex bytes by default; when --uuid is supplied and output is exactly 16 bytes, prints canonical dashed lowercase UUID instead.
- compare-uuids
  - Prints a compact markdown table comparing encoded UUID lengths across registered encodings, ordered by bitsPerChar desc. By default prints to stdout; an optional --out <path> may be implemented.
- --help
  - Prints usage and exits 0. On invalid args or runtime errors print message to stderr and exit non-zero.

Design constraints

- The CLI must import and reuse the library API (encode, decode, listEncodings, encodeUUIDShorthand, decodeUUIDShorthand) to guarantee behaviour parity with unit tests.
- Avoid introducing new dependencies; use Node built-ins only for argument parsing and I/O.
- Output must be stable and machine-testable: --json returns a deterministic array ordered by bitsPerChar descending.

Acceptance criteria (testable)

1. Help: invoking node src/lib/main.js --help (or npm run start:cli -- --help) exits 0 and stdout contains a usage synopsis and the string "list-encodings".
2. list-encodings --json: prints valid JSON parseable to an array where each object contains keys name (string), charsetSize (number), bitsPerChar (number, two decimals). The returned array, when parsed, must equal listEncodings() returned by the library when sorted by bitsPerChar desc.
3. list-encodings (no --json): prints a human-readable table; tests assert deterministic ordering by bitsPerChar desc.
4. encode: invoking node src/lib/main.js encode <encoding> <hex-or-file> exits 0 and stdout is exactly the string returned by encode(encoding, data) when called via the library API in the same process (tests compare CLI output to direct-library call results).
5. decode: invoking node src/lib/main.js decode <encoding> <text> exits 0 and stdout is the hex string equal to bytesToHex(decode(...)). With --uuid, stdout is the canonical dashed lowercase UUID when decoded bytes are 16 bytes; tests compare strings exactly to library helpers.
6. compare-uuids: invoking node src/lib/main.js compare-uuids prints a markdown table where each encoded cell matches encodeUUIDShorthand(uuid, encodingName) and the length reported equals its string length; tests compare outputs to live library values.
7. Error handling: calling encode/decode with an unknown encoding or invalid input exits non-zero and prints a descriptive message to stderr; tests assert non-zero exit code and stderr content.
8. Determinism: JSON output ordering and table ordering are deterministic and based on bitsPerChar descending; tests rely on stable ordering for assertions.
9. Tests: tests/unit/cli.test.js must spawn the CLI (child_process.spawnSync) and assert exit code, stdout/stderr exact contents or JSON-parsable structures. CLI tests must not rely on network or non-deterministic inputs.

Testing notes

- Keep CLI tests small; assert exact equality between CLI outputs and direct library calls rather than reimplementing encoding logic in the tests.
- Use sample UUIDs and deterministic buffers from tests/unit helpers used by other tests so the CLI test suite remains fast.

Implementation notes

- Implement the dispatcher in a concise module (e.g., src/cli.js) or augment src/lib/main.js with a guarded CLI mode. Keep logic thin and covered by tests.
- Exit codes: 0 success, 2 usage error, 1 runtime error.
- Avoid new dependencies; use process.argv and fs for file I/O.
- Document CLI usage briefly in README.md and provide an examples/ snippet demonstrating list-encodings and compare-uuids.
