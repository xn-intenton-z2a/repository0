# plot-code-lib (prototype)

A small library and CLI for generating plots from mathematical expressions.

Usage examples (CLI):

- Generate an SVG of y = sin(x) over 0..2π:

  node src/lib/main.js --expression "y=sin(x)" --range "x=0:6.283:0.01" --file examples/sin.svg --format svg

- Default output when --file is omitted: examples/plot.svg

Notes:
- Expressions accept common math functions (sin, cos, tan, abs, log, exp, sqrt) — they are mapped to Math.*.
- The range must be provided as x=start:end[:step]. If step is omitted a sensible default is chosen.
- Currently SVG output is generated. PNG support may be added in future releases.

Examples are written to the examples/ directory by default.
