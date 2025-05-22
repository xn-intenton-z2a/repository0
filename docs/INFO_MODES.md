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
- When invoked with `--help`: prints usage information and exits.
- Default (no flags): prints received arguments.

## CLI Usage

```
node src/lib/main.js --mission         # Print project mission and exit
node src/lib/main.js --diagnostics    # Print runtime diagnostics JSON and exit
node src/lib/main.js --serve [port]   # Start HTTP server responding with "Hello World!"
node src/lib/main.js --help           # Show usage information
node src/lib/main.js                  # Default echo behavior
```

## Tests

- Unit tests for:
  • `parseMissionArg([])` → `false`; `parseMissionArg(["--mission"])` → `true`.
  • `readMission()` returns a string containing `# repository0`.
  • `parseDiagnosticsArg([])` → `false`; `parseDiagnosticsArg(["--diagnostics"])` → `true`.
  • `collectDiagnostics()` returns correct types for all fields.
  • Conflict detection: passing both `--mission` and `--diagnostics` should error.
  • Help mode: `--help` prints usage and exits.
  • `parseServeArgs` and HTTP server tests remain unchanged.

- Integration tests for `main(["--mission"])`, `main(["--diagnostics"])`, conflict, help, and default mode.

## Implementation Details

- `src/lib/main.js`:
  - Added `hasFlag` helper to detect any flag in the argument list.
  - Before any mode, handle `--help` and conflicts between `--mission` and `--diagnostics`.
  - Added PR opener mode with `--open-prs`.
  - Retained existing logic for mission, diagnostics, serve, and default modes.

- No new dependencies added.
