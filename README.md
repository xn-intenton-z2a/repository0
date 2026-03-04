# plot-code-lib

plot-code-lib is a small library and CLI to generate plots from mathematical expressions.

## Features added

- Expression parsing and evaluation using mathjs
- Time-series generation across an x-range
- SVG plot generation (axes + polyline)
- CLI: --expression, --range, --file, --format
- Example SVG saved to examples/

Usage examples:

- Generate an SVG of sin(x):

  node src/lib/main.js --expression "y=sin(x)" --range "x=-3.14159:3.14159:400" --file examples/sin.svg --format svg

- Print SVG to stdout:

  node src/lib/main.js --expression "sin(x)" --range "x=-1:1:200"

The CLI supports:
- --expression (or --expr): mathematical expression, e.g. "y=sin(x)" or "sin(x)"
- --range: x=start:end[:count], e.g. "x=-1:1:200"
- --file: output file (SVG)
- --format: svg (png not implemented in this runtime)

Examples are saved to the examples/ directory.
