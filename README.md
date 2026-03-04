# plot-code-lib

plot-code-lib is a small library and CLI to generate plots from mathematical expressions.

Examples:

- Generate an SVG of y = sin(x):

  node src/lib/main.js --expression "y=sin(x)" --range "x=-3.14:3.14:p200" --file out.svg --format svg --width 800 --height 400 --bg white --stroke black --fill none

- Generate a PNG instead of SVG:

  node src/lib/main.js --expression "y=sin(x)" --range "x=-3.14:3.14:p200" --file out.png --format png --width 1024 --height 512 --bg white --stroke #007ACC --fill none --stroke-width 2

The CLI accepts:

--expression | -e   : expression like "y=sin(x)" or "sin(x)"
--range      | -r   : range like "x=0:6.28:p200" (pN sets point count) or "x=0:10:0.1" (step)
--file       | -f   : output file path
--format           : svg or png (defaults to svg)
--width --height   : image size
--bg --stroke --fill --stroke-width : styling options

This repository includes unit tests for parser, SVG generation and PNG conversion.
