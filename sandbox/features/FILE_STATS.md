# File Statistics
## CLI Behavior
Introduce a new top-level command stats to report basic file metrics for text or binary files.

Usage:

npm run start -- stats <filePath> [--lines] [--words] [--chars] [--bytes] [--json] [--output <file>]

- <filePath>: Path to the input file to analyze.
- --lines: Include line count in the report.
- --words: Include word count in the report (words separated by whitespace).
- --chars: Include character count in the report.
- --bytes: Include byte count in the report.
- --json: Output the metrics as a JSON object.
- --output <file>: Write the report to the specified file instead of stdout.

Behavior:
- If no metric flags are provided, report all metrics: lines, words, chars, and bytes.
- Read the file in streaming mode for efficiency on large files.
- Count lines by tracking newline characters, words by splitting on whitespace, chars by string length, bytes by buffer length.
- Format output as plain text with one metric per line or as JSON when --json is used.
- If --output is provided, write the formatted report to the file and exit with code 0; otherwise print to stdout.

## File Modifications
- sandbox/source/main.js:
  - Import fs from fs/promises and create a new case stats in the CLI switch to call async function doStatsCommand.
  - Implement doStatsCommand(argv) to validate argv._[1], read the file as a stream or buffer, compute metrics, format report based on flags, and handle --output.
- sandbox/tests/stats.test.js:
  - Create a temporary text file with known content containing lines, words, and characters.
  - Invoke node sandbox/source/main.js stats without flags and assert the output includes correct counts for lines, words, chars, and bytes.
  - Test each individual flag to verify it reports only the requested metric.
  - Test --json flag produces valid JSON with numeric fields lines, words, chars, and bytes.
  - Test --output writes the report to a file with expected content and no stdout output.

## Documentation
- README.md and sandbox/docs/CLI_USAGE.md:
  - Add a section for the stats command under Commands Reference.
  - Document usage, available flags, examples for default and tailored output formats.
