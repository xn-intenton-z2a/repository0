# File Analysis

## CLI Behavior

Add a new top-level command `analyze` with three subcommands for file inspection:

- `analyze stats <filePath> [<filePath> ...] [--json] [--output <file>]
  - Reports file metadata: size in bytes, creation time, and last modified time for each path.
  - With `--json`, emits a JSON array of objects `{ path, size, createdAt, modifiedAt }`.
  - With `--output`, writes the output (text or JSON) to the specified file instead of stdout.

- `analyze count <filePath> [<filePath> ...] [--lines] [--words] [--chars] [--json] [--output <file>]
  - Computes line, word, and character counts for one or more files.
  - Flags `--lines`, `--words`, `--chars` limit which counts to include; default prints all three.
  - With `--json`, outputs an array of `{ path, lines, words, chars }`.
  - With `--output`, writes results to a file instead of stdout.

- `analyze search <pattern> <filePath> [<filePath> ...] [--ignore-case] [--output <file>]
  - Searches each file for a literal or regex pattern, printing matching lines prefixed with `path:lineNumber: `.
  - `--ignore-case` enables case-insensitive searches.
  - With `--output`, writes matching lines to the specified file.

## Implementation

- **sandbox/source/main.js**
  - Import `fs/promises` and `path` if not already.
  - Add a new `analyze` case in the CLI switch to call `await doAnalyzeCommand(argv)`.
  - Implement `async function doAnalyzeCommand(argv)` that reads `argv._[1]` for the subcommand and dispatches to:
    - `doAnalyzeStats(argv)`
    - `doAnalyzeCount(argv)`
    - `doAnalyzeSearch(argv)`
  - Each helper:
    - Validates required arguments and flags, printing an error and exiting code 1 on missing inputs.
    - Reads file stats or content with `fs.stat` / `fs.readFile`.
    - Formats results as human-readable text or JSON.
    - If `--output` is provided, writes the string to the specified file path; otherwise prints to stdout.
    - Catches and handles errors (file not found, read error) by printing descriptive messages and exiting non-zero.

## Testing

- **sandbox/tests/analyze.test.js**
  - Create temporary files and directories with known content and metadata.
  - Test `stats`:
    - Validate correct size, timestamps, text formatting.
    - Validate JSON output structure when `--json` is used.
    - Validate output file writing with `--output`.
  - Test `count`:
    - Verify default counts (lines, words, chars).
    - Verify selective counts with flags `--lines`, `--words`, `--chars`.
    - Verify JSON output and file write behavior.
    - Test with multiple files.
  - Test `search`:
    - Match literal strings and regex patterns.
    - Test case-insensitive search with `--ignore-case`.
    - Verify output file writing with `--output`.
  - Test error conditions:
    - Missing subcommand or arguments.
    - Non-existent file paths.

## Documentation

- **README.md** and **sandbox/docs/CLI_USAGE.md**
  - Add `analyze` section under Commands Reference with usage, flags, and examples.
  - Provide examples demonstrating stats, count, and search subcommands.

## Dependencies

No new dependencies are required; use built-in `fs/promises`, `path`, and `process`.