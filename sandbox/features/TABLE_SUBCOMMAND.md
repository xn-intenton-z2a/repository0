# Overview

Introduce a new CLI subcommand `table` to generate and output sampled data points for supported mathematical functions in JSON or CSV format. This feature complements the existing plotting functionality by providing raw numeric data for further analysis or downstream processing.

# Commands

- `table <functionName>`: Generate sampled data points for the specified function.

Flags:
- `--xmin <number>` (default -10): Lower bound of the x-axis.
- `--xmax <number>` (default 10): Upper bound of the x-axis.
- `--samples <number>` (default 100): Number of intervals to sample.
- `--format <string>` (default json): Output format, either `json` or `csv`.
- `--output <filepath>`: Write the output to a file instead of stdout.

# Implementation Details

1. In `sandbox/source/main.js`, detect the `table` command alongside existing commands.
2. Validate that a `functionName` argument is provided and it belongs to the supported set [quadratic, sine].
3. Parse numeric flags for `xmin`, `xmax`, and `samples` using minimist defaults.
4. Generate an array of data points:
   - Compute x values evenly spaced between `xmin` and `xmax` over `samples` intervals.
   - Compute y values for each x according to the function.
5. Format the data:
   - For JSON: output a JSON array of objects with `x` and `y` properties.
   - For CSV: output a header line `x,y` followed by one line per point.
6. Handle the `--output` flag to write the formatted data to disk, exiting with code 0 on success or printing an error and exiting with code 1 on failure.
7. If `functionName` is missing or unsupported, print a descriptive error to stderr and exit with code 1.

# Tests

- Add tests in `sandbox/tests/cli.test.js` to verify:
  - Default JSON output for `table quadratic` and `table sine` with valid status codes and correct JSON structure.
  - CSV output when `--format csv` is specified, ensuring header and comma-separated values.
  - File writing behavior with `--output`, verifying file creation and content format.
  - Error cases for missing or unsupported function names, checking stderr messages and non-zero exit codes.

# Documentation

- Update `README.md` under Usage to document the `table` subcommand, its flags, and provide examples for JSON and CSV outputs.
- Update `sandbox/docs/USAGE.md` to include a dedicated section for `table` with usage patterns and sample commands.