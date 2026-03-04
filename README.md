# plot-code-lib

plot-code-lib is a small JavaScript library and CLI for generating plots from mathematical expressions. It aims to be "the jq of formula visualisations": take a simple expression + range and produce time-series data and a visualisation (SVG/PNG).

This repository provides a minimal, usable CLI in `src/lib/main.js` that parses expressions like `y=sin(x)`, samples them across a numeric range and produces an SVG plot.

Quick features
- Parse simple mathematical expressions (supports ^ for power, common Math functions like sin/cos/log/exp)
- Specify range with `x=start:end[:step]` (defaults to ~200 samples)
- Generate SVG output (default) and write to file
- Simple programmatic API: import and call main(argv)

Install / run

Requirements: Node.js 24+ (uses ES modules)

Run the built-in test to validate basic SVG generation:

  npm test

CLI usage

The CLI supports the following options:
  --expression, --expr, --e   Expression to plot (e.g. "y=sin(x)")  [required]
  --range, --r                Range in the form x=start:end[:step] (default: x=0:6.283:0.1)
  --file, --o                 Output file path (defaults to examples/plot.svg)
  --format, --f               Output format (svg by default)
  --width, --w                Image width in pixels (default 800)
  --height, --h               Image height in pixels (default 400)

Examples

Generate an SVG for the sine function over 0..2π and write to examples/sin.svg:

  node src/lib/main.js --expression "y=sin(x)" --range "x=0:6.283:0.01" --file examples/sin.svg --format svg

Generate a plot for y = x^2 over -2..2:

  node src/lib/main.js --expression "y=x^2" --range "x=-2:2:0.01" --file examples/quad.svg

Use a plain expression (without the `y=`) — the CLI accepts `sin(x)` and `y=sin(x)` equally:

  node src/lib/main.js --expression "sin(x)" --range "x=0:6.283" --file examples/sin2.svg

Programmatic usage

Import and call main(argv) from code (used by the test harness):

```js
import { main } from './src/lib/main.js';
await main(['--expression','y=sin(x)','--range','x=0:6.283:0.01','--file','examples/sin.svg']);
```

How expressions are interpreted

- If the expression contains `=`, the RHS is used (e.g. `y=sin(x)` becomes `sin(x)`).
- `^` is translated to `**` for powers (e.g. `x^2` → `x**2`).
- Common math functions are prefixed with `Math.` automatically (sin,cos,tan,abs,log,exp,sqrt,min,max,pow,floor,ceil, etc.).
- The evaluator creates a Function('x', `return (${expr});`) and is used to compute numeric values for each sample.

Output

By default, the CLI produces a simple SVG containing axes and a stroked path representing the sampled points. The file written is an SVG string; future work can extend PNG output by rasterizing the SVG with a rendering backend.

Testing

A basic unit test exists at `tests/unit/main.test.js` and a simple runner `npm test` that executes a smoke test which generates an SVG and validates it contains `<svg>` and `<path>`.

Contributing

See CONTRIBUTING.md for contribution guidelines. Keep changes minimal and aligned with the mission: make the library a small, dependable tool for turning expressions into visuals.

Mission alignment

This change completes the core CLI path for expression -> time series -> SVG output, enabling the repository to act as a baseline plot generation tool. Subsequent work should add richer parsing (named variables, multiple series), PNG export, and better axis/grid annotations.
