# plot-code-lib

A small CLI to generate plots from mathematical expressions into SVG or PNG.

Usage

  node src/lib/main.js --expression "y=sin(x)" --range "x=-3.14:3.14:p200" --file out.svg [options]

Options

  --expression, -e   Expression, e.g. "y=sin(x)" or "sin(x)"
  --range, -r        Range, e.g. "x=0:6.28:p200" (pN sets point count) or "x=0:10:0.1" (step)
  --file, -f         Output file path
  --format           svg or png (default: svg)
  --width            Image width in pixels (default: 800)
  --height           Image height in pixels (default: 400)
  --bg               Background color (default: white)
  --stroke           Stroke color for lines (default: black)
  --fill             Fill color for shapes (default: none)
  --stroke-width     Stroke width in pixels

Examples

  # Generate an SVG of y = sin(x) from -π to π with 200 points
  node src/lib/main.js \
    --expression "y=sin(x)" \
    --range "x=-3.14159:3.14159:p200" \
    --file examples/sine.svg \
    --format svg \
    --width 800 --height 400 \
    --bg white --stroke black --fill none

  # Generate a PNG with thicker stroke
  node src/lib/main.js \
    --expression "y=sin(x)" \
    --range "x=-3.14159:3.14159:p400" \
    --file out.png --format png --width 1200 --height 600 \
    --bg white --stroke "#007ACC" --stroke-width 2 --fill none

Included examples

  The file examples/sine.svg demonstrates the SVG output created by the CLI.

