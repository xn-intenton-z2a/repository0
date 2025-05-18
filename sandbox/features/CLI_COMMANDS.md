# CLI Commands

## Overview

Unify and maintain all core CLI commands in a single feature, covering help, mission, version, echo, feature listing, and file utilities including stats, replace, convert, validate, markdown, render, csv-import, and import-data. Ensure consistent behavior, implementation, testing, and documentation.

## Help Command

### CLI Behavior

- `help` or no command: print general usage and list of commands.
- `help <command>`: print detailed usage, flags, and examples for the specified command. Unknown commands produce an error and exit code 1.

### Implementation

- Extend `showHelp(argv)` in `sandbox/source/main.js` to accept an optional command name.
- Map command names to usage strings and examples.
- In the main switch, handle `help` by delegating to the extended `showHelp`.

## Mission and Version Commands

### Mission

- `mission`: read and print contents of `MISSION.md`; on error exit code 1 with descriptive message.

### Version

- `version`: read `package.json` version field and print; on error exit code 1.

## Echo Command

- `echo <args>`: print the provided arguments joined by spaces.
- Implement in `doEcho(args)` in `main.js`.

## Features Commands

### features [--validate-mission]

- List headings of Markdown files in `sandbox/features/`.
- With `--validate-mission`, list only those without mission references; if any reference mission then report filenames and exit 1.

### mission-features

- Print mission statement then list available features.

## Stats Command

### CLI Behavior

Introduce a new `stats` command to compute file metrics.

Usage:

    npm run start -- stats <filePath> [--lines] [--words] [--chars] [--bytes] [--json] [--output <file>]

- Default (no metric flags): report all metrics.
- `--lines`: report line count.
- `--words`: report word count.
- `--chars`: report character count.
- `--bytes`: report byte size.
- `--json`: output metrics as compact JSON object.
- `--output <file>`: write results to file instead of stdout.

### Implementation

- In `sandbox/source/main.js`: import `fs/promises` and optionally Node's `readline` for streaming large files.
- Add a case `stats` in the CLI switch that calls `await doStatsCommand(argv)`.
- Implement `async function doStatsCommand(argv)`:
  - Validate `argv._[1]` exists; on missing print usage and exit 1.
  - Read file content (stream for large files): count lines by incrementing on newline, words by splitting on whitespace, chars via `content.length`, bytes via `Buffer.byteLength(content)`.
  - Build an object with requested metrics.
  - Serialize as plain text or JSON based on `--json`.
  - If `--output` is set, write to file; otherwise print to stdout.

### Testing

- Add `stats.test.js` in `sandbox/tests/`:
  - Test default metrics on a small text file.
  - Test each metric flag individually.
  - Test `--json` produces valid JSON object.
  - Test `--output` writes to file.
  - Test error on missing file or unreadable file.

### Documentation

- Update `README.md` and `sandbox/docs/CLI_USAGE.md` to include the `stats` command under Commands Reference with usage, flags, and examples.