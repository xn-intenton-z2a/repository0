# File Analysis

## CLI Behavior

Add a unified `analyze` command with three subcommands for file inspection:

- `analyze stats <filePath> [<filePath> ...] [--json] [--output <file>]`
  - Report file metadata: size in bytes, creation time, last modified time.
  - `--json` flag emits a JSON array of objects `{ path, size, createdAt, modifiedAt }`.
  - `--output` writes the output to a file instead of stdout.

- `analyze count <filePath> [<filePath> ...] [--lines] [--words] [--chars] [--json] [--output <file>]`
  - Compute line, word, and character counts for one or more files.
  - Flags `--lines`, `--words`, `--chars` limit output to specific counts; default prints all three.
  - `--json` outputs a JSON array of `{ path, lines, words, chars }`.
  - `--output` writes to the specified file.

- `analyze search <pattern> <filePath> [<filePath> ...] [--ignore-case] [--output <file>]`
  - Search for a text or regex pattern in one or more files, printing matching lines prefixed with file path and line number.
  - `--ignore-case` performs case-insensitive matching.
  - `--output` writes results to a file.

Examples:

```
npm run start -- analyze stats README.md src/index.js --json
npm run start -- analyze count file1.txt file2.txt --words --output counts.json
npm run start -- analyze search "TODO" sandbox/source --ignore-case
```

## File Modifications

- **sandbox/source/main.js**
  - Import `fs/promises` and add an `analyze` case in the CLI switch that calls `doAnalyzeCommand(argv)`.
  - Implement `async function doAnalyzeCommand(argv)` that inspects `argv._[1]` for the subcommand and delegates to:
    - `doAnalyzeStats(argv)`
    - `doAnalyzeCount(argv)`
    - `doAnalyzeSearch(argv)`
  - Each helper reads files or stats, formats results in text or JSON, and writes to stdout or a file when `--output` is specified.
  - Handle missing arguments and file read errors by printing descriptive messages and exiting with a non-zero code.

- **sandbox/tests/analyze.test.js**
  - Create temporary files and directories with known content and metadata.
  - Test `stats` subcommand: validate correct size, timestamps, JSON formatting, and `--output` behavior.
  - Test `count` subcommand: verify default counts, flags for lines/words/chars, JSON output, multiple files, and file writing.
  - Test `search` subcommand: match text and regex patterns, `--ignore-case`, and `--output` file writing.
  - Test error conditions: missing arguments, non-existent paths.

- **sandbox/docs/CLI_USAGE.md**
  - Update Commands Reference with `analyze` usage, subcommands, options, and examples.

- **package.json**
  - No new dependencies are required; existing `fs/promises` and core modules suffice.

## Testing

Ensure that `npm test` runs `sandbox/tests/analyze.test.js` alongside existing tests. Verify correct behavior across platforms, proper exit codes, and clear error messages.