# CLI_TOOLING

Status: In progress

Overview

Thin CLI wrapper exposing the library via node src/lib/main.js with commands: list-encodings, encode, decode, compare-uuids and --help. The CLI must reuse the public API and produce stable, machine-parseable outputs for tests.

Acceptance criteria

1. --help prints usage and includes the string "list-encodings" and exits 0.
2. list-encodings --json emits a JSON array that matches listEncodings() when sorted by bitsPerChar descending.
3. encode <encoding> <hex-or-file> prints exactly the string returned by encode(name, data) and exits 0.
4. decode <encoding> <text> prints the hex string equal to bytesToHex(decode(...)); when --uuid is supplied and decoded bytes length is 16, prints canonical dashed lowercase UUID.
5. compare-uuids prints a deterministic markdown table whose cells equal encodeUUIDShorthand outputs.
6. CLI tests spawn the process and assert deterministic outputs, exit codes and stderr on errors.

Implementation notes

Use Node built-ins only for argument parsing and I/O; import library functions directly to guarantee parity with unit tests.
