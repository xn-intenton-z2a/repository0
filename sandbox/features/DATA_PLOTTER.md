# Overview

Add support for plotting arbitrary datasets from JSON or CSV files. This feature lets users supply a file containing data points and renders the corresponding Cartesian plot as an SVG output. It complements equation and polar plotting by enabling visualization of real or imported data.

# CLI Usage

- --data-file <file-path>  Path to a JSON or CSV file containing data points. JSON format is an array of objects with numeric fields x and y. CSV format is two columns representing x and y values with an optional header. Overrides expression, function, and polar flags.
- --output <file-path>     Optional path to write SVG file; defaults to stdout.

Examples:

npm run start -- --data-file data.json --output dataset.svg
npm run start -- --data-file measurements.csv

# Source File Changes

Modify src/lib/main.js to:
1 Recognize the --data-file flag when parsing CLI arguments and ignore other plot flags
2 Read the specified file with fs and determine format by extension
3 For JSON files parse content as JSON and validate presence of numeric x and y fields in each entry
4 For CSV files split content into lines, skip header if present, parse each line by comma into numeric x and y values
5 Build an array of points from parsed values; on parse error exit with code 1
6 Generate an SVG path connecting the data points similar to function plotting
7 Adjust viewBox to fit the extent of x and y values
8 Write SVG string to stdout or to the specified output file
9 Exit with code 0 on success

# Tests

Add sandbox/tests/data-plot.test.js with tests that:
- Invoke main with a JSON file containing a simple array of points and assert output includes valid <svg> tags and correct path coordinates based on sample data
- Invoke main with a CSV file containing header and data lines and verify behavior is identical to JSON input
- Test invalid JSON syntax and missing fields result in exit code 1 and error message
- Test invalid CSV format (non-numeric values) results in exit code 1 and error

# Documentation

Update README.md to:
- Document the new --data-file flag and its supported file formats
- Provide examples of JSON and CSV inputs and corresponding CLI commands
- Note that this feature uses built in parsing and requires no extra dependencies