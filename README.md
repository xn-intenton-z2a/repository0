# plot-code-lib

plot-code-lib is a small library and CLI for generating simple plots from mathematical expressions.

Usage examples:

- Generate an SVG and save to file:

  node src/lib/main.js --expression "y=sin(x)" --range "-6.28:6.28" --points 200 --file examples/sin.svg --width 800 --height 400 --stroke "#0077cc"

- Quick sample (smaller image):

  node src/lib/main.js -e "sin(x)" -r "-3.14:3.14" -f examples/sin-small.svg --width 400 --height 200

The library exposes functions for parsing arguments, building an evaluator, generating a time series and rendering SVG.

See tests in tests/unit for examples of using the library programmatically.
