# INFO_MODES

## Overview

Unify the existing “Diagnostics Mode” and “Mission Mode” into a single information feature set. This enables the CLI to print either the project mission or runtime diagnostics while preserving the existing HTTP server and default behaviors.

## Behavior

- When invoked with `--mission`:
  • Reads and prints the full content of `MISSION.md`.
  • Exits with code 0.

- When invoked with `--diagnostics`:
  • Collects runtime information (Node.js version, process uptime, memory usage: `rss`, `heapTotal`, `heapUsed`, platform, and arch).
  • Prints a JSON object with these fields.
  • Exits with code 0.

- When invoked with `--serve [port]`: unchanged HTTP_SERVER behavior.
- Default (no flags): prints received arguments.

## CLI Usage

- `node src/lib/main.js --mission`  → Print project mission from MISSION.md and exit.
- `node src/lib/main.js --diagnostics`  → Print runtime diagnostics JSON and exit.
- `node src/lib/main.js --serve [port]`  → Start HTTP server responding with “Hello World!”.
- `node src/lib/main.js`  → Default echo behavior.

## Tests

- Unit tests for:
  • `parseMissionArg([])` → `false`; `parseMissionArg(["--mission"])` → `true`.
  • `readMission()` returns a string containing `# repository0`.
  • `parseDiagnosticsArg([])` → `false`; `parseDiagnosticsArg(["--diagnostics"])` → `true`.
  • `collectDiagnostics()` returns correct types for all fields.

- Integration tests for `main(["--mission"])` and `main(["--diagnostics"])`:
  • Spy on `console.log` and stub `process.exit` to capture output and exit code.
  • Verify mission output contains the repository title.
  • Verify diagnostics output can be parsed as JSON and contains required properties.

## Implementation Details

- In `src/lib/main.js`, detect `--mission` and `--diagnostics` first in `main(args)`. For each:
  • Call existing helpers (`readMission`, `collectDiagnostics`).
  • Print output via `console.log`.
  • Call `process.exit(0)`.

- Preserve `--serve` logic (`parseServeArgs` and `startServer`), and default echo logic.

- No changes to dependencies; reuse existing implementations of `readMission` and `collectDiagnostics`.
