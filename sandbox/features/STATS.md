# File Statistics

## CLI Behavior

Introduce a new top-level command `stats` to report metrics for a specified file. When run without metric flags, `stats` prints all available metrics in a formatted JSON object. Users may specify one or more of the following flags to limit output to specific metrics, and may optionally write results to a file.

Usage:

npm run start -- stats <file> [--lines] [--words] [--chars] [--bytes] [--output <file>]

- `<file>`: Required path to the file to analyze.  
- `--lines`: Include only the line count.  
- `--words`: Include only the word count.  
- `--chars`: Include only the character count.  
- `--bytes`: Include only the byte size.  
- `--output <file>`: Optional path to write the JSON result; defaults to stdout.

Behavior:

- Read the file as a Buffer using `fs/promises`.  
- Compute metrics:
  - `lines`: Number of newline-separated lines.  
  - `words`: Number of whitespace-separated words.  
  - `chars`: Number of string characters.  
  - `bytes`: Buffer length in bytes.
- If no metric flags are specified, include all metrics.  
- Build and serialize a JSON object with two-space indentation.  
- If `--output` is provided, write the result to the given path; otherwise print to stdout.  
- On missing file argument or read error, print an error message to stderr and exit with code 1.

## Implementation

- **sandbox/source/main.js**
  - Import `fs/promises`.  
  - In the main switch, add a case `stats` to call `await doStatsCommand(argv)`.  
  - Implement `async function doStatsCommand(argv)`:  
    - Validate presence of `argv._[1]`; on missing, print usage and exit code 1.  
    - Read the file into a Buffer.  
    - Compute the metrics as described above.  
    - Determine which keys to include based on flags.  
    - Serialize the object with two-space indentation.  
    - Write to `argv.output` if provided; otherwise print to stdout.  
    - Catch and handle errors by printing descriptive messages and exiting with code 1.

## Testing

Create `sandbox/tests/stats.test.js` using Vitest to cover:

- Running `stats` without flags returns JSON with all metrics.  
- Running with each individual flag returns JSON with only that metric.  
- Using multiple flags returns JSON with only specified metrics.  
- `--output` writes the JSON to a file and prints nothing to stdout.  
- Missing file argument exits with code 1 and prints usage.  
- I/O error on nonexistent file exits with code 1 and prints an informative error.

## Documentation

- **README.md** and **sandbox/docs/CLI_USAGE.md**
  - Add a `stats` entry under Commands Reference.  
  - Document usage, available flags, default behavior, and `--output` examples.
