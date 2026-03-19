# repo

This repository provides a small plotting library and CLI for generating plots from mathematical expressions and CSV time series data.

Quick CLI examples:

- Plot a mathematical expression to SVG:

```
node src/lib/main.js --expression "y=Math.sin(x)" --range "-3.14:0.01:3.14" --file output.svg
```

- Load a CSV (time,value) and write PNG:

```
node src/lib/main.js --csv data.csv --file output.png
```

- Show help:

```
node src/lib/main.js --help
```

SVG rendering is implemented in pure JS and produces valid SVG 1.1 with a viewBox and a <polyline> element. PNG rendering rasterizes the polyline into a simple RGB bitmap and encodes a PNG file (Node.js required). The PNG implementation uses only Node's built-in modules (zlib) and a small CRC32 helper — no external native dependencies are required for the basic PNG output.

See `src/lib/main.js` for the exported API: parseExpression, generateSeriesFromRange, loadCSV, renderSVG, renderPNG, saveSeriesToFile, and main (CLI entry).
