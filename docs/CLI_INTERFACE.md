# Command Line Interface

plot-code-lib provides a simple CLI to transform mathematical expressions into SVG plots.

Examples

- Generate an SVG file:
  node src/lib/main.js --expression "sin(x)" --range "-6.28:6.28" --file out.svg

- Pipe SVG to another tool:
  node src/lib/main.js -e "cos(x)" -r "-3.14:3.14" > cos.svg

Options

- --expression, -e : Expression to plot, e.g. "sin(x)" or "y=2*x+1".
- --range, -r : X range as "min:max" (default -10:10).
- --points : Number of sample points (default 200).
- --width / --height : Output dimensions for SVG (defaults 800x400).
- --file, -f : Output filename; prints to stdout if omitted.

Notes

- The expression engine supports common Math functions (sin, cos, tan, log, sqrt, etc.) and the ^ operator for powers.
- Only SVG output is supported by default. PNG conversion can be added with an external tool such as sharp.
