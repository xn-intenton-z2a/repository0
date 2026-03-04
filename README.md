# plot-code-lib

plot-code-lib is a small library and CLI for generating simple plots from mathematical expressions.

Usage examples:

- Generate an SVG to stdout:

  node src/lib/main.js --run -e "y=sin(x)" -r "-3.1416:3.1416" --points 200

- Save an SVG to a file:

  node src/lib/main.js --run -e "sin(x)" -r "-6.28:6.28" -f examples/sin.svg --width 800 --height 400 --stroke "#0077cc"

The library exposes functions for parsing arguments, building an evaluator, generating a time series and rendering SVG.
