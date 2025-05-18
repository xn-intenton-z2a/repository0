# File Statistics

## CLI Behavior

Introduce a new top-level command stats to report file metrics including line count, word count, character count, and byte size. When invoked without any metric flags, stats prints all metrics as a JSON object to stdout. Users can specify one or more of the following flags to limit output to specific metrics, and may use --output to write results to a file.

Usage:

npm run start -- stats <file> [--lines] [--words] [--chars] [--bytes] [--output <file>]

- `<file>`: Required path to the file to analyze.
- `--lines`: Include only the line count.
- `--words`: Include only the word count.
- `--chars`: Include only the character count.
- `--bytes`: Include only the byte size of the file.
- `--output <file>`: Optional path to write the JSON result; if omitted, print to stdout.

Behavior:

- Read the file as a Buffer using fs/promises.
- Compute metrics:
  - `lines`: Number of newline-separated lines.
  - `words`: Number of whitespace-separated words.
  - `chars`: String length of the file content.
  - `bytes`: Buffer length.
- Build a JSON object containing keys for each requested metric (or all metrics when no flags are specified).
- Serialize the object with two-space indentation.
- If `--output` is provided, write the JSON to the specified file and exit with code 0; otherwise print to stdout and exit with code 0.
- On missing file argument or I/O error, print a descriptive error message to stderr and exit with code 1.

## Implementation

- **sandbox/source/main.js**
  - Import fs/promises if not already imported.
  - In the CLI switch statement, add a case "stats" that calls `await doStatsCommand(argv)`.
  - Implement `async function doStatsCommand(argv)`:
    - Validate presence of `argv._[1]`; on missing, print usage and exit code 1.
    - Read the file into a Buffer.
    - Compute each metric as described above.
    - Determine which metrics to include based on flags.
    - Format the output as a JSON string with two-space indentation.
    - Write to file if `argv.output` is provided; otherwise print to stdout.
    - Handle errors (missing file, read errors) by printing an error message and exiting with code 1.

## Testing

Create `sandbox/tests/stats.test.js` with Vitest to cover:

- Running stats without flags returns JSON with all four metrics.
- Running with each individual flag returns JSON with only that metric.
- Using multiple flags returns JSON with all specified metrics.
- `--output` writes the JSON file and prints nothing to stdout.
- Missing file argument exits with code 1 and prints usage to stderr.
- I/O error on nonexistent file exits with code 1 and prints an error message.

## Documentation

- Update **README.md** and **sandbox/docs/CLI_USAGE.md**:
  - Add a new `stats` entry under Commands Reference with usage, flags, and examples.
  - Document default behavior and use of metric flags and `--output`.