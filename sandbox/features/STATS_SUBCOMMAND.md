# Overview

Introduce a new CLI subcommand `stats` that computes and displays summary statistics for sampled data points of supported mathematical functions. This complements the existing table and plot subcommands by providing key metrics without requiring manual data inspection.

# Commands

- `stats <functionName>`: Generate basic statistics for the specified function over a sampled domain.

Flags:
- `--xmin <number>` (default -10): Lower bound of the x-axis.
- `--xmax <number>` (default 10): Upper bound of the x-axis.
- `--samples <number>` (default 100): Number of intervals to sample.
- `--output <filepath>`: Write the statistics as JSON or plain text to a file instead of stdout.

# Implementation Details

1. In `sandbox/source/main.js`, detect the `stats` command alongside `plot` and `table`.
2. Validate that a `functionName` argument is provided and that it belongs to the supported set [quadratic, sine].
3. Parse numeric flags for `xmin`, `xmax`, and `samples` with existing defaults.
4. Generate the array of data points exactly as in plot and table features.
5. Compute summary metrics:
   - Minimum y value
   - Maximum y value
   - Mean y value
   - Standard deviation of y values
6. Assemble an object with keys for functionName, xmin, xmax, samples, and the computed metrics.
7. If the `--output` flag is provided, serialize the result as JSON and write to the specified file, exiting with code 0 on success or printing an error to stderr and exiting with code 1 on failure.
8. Without `--output`, print the result as a formatted JSON string to stdout.

# Tests

- Extend `sandbox/tests/cli.test.js` to cover:
  - Successful invocation of `stats quadratic` and `stats sine`, verifying exit status 0 and that output includes keys min, max, mean, std.
  - Custom flags for `xmin`, `xmax`, and `samples` produce expected adjusted metrics.
  - `--output` writes a JSON file containing the metrics.
  - Error cases: missing functionName or unsupported functionName result in stderr messages and exit code 1.

# Documentation

- Update `README.md` to include the `stats` subcommand under Usage with examples showing invocation and output.
- Update `sandbox/docs/USAGE.md` to add a dedicated section for `stats` with flags and sample output.