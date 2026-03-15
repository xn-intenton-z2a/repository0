# repo — Plotting Library

This repository contains a small plotting library and CLI for generating SVG and PNG plots from mathematical expressions and time-series CSV data.

Features
- parseExpression("y=Math.sin(x)") → returns a callable function f(x)
- sampleRange("start:step:end") → numeric sampling
- sampleExpression(fn, range) → array of {x,y}
- loadCSV(path) → parse time,value CSV files
- renderSVG(points) → SVG 1.1 output with viewBox and <polyline>
- renderPNG(points) → PNG image bytes (pure JS rasterizer + PNG encoder)
- CLI: node src/lib/main.js --expression "y=Math.sin(x)" --range "-3.14:0.01:3.14" --file output.svg

PNG approach

To avoid native dependencies, PNG output is produced by a tiny pure-JavaScript rasterizer and PNG encoder using Node's built-in zlib for compression. This keeps the project dependency-free while emitting valid PNG files.

Examples

Generate an SVG from an expression:

```
node src/lib/main.js --expression "y=Math.sin(x)" --range "-3.14:0.01:3.14" --file out.svg
```

Convert a CSV to PNG:

```
node src/lib/main.js --csv data.csv --file chart.png
```

Development

Run unit tests:

```
npm ci && npm test
```

License: MIT
