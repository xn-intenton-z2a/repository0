# File Analysis

## CLI Behavior

Add a new top-level command analyze with the following four subcommands:

- analyze stats <filePath> [<filePath> ...] [--json] [--output <file>]
  - Report file metadata size in bytes, creation time, and last modified time for each path
  - With --json, emit a JSON array of objects with fields path, size, createdAt, modifiedAt
  - With --output, write the text or JSON result to the specified file instead of stdout

- analyze count <filePath> [<filePath> ...] [--lines] [--words] [--chars] [--json] [--output <file>]
  - Compute line, word, and character counts for one or more files
  - Flags --lines, --words, --chars restrict which counts to include; default prints all three
  - With --json, output a JSON array of objects with fields path, lines, words, chars
  - With --output, write the result to the specified file instead of stdout

- analyze search <pattern> <filePath> [<filePath> ...] [--ignore-case] [--output <file>]
  - Search each file for a literal or regular expression pattern
  - Matching lines are prefixed with path:lineNumber: and printed
  - With --ignore-case, perform case-insensitive search
  - With --output, write matching lines to the specified file instead of stdout

- analyze diff <fileA> <fileB> [--context <number>] [--output <file>]
  - Compute a unified diff of fileA versus fileB
  - Default context lines is 3, override with --context
  - With --output, write the diff to the specified file instead of stdout

## Implementation

- sandbox/source/main.js
  - Import fs/promises and path if not already
  - Import createTwoFilesPatch from the diff library
  - Add a new case analyze in the CLI switch to call await doAnalyzeCommand(argv)
  - Implement async function doAnalyzeCommand(argv) that validates subcommand argv._[1] and dispatches to helper functions
  - Implement doAnalyzeStats, doAnalyzeCount, doAnalyzeSearch, doAnalyzeDiff:
    - Each reads or stat files with fs.stat or fs.readFile
    - Format human-readable text or JSON depending on flags
    - Use createTwoFilesPatch to generate unified diffs in doAnalyzeDiff
    - Handle --output by writing to a file or printing to stdout
    - Catch and handle errors for missing arguments, file not found, parse errors, and exit with non-zero status

## Testing

- sandbox/tests/analyze.test.js
  - Create temporary files with known content and metadata
  - Test stats subcommand for correct values and JSON output and file writing
  - Test count subcommand for default and selective counts, JSON output, multiple files, and output file
  - Test search subcommand for literal and regex patterns, case-insensitive flag, and output file behavior
  - Test error cases for missing arguments and non-existent paths

- sandbox/tests/analyze-diff.test.js
  - Create two files with known differences
  - Test diff subcommand prints unified diff with headers and changed lines
  - Test --context flag adjusts number of context lines
  - Test --output flag writes diff to file
  - Test error on missing file arguments and non-existent files

## Documentation

- README.md and sandbox/docs/CLI_USAGE.md
  - Add an Analyze section under Commands Reference
  - Document each subcommand with usage, flags, and examples