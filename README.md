# plot-code-lib

plot-code-lib is a small library and CLI for generating plots from mathematical expressions. It aims to be a lightweight "jq of formulae visualisations": take a formula, sample it over a range and emit a plot (SVG by default).

Quick example

  node src/lib/main.js --expression "sin(x)" --range "-6.28:6.28" --file examples/sin.svg

This will write an SVG named `examples/sin.svg` (created by the library). The CLI supports:

- --expression, -e  Expression to plot (e.g. "sin(x)")
- --range, -r       Range for x as "min:max" (default -10:10)
- --points          Number of sample points (default 200)
- --width           Output width in pixels (default 800)
- --height          Output height in pixels (default 400)
- --file, -f        Output filename (SVG). If omitted, SVG is printed to stdout.

See docs/CLI_INTERFACE.md and features/ for more on expression parsing, sampling and SVG generation.
