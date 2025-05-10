# Overview

Extend the CLI equation plotter to add support for exporting sampled data points as CSV files. When the `--csv` or `-c` flag is provided, the tool will compute the same points used for SVG generation and serialize them into a comma-separated values file.

# CLI Interface

The entrypoint remains `node src/lib/main.js` followed by a function type and named options:

Named options common to all types (in addition to existing ones):
  - `--csv` or `-c`: Boolean flag. When present, output will be in CSV format.
  - `--output` or `-o`: Path for the output file (default `data.csv` when `--csv` is used, otherwise `plot.svg`).

Usage examples:

  node src/lib/main.js quadratic --a 1 --b 0 --c 0 --csv -o quad_data.csv
  node src/lib/main.js sine --amplitude 2 --frequency 1 --csv

# Behavior

1. Parse CLI arguments, including the new `--csv` flag.  
2. Determine output format: if `--csv` is present, set format to CSV; otherwise, default to SVG.  
3. For supported function types (quadratic, sine), compute the sampling points the same way as existing plot functions:  
   - Quadratic: generate width + 1 x/y pairs.  
   - Sine: generate width + 1 x/y pairs.  
4. If format is CSV:  
   - Serialize points into a string with a header `x,y` on the first line, followed by one line per point: `xValue,yValue`.  
   - Write the CSV string to the output path, creating parent directories if needed.  
5. Exit with zero on success or non-zero on validation or file I/O errors.

# Testing

- Add a unit test file `sandbox/tests/csvExport.test.js`:
  - Test `exportQuadraticCSV(1,0,0,{width:10,xMin:-5,xMax:5})` returns a string starting with `x,y` and exactly 11 data lines.  
  - Test `exportSineCSV(2,1,{width:50, height:100})` returns correct header and line count.  
- Add CLI integration tests in `sandbox/tests/cliCsvExport.test.js` using Node’s `child_process`:
  - Run `node src/lib/main.js quadratic --a 1 --b 0 --c 0 --csv -o test.csv` and verify `test.csv` exists and its first line is `x,y`.  
  - Assert non-zero exit code when required parameters are missing alongside `--csv`.

# Documentation

- Update the top-level `README.md`:
  - Add a “CSV Export” section under Usage.  
  - Show examples for quadratic and sine exports.  
  - Document how `--csv` interacts with `--output`, and note the default filename when omitted.
