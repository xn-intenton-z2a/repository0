# Mission

A JavaScript library and CLI tool for generating plots from mathematical expressions and time series data. Produces SVG and PNG output files.

## Required Capabilities

- Parse a mathematical expression string using JavaScript `Math` functions (e.g. `"y=Math.sin(x)"`, `"y=x*x+2*x-1"`) into an evaluatable function.
- Evaluate an expression over a numeric range (`start:step:end`) and return an array of data points.
- Load time series data from a CSV file with columns `time,value`.
- Render a data series to SVG 1.1 using `<polyline>` elements with a `viewBox` attribute.
- Render a data series to PNG (canvas-based or via SVG conversion — document the approach in the README).
- Save a plot to a file, inferring format from extension (`.svg` or `.png`).

## CLI

```
node src/lib/main.js --expression "y=Math.sin(x)" --range "-3.14:0.01:3.14" --file output.svg
node src/lib/main.js --csv data.csv --file output.png
node src/lib/main.js --help
```

Range format: `start:step:end` (e.g. `-3.14:0.01:3.14`).

The `--help` flag prints usage examples and exits.

## Requirements

- Export all public API as named exports from `src/lib/main.js`.
- SVG output must be valid SVG 1.1 with a `viewBox` attribute.
- External dependencies allowed only for PNG rendering (e.g. `canvas`, `sharp`). Expression parsing must use built-in JavaScript `Math` — no external math libraries.
- Comprehensive unit tests covering expression parsing, series generation, SVG structure, and CLI flags.
- README with example commands and sample output descriptions.

## Acceptance Criteria

- [ ] Parsing `"y=Math.sin(x)"` returns a callable function
- [ ] Evaluating over range `-3.14:0.01:3.14` returns ~628 data points
- [ ] SVG output contains `<polyline>` and `viewBox` attributes
- [ ] PNG output starts with the PNG magic bytes
- [ ] CLI `--expression "y=Math.sin(x)" --range "-3.14:0.01:3.14" --file output.svg` produces a file
- [ ] CLI `--help` prints usage information
- [ ] All unit tests pass
- [ ] README documents CLI usage with examples
