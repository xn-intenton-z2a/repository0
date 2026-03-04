# plot-code-lib

plot-code-lib is a small library and CLI for generating plots from mathematical expressions.

Features implemented in this milestone:
- Parse simple range syntax: x=start:end[:count]
- Parse simple expressions like `y=sin(x)` or `sin(x)` using mathjs
- Generate time-series points for x and y
- Produce SVG plots and save to a file via CLI

Usage examples:

- Generate an SVG of y = sin(x) from 0 to 2π:

  node src/lib/main.js --expression "y=sin(x)" --range "x=0:6.283185307:400" --file examples/sin.svg --format svg

- Print SVG to stdout:

  node src/lib/main.js --expression "sin(x)" --range "x=-3.14:3.14:200"

Notes:
- This version supports SVG output. PNG export may be added in a future release.

Run tests:

  npm test
