# Overview

Add support for plotting multiple series of data or functions on a single SVG output with distinct styling and an automatic legend.

# CLI Usage

- --series <label>:<kind>:<value>  Define a series to plot. label is a text identifier. kind is one of expression,function,data-file,polar. value is the argument for the kind (expression string, built-in function name, path to data file, or polar expression). This flag can be repeated to include multiple series.

# Source File Changes

1. Extend argument parsing to collect all --series flags into an array. For each series string split into label, kind, and value. Validate kinds and syntax, exiting with code 1 on errors.
2. For each defined series use existing plotting logic: evaluate expressions or functions, parse data files, or compute polar coordinates. Build individual SVG path elements for each series.
3. Assign a distinct stroke color from a default palette for each series. Pass optional global style flags (stroke-width, fill, etc) or use defaults.
4. Compute combined x and y extents across all series to set a unified viewBox that fits all curves and data points.
5. After rendering all paths, generate a legend group located in a plot margin. For each series draw a small colored rectangle and adjacent text label matching the series label and color.
6. Ensure backward compatibility so that if no --series flag is provided, the CLI falls back to single series behavior with existing flags.

# Tests

Add sandbox/tests/multi-series.test.js with tests that:
- Invoke main with a single --series flag and verify the output SVG contains one <path> element and no legend group.
- Invoke main with two --series flags and assert the output includes two <path> elements and a <g> element for the legend containing two <rect> and two <text> entries.
- Test that invalid series syntax or unsupported kind yields exit code 1 with a descriptive error.

# Documentation

Update README.md to document the --series flag syntax and behavior. Provide example commands plotting multiple series and show a snippet of the SVG output illustrating two colored lines and a legend.