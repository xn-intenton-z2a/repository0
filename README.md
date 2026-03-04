# plot-code-lib

plot-code-lib is a small library and CLI for generating plots from mathematical expressions. It transforms a simple expression and a numeric range into a time-series and can render SVG plots. This repository implements a lightweight expression parser, a time-series generator, and an SVG renderer accessible from the command line.

Highlights
- Parse expressions like `y=sin(x)` or `sin(x)` and evaluate them safely using Math functions
- Specify ranges like `x=0:6.283:0.01` (start:stop:step) or `x=0:6.283`
- Generate SVG plot files from the CLI
- Examples are stored in the `docs/examples/` directory

Quick CLI examples

Generate an SVG of y = sin(x):

  node src/lib/main.js --expression "y=sin(x)" --range "x=0:6.283:0.01" --file docs/examples/sin.svg --points 1000

Generate an SVG of y = x^2 on range 0..1:

  node src/lib/main.js -e "y = x * x" -r "x=0:1:0.01" -f docs/examples/quad.svg --points 101

Notes on PNG output

This version produces SVG output; converting SVG to PNG is outside the scope of the lightweight runtime to avoid native dependencies. To obtain PNGs, use common tools such as `rsvg-convert`, `inkscape`, or `sharp` in your environment:

  rsvg-convert -o docs/examples/sin.png docs/examples/sin.svg

Examples

- `docs/examples/sin.svg` — Example sine wave produced by the library (included in this repository)

Development

- Run the unit tests:

  npm test

- Start the CLI directly:

  npm start -- --expression "y=sin(x)" --range "x=0:6.283" --file out.svg

Contributing

Follow the contributing guidelines in the repository for making changes. This project aims to be the jq of formula visualisations: small, scriptable, and composable.
