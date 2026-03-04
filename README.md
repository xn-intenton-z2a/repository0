# plot-code-lib

plot-code-lib is a small JavaScript library and CLI for generating plots from mathematical expressions.
It parses a simple expression (using mathjs), generates a time-series (x/y pairs) over a numeric range, and renders an SVG plot.

This repository provides a minimal, test-covered implementation and a CLI entrypoint.

## Features

- Parse mathematical expressions (e.g., `y=sin(x)` or `sin(x)`).
- Generate evenly spaced x values over a range and evaluate y.
- Produce an SVG plot with axes and a stroked path for the series.
- CLI to write SVG files or print SVG to stdout.

## CLI Usage

Run the CLI with node (or use `npm start`):

- Print SVG to stdout:

  node src/lib/main.js --expression "sin(x)"

- Write to a file (SVG only):

  node src/lib/main.js --expression "y=sin(x)" --range "x=0:6.283:200" --file examples/sin.svg --format svg

Options:
- --expression, --expr, -e  : Expression to plot (required). Accepts `y=...` or `...` (e.g., `y=sin(x)` or `sin(x)`).
- --range, -r               : Range in the form `x=start:end[:count]` (default `x=-1:1:200`).
- --file, -f                : Output filename (optional). If omitted, SVG is printed to stdout.
- --format, --type          : Output format (only `svg` supported in this version).
- --width/--height/--padding: Numeric layout options (defaults: width=800, height=400, padding=40).

## Examples

Generate a sine wave SVG:

  node src/lib/main.js --expression "y=sin(x)" --range "x=0:6.283:400" --file examples/sin.svg

Generate a straight line y=x and print SVG to terminal:

  node src/lib/main.js --expression "x" --range "x=-2:2:50"

## Notes

- This version only supports SVG output. PNG conversion can be added by rendering the SVG with a rasterizer (e.g., puppeteer or sharp + svg-to-png).
- The library uses mathjs for expression parsing and evaluation; arbitrary mathjs features are available in expressions.

## Development

Run tests:

  npm test

Contributions are welcome — see CONTRIBUTING.md for the project's guidelines.
