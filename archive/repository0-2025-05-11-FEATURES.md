sandbox/features/CSV_EXPORT.md
# sandbox/features/CSV_EXPORT.md
# Purpose

Add the ability to export the computed (x, y) data points as comma-separated values so users can analyze or visualize data outside of the SVG output.

# Behavior

- Introduce a new function `generateCSV(type, params)` in the source module. This function computes the same series of points used by `generateSVG` over 101 steps from 0 to 1, then returns a CSV string with a header row `x,y` followed by one row per point.
- Extend the CLI in `sandbox/source/main.js` to accept a new option `--csv`. When provided with a file path, the CLI writes the CSV string to that file. When provided without a value (or with `-`), it prints the CSV to stdout.
- If `--csv` is provided alongside `--output`, the CLI will generate both CSV and SVG outputs, writing each to its respective file or to stdout when a file path is omitted.
- Maintain existing behavior for `--mission`, `--type`, and `--output`. The CSV option does not change error handling for missing or invalid types.

# CLI Usage

Examples:

node sandbox/source/main.js --type quadratic --csv data.csv
Print CSV of 101 points for a=1,b=0,c=0 to file `data.csv`.

node sandbox/source/main.js --type sine --frequency 2 --csv -
Print CSV for a sine wave to stdout.

node sandbox/source/main.js --type quadratic --a 1 --b 2 --c 1 --output plot.svg --csv data.csv
Generate both `plot.svg` and `data.csv` files in the current directory.

# Testing

- Add unit tests for `generateCSV` in `sandbox/tests/generateCSV.test.js`. Verify the CSV string starts with `x,y` and that a known input produces correct rows (for example, constant zero function yields all zeros).
- Add CLI integration tests in `sandbox/tests/cli-csv.test.js` that invoke the CLI with `--csv` and assert file creation, stdout output, and correct CSV formatting.

# Documentation

- Update `sandbox/docs/USAGE.md` to document the new `--csv` option, describe behavior, and provide usage examples.
- Update `README.md` to mention the CSV export capability and reference the new function `generateCSV(type, params)` as part of the public API.
sandbox/features/EQUATION_PLOT.md
# sandbox/features/EQUATION_PLOT.md
# Purpose

Implement a command line equation plotter that transforms mathematical expressions into SVG graphics.

# Behavior

The main script will parse command line options to select a function type and its parameters. Supported functions include quadratic and sine. The script computes a series of (x, y) points over a fixed domain, converts them into SVG path data, and outputs a complete SVG image.

The CLI accepts the following options:
  --type    Function type: "quadratic" or "sine".
  --a       Coefficient a for quadratic. Default 1.
  --b       Coefficient b for quadratic. Default 0.
  --c       Coefficient c for quadratic. Default 0.
  --amplitude Amplitude for sine. Default 1.
  --frequency Frequency for sine. Default 1.
  --phase   Phase shift for sine. Default 0.
  --output  File path to write SVG. If omitted, SVG is printed to stdout.

The SVG canvas is 500 by 500 pixels. The domain for x is 0 to 100. The computed y values are scaled to fit 0 to 100 then inverted for SVG coordinate space.

# CLI Usage

Run in terminal:

node src/lib/main.js --type quadratic --a 1 --b 0 --c 0 --output plot.svg

node src/lib/main.js --type sine --amplitude 1 --frequency 2 --phase 0

# Testing

Add unit tests for the generateSVG function. Tests should invoke the function with known parameters and assert that the returned string starts with <svg and contains path data commands. Include a test for writing to a file when the output option is provided.

# Documentation

Update the README to describe the new equation plot feature. Include usage examples for both quadratic and sine plots. Add a note on how to view the generated SVG file.
