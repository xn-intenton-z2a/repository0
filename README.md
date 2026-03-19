# Plot Code Library

A JavaScript library and CLI tool for generating plots from mathematical expressions and time series data. Produces SVG and PNG output files.

## Features

- **Expression Parser**: Parse mathematical expressions using JavaScript `Math` functions (e.g., `"y=Math.sin(x)"`, `"y=x*x+2*x-1"`)
- **Range Evaluation**: Evaluate expressions over numeric ranges with configurable step sizes (`start:step:end`)
- **CSV Data Loading**: Load time series data from CSV files with `time,value` columns
- **SVG Rendering**: Generate scalable vector graphics with polyline elements and viewBox attributes
- **PNG Output**: Create bitmap images using HTML5 Canvas (Node.js only)
- **File Saving**: Save plots to files with automatic format detection (`.svg` or `.png`)
- **CLI Interface**: Full command-line interface for batch processing and automation
- **Web Interface**: Interactive website demonstrating all library features

## Installation

```bash
npm install
```

## CLI Usage

### Generate plots from mathematical expressions:

```bash
# Sine wave plot
node src/lib/main.js --expression "y=Math.sin(x)" --range "-6.28:0.1:6.28" --file sine.svg

# Parabola plot
node src/lib/main.js --expression "y=x*x-4*x+3" --range "-2:0.1:6" --file parabola.png

# Cosine with custom range
node src/lib/main.js --expression "Math.cos(x)" --range "0:0.05:12.57" --file cosine.svg
```

### Plot time series data from CSV files:

```bash
# Create sample CSV data
echo "time,value
0,1
1,4
2,9
3,16
4,25" > data.csv

# Generate plot from CSV
node src/lib/main.js --csv data.csv --file data.png
```

### CLI Options:

- `--expression EXPR` - Mathematical expression (e.g., `"y=Math.sin(x)"`)
- `--range START:STEP:END` - Range to evaluate expression over (e.g., `"-3.14:0.01:3.14"`)
- `--csv FILE` - Load time series data from CSV file
- `--file OUTPUT` - Output file path (`.svg` or `.png`)
- `--help` - Show help message with examples
- `--version` - Show version number
- `--identity` - Show library identity JSON

## Library API

### Expression Parsing

```javascript
import { parseExpression, evaluateRange } from './src/lib/main.js';

// Parse mathematical expression
const func = parseExpression("y=Math.sin(x)");
console.log(func(Math.PI/2)); // 1

// Evaluate over range
const points = evaluateRange(func, "-3.14:0.1:3.14");
console.log(points.length); // ~63 data points
console.log(points[0]); // { x: -3.14, y: Math.sin(-3.14) }
```

### CSV Data Loading

```javascript
import { loadCSV } from './src/lib/main.js';

// Load time series data
const points = await loadCSV('data.csv');
console.log(points); // [{ x: 0, y: 1 }, { x: 1, y: 4 }, ...]
```

### Rendering and File Output

```javascript
import { renderSVG, renderPNG, savePlot } from './src/lib/main.js';

const points = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 4 }
];

// Generate SVG
const svg = renderSVG(points);
console.log(svg); // SVG XML with <polyline> and viewBox

// Generate PNG (Node.js only)
const pngBuffer = await renderPNG(points);
console.log(pngBuffer[0]); // 0x89 (PNG magic byte)

// Save to file (format auto-detected)
await savePlot(points, 'output.svg');
await savePlot(points, 'output.png');
```

## Web Interface

Start the development server to try the interactive demos:

```bash
npm start
```

The website showcases:
- **Mathematical Expression Plotting**: Interactive demo with configurable expressions and ranges
- **CSV Time Series Visualization**: Upload and plot CSV data in real-time
- **CLI Examples**: Complete command-line usage documentation
- **Feature Overview**: Comprehensive list of all library capabilities

## Testing

Run the complete test suite:

```bash
# Unit tests with coverage
npm test

# Unit tests only
npm run test:unit

# Behaviour tests (requires website running)
npm run test:behaviour
```

### Test Coverage

The test suite includes:

**Unit Tests (`tests/unit/main.test.js`)**:
- ✅ Expression parser: parsing `"y=Math.sin(x)"` returns a callable function
- ✅ Series generation: evaluating range `"-3.14:0.01:3.14"` returns ~628 data points
- ✅ CSV loader: loads `time,value` CSV into a numeric series
- ✅ SVG output: generated SVG contains `<polyline>` element and `viewBox` attribute
- ✅ PNG output: generated PNG files start with PNG magic bytes (`\x89PNG`)
- ✅ CLI interface: `--expression`/`--range`/`--csv`/`--file` flags produce files; `--help` prints usage

**Web Tests (`tests/unit/web.test.js`)**:
- Website structure and library integration
- Demo functionality verification
- Error handling validation

**Behaviour Tests (`tests/behaviour/homepage.test.js`)**:
- End-to-end website functionality
- Library version consistency
- Visual regression testing

## Sample Output

### Mathematical Expression Plot (SVG)
Plotting `y=Math.sin(x)` over range `-6.28:0.1:6.28` produces a smooth sine wave with:
- 126 data points
- SVG viewBox scaled to data bounds
- Blue polyline stroke on white background
- Proper XML declaration and namespace

### Time Series Plot (PNG)
CSV data with exponential growth pattern renders as:
- Canvas-based bitmap image
- PNG format with proper magic bytes
- Scaled axes fitting data range
- Anti-aliased line rendering

### CLI Output Examples

```bash
$ node src/lib/main.js --expression "Math.sin(x)" --range "0:0.5:6" --file sine.svg
Plot saved to sine.svg

$ node src/lib/main.js --csv timeseries.csv --file data.png  
Plot saved to data.png

$ node src/lib/main.js --help
Usage: repo

Generate plots from mathematical expressions or CSV data:
[...complete usage documentation...]
```

## Browser Compatibility

The library works in:
- **Node.js**: Full functionality including file I/O and PNG rendering
- **Browsers**: Expression parsing, SVG rendering, and CSV processing (no file I/O)

PNG rendering requires the Node.js `canvas` package and is not available in browsers.

## Requirements

- **Node.js**: >=24.0.0
- **Dependencies**: 
  - `canvas` (for PNG rendering)
  - Standard library only for core functionality

## License

MIT License - see LICENSE file for details.

## Mission Statement

This library demonstrates autonomous code generation capabilities while providing practical plotting functionality for mathematical visualization and data analysis. It serves as a template for building feature-complete JavaScript libraries with comprehensive testing, documentation, and both programmatic and command-line interfaces.