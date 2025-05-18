# File Statistics

## CLI Behavior

Introduce a new top-level command `stats` to report metrics for a single file. Metrics include line count, word count, character count, and byte size. When invoked without metric flags, all metrics are displayed. Users can limit output to specific metrics or write results to a file.

Usage:

npm run start -- stats <file> [--lines] [--words] [--chars] [--bytes] [--output <file>]

- `<file>`: Path to the file to analyze (required).
- `--lines`: Show only the number of lines.
- `--words`: Show only the number of words.
- `--chars`: Show only the number of characters.
- `--bytes`: Show only the byte size of the file.
- `--output <file>`: Optional path to write the metrics as a JSON object. If omitted, metrics are printed to stdout as JSON.

Behavior:

- Read the file as a buffer using Node’s fs/promises.
- Compute metrics:
  - `lines`: number of newline-separated lines.
  - `words`: count of whitespace-separated words.
  - `chars`: string length.
  - `bytes`: buffer length.
- Build a JSON object with keys for each requested metric (or all metrics if no flags provided).
- If `--output` is specified, write the JSON object to the given file path and exit with code 0; otherwise, print JSON to stdout and exit with code 0.
- On missing file argument or I/O error, print a descriptive error message and exit with code 1.

## File Modifications

- **sandbox/source/main.js**
  - Import `fs/promises` if not already imported.
  - In the CLI switch, add a case `stats` that calls `await doStatsCommand(argv)`.
  - Implement `async function doStatsCommand(argv)`:
    - Validate presence of `argv._[1]`; on missing, print usage and exit code 1.
    - Read the file into a Buffer.
    - Compute metrics as described.
    - Construct an object with only the keys for which flags are provided, or all keys if none provided.
    - Serialize the object as JSON with two-space indentation.
    - If `argv.output` is provided, write JSON to the file; otherwise, print to stdout.
    - Handle errors with descriptive messages and exit code 1.

## Tests

- **sandbox/tests/stats.test.js**
  - Create temporary files with known content and assert:
    - Running `stats` without flags returns JSON with all metrics.
    - Running with each individual flag returns JSON with only that metric.
    - `--output` writes the JSON to a file and prints nothing to stdout.
    - Missing file argument exits with code 1 and prints usage.
    - I/O error on nonexistent file exits with code 1 and prints an error.

## Documentation

- **README.md** and **sandbox/docs/CLI_USAGE.md**
  - Add a `stats` entry under Commands Reference with usage, flags, examples, and a note on JSON output.
