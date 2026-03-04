# plot-code-lib

plot-code-lib is a small library and CLI for generating plots from mathematical expressions.

Features
- Parse simple expressions like `y=sin(x)`
- Generate time-series data over a numeric range
- Render a simple SVG plot and save to file via CLI

Quick CLI example

Generate a sine plot and save as SVG:

node src/lib/main.js --expression "y=sin(x)" --range "-3.14:3.14:0.1" --file examples/sin.svg --width 800 --height 400 --stroke "#007acc"

Options (examples):
- --expression, -e: expression to plot (e.g. "y=sin(x)")
- --range, -r: range, e.g. "-3.14:3.14:0.1" (start:stop:step) or "-1:1:50" (points)
- --file, -f: output file (default plot.svg)
- --width: image width in px (default 800)
- --height: image height in px (default 400)
- --stroke: line colour
- --bg: background colour

Programmatic API

The library exports helpers to parse expressions, build evaluators, generate time series, and render basic SVG output. See `src/lib/main.js` for details.

Examples directory

Put generated example plots in `examples/` (the repository includes this folder for demo artifacts).
