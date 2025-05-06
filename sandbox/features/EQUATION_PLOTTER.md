# Equation Plotter Feature

## Purpose
The main script will be extended to accept a plot command that generates simple SVG plots for quadratic and sine functions. This will showcase generation of visual output and integration with CLI workflows.

## Command Line Interface
The script will support the following invocation:
- node src/lib/main.js plot <functionType> <outputPath>
  - functionType may be quadratic or sine
  - outputPath is an optional path to write the SVG file
  - If outputPath is omitted, the SVG content is printed to standard output

## Behavior
1. On receiving the plot command the script computes a series of points for the requested function over a fixed domain.
2. It constructs a valid SVG document with defined width, height, axis lines, and a path element representing the function curve.
3. If an output path is provided, the SVG is written to that file. Otherwise, it is printed to console.

## Tests
Update the existing tests in tests/unit/main.test.js to include tests that:
- Invoke main with arguments ["plot","quadratic"] and capture output containing the opening svg tag and a path element.
- Invoke main with arguments ["plot","sine","temp.svg"] and verify that a file temp.svg exists and starts with svg markup.

## Documentation
Update README.md to include a description of the plot command, its parameters, and examples of invocation and expected output.

## Dependencies
No new dependencies are required. SVG generation is implemented directly in the source file with string templates.

## Files to Modify
- src/lib/main.js  (add CLI command parsing and SVG generation logic)
- tests/unit/main.test.js  (extend tests for plot command)
- README.md  (add usage examples and feature description)
- package.json  (no changes required unless adding helper scripts)