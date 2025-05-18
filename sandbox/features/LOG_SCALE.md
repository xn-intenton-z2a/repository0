# Log Scale Transform

## CLI Behavior

Introduce a new top-level command `log-scale` to apply a logarithmic transformation to numeric data files.

Usage:

npm run start -- log-scale <inputFile> [--base <number>] [--json] [--output <file>]

- `<inputFile>`: Path to a text file containing one numeric value per line.
- `--base <number>`: Base of the logarithm (default is `10`).
- `--json`: Output results as a JSON array instead of newline-separated values.
- `--output <file>`: Optional path to write the transformed data; defaults to stdout.

Behavior:

- Read each line of the input file, parse as a floating-point number.
- If any line cannot be parsed, print an error with line number and exit with code 1.
- Compute the log of each number using the provided base.
- On success, output either:
  - One log-transformed value per line, or
  - A JSON array of numbers when `--json` is set.
- If `--output` is provided, write results to the specified file; otherwise print to stdout.

## Implementation

- **sandbox/source/main.js**:
  - Add import of `readFile` and `writeFile` from `fs/promises` and `path.resolve` if not already.
  - In the CLI switch, add case `log-scale` to call `await doLogScaleCommand(argv)`.
  - Implement `async function doLogScaleCommand(argv)`:
    - Validate presence of `argv._[1]` as `inputFile`; on missing exit with code 1 and usage message.
    - Read file content, split on line breaks, iterate over lines.
    - Attempt `Number(line.trim())`; if `isNaN`, collect error for that line.
    - If any parse errors, log each as `Error parsing line <n>: '<text>' is not a number` and exit code 1.
    - Determine `base = Number(argv.base) || 10`; if `base <= 0` or `isNaN`, error out.
    - Compute `Math.log(value) / Math.log(base)` for each number.
    - Format output: newline-separated with default precision, or `JSON.stringify(results)` if `--json`.
    - Handle `--output` by writing to file and exiting with code 0.

## Testing

- **sandbox/tests/log-scale.test.js**:
  - Create a temporary file with known numeric lines.
  - Test default base 10 conversion: compare first values to expected log10 results.
  - Test custom base (e.g., `--base 2`) produces correct binary logs.
  - Test `--json` outputs a valid JSON array.
  - Test invalid number line triggers parse error with correct line number and exit code 1.
  - Test invalid base parameter yields descriptive error and exit code 1.
  - Verify `--output` writes transformed data to specified file.

## Documentation

- **README.md**:
  - Add under Commands Reference:
    | log-scale                      | Apply logarithmic transformation to numeric file data with configurable base and output formats |
  - Document usage examples for default and custom base, JSON output, and file output.
