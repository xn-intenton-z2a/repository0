# File Statistics

## CLI Behavior

Introduce a new top-level command stats to display file metrics such as line count, word count, character count, and byte size.

Usage

npm run start -- stats <file> [--lines] [--words] [--chars] [--bytes] [--output <file>]

- <file>: Path to the input file to analyze.
- --lines: Show the number of lines in the file.
- --words: Show the number of words in the file.
- --chars: Show the number of characters in the file.
- --bytes: Show the byte size of the file.
- --output <file>: Optional path to write the metrics as a JSON object; if omitted, print to stdout.
- When no metric flags are provided, display all metrics.

## Implementation

- sandbox/source/main.js
  - Add a case "stats" in the CLI switch to invoke async function doStatsCommand(argv).
  - Implement async function doStatsCommand(argv):
    - Validate presence of argv._[1] as input file; on missing exit with code 1 and usage message.
    - Read the file as a buffer using fs/promises; handle I/O errors.
    - Convert buffer to string to compute:
      - lines by splitting on newline characters.
      - words by splitting on whitespace sequences.
      - chars by string length.
      - bytes by buffer length.
    - Assemble a metrics object with keys lines, words, chars, bytes.
    - If argv.output is provided, serialize metrics as JSON and write to the output file; otherwise print JSON to stdout.
    - Exit with code 0 on success or 1 on error.

## Testing

- sandbox/tests/stats.test.js
  - Create files with known content and assert that running stats with each flag returns the correct number.
  - Test default invocation prints all metrics in JSON format.
  - Test --output writes a JSON file containing the metrics.
  - Test missing file argument exits with code 1 and prints a usage error.
  - Test I/O errors on nonexistent files produce exit code 1 and error message.

## Documentation

- README.md and sandbox/docs/CLI_USAGE.md
  - Add a section for the stats command under Commands Reference with usage, flags, and examples showing default and flagged invocations and output file support.
