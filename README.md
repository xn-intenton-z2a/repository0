# plot-code-lib

> **"Be a go-to plot library with a CLI, be the jq of formulae visualisations."**

A JavaScript library and CLI tool for transforming mathematical expressions into plots. Generate SVG visualizations from mathematical formulas with a simple command-line interface.

## Features

- ✅ **Mathematical Expression Parsing** - Parse and evaluate complex mathematical expressions using mathjs
- ✅ **Time Series Generation** - Generate data points from expressions over specified ranges  
- ✅ **SVG Plot Output** - Create publication-ready SVG plots with axes, grids, and labels
- ✅ **CLI Interface** - Easy-to-use command-line interface for quick plotting
- ✅ **Flexible Input** - Support for expressions like `y=sin(x)`, `cos(x)`, `x^2`, etc.
- ✅ **Customizable Ranges** - Specify custom ranges for variables

## Installation

```bash
npm install @xn-intenton-z2a/plot-code-lib
```

## CLI Usage

### Basic Plotting

```bash
# Generate a sine wave
npx plot-code-lib plot --expression "y=sin(x)" --range "x=-10:10" --file sine.svg

# Generate a cosine wave  
npx plot-code-lib plot --expression "cos(x)" --range "x=-6.28:6.28" --file cosine.svg

# Generate a quadratic function
npx plot-code-lib plot --expression "x^2" --range "x=-5:5" --file quadratic.svg

# Generate a complex expression
npx plot-code-lib plot --expression "sin(x) * cos(x/2)" --range "x=-12:12" --file complex.svg
```

### Command Options

```bash
plot-code-lib plot [options]

Options:
  -e, --expression <expr>  Mathematical expression (default: "y=sin(x)")
  -r, --range <range>      Variable ranges (default: "x=-10:10,y=-5:5") 
  -f, --file <path>        Output file path (default: "output.svg")
  -s, --steps <number>     Number of calculation steps (default: "100")
  -t, --title <title>      Plot title
```

### Example Commands

```bash
# Show all example commands
npx plot-code-lib examples
```

## Library Usage

```javascript
import { parseRange, generateTimeSeries, generateSVGPlot } from '@xn-intenton-z2a/plot-code-lib';

// Parse range specification
const ranges = parseRange('x=-10:10');
// Result: { x: { min: -10, max: 10 } }

// Generate time series data
const points = generateTimeSeries('y=sin(x)', ranges, 100);
// Result: [{ x: -10, y: 0.544 }, { x: -9.8, y: 0.427 }, ...]

// Generate SVG plot
const svg = generateSVGPlot(points, {
  title: 'Sine Wave',
  width: 800,
  height: 600,
  strokeColor: '#2563eb'
});

// Write to file
import { writeFileSync } from 'fs';
writeFileSync('plot.svg', svg);
```

## Supported Mathematical Functions

Thanks to [mathjs](https://mathjs.org/), plot-code-lib supports a wide range of mathematical functions:

- **Trigonometric**: `sin(x)`, `cos(x)`, `tan(x)`, `asin(x)`, `acos(x)`, `atan(x)`
- **Hyperbolic**: `sinh(x)`, `cosh(x)`, `tanh(x)`  
- **Logarithmic**: `log(x)`, `log10(x)`, `ln(x)`
- **Exponential**: `exp(x)`, `pow(x, y)`, `sqrt(x)`
- **Algebraic**: `x^2`, `x^3`, `x + 5`, `2*x - 1`
- **Complex**: `sin(x) * cos(x/2)`, `exp(-x^2/2)`, `x^3 - 3*x + 1`

## Expression Formats

### With Variable Assignment
```bash
--expression "y=sin(x)"     # Explicit y= assignment
--expression "f=x^2 + 2*x"  # Custom function name
```

### Direct Expressions  
```bash
--expression "sin(x)"       # Direct expression (y assumed)
--expression "x^2"          # Simple polynomial
--expression "cos(x)*sin(x)" # Product of functions
```

## Range Specifications

```bash
--range "x=-5:5"           # Single variable range
--range "x=-10:10,y=-5:5"  # Multiple variables (y range for display)
--range "t=0:6.28"         # Custom variable name
```

## Examples Output

The repository includes several example plots in the `examples/` directory:

- `sine.svg` - Sine wave from -2π to 2π
- `cosine.svg` - Cosine wave from -2π to 2π  
- `quadratic.svg` - Quadratic function x² from -5 to 5
- `complex.svg` - Complex expression sin(x) * cos(x/2)

## API Reference

### `parseRange(rangeStr)`
Parse a range string into an object with min/max values.

**Parameters:**
- `rangeStr` (string): Range specification like "x=-10:10,y=-5:5"

**Returns:** Object with variable names as keys and `{min, max}` objects as values

### `generateTimeSeries(expression, ranges, steps)`
Generate time series data from a mathematical expression.

**Parameters:**
- `expression` (string): Mathematical expression
- `ranges` (object): Range object from parseRange()  
- `steps` (number): Number of data points to generate (default: 100)

**Returns:** Array of `{x, y}` coordinate objects

### `generateSVGPlot(points, options)`
Generate an SVG plot from time series data.

**Parameters:**
- `points` (array): Array of `{x, y}` coordinate objects
- `options` (object): Plot configuration options

**Options:**
```javascript
{
  width: 800,              // SVG width in pixels
  height: 600,             // SVG height in pixels  
  title: 'Mathematical Plot', // Plot title
  strokeColor: '#2563eb',  // Line color
  strokeWidth: 2,          // Line width  
  backgroundColor: '#ffffff', // Background color
  margin: {                // Plot margins
    top: 40, 
    right: 40, 
    bottom: 60, 
    left: 60
  }
}
```

**Returns:** SVG content as string

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run with coverage
npm run test:unit

# Start development
npm start -- plot --expression "sin(x)" --file test.svg
```

## Powered by Intentïon Agentic-Lib

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. The core functionality was implemented through autonomous workflows based on the mission statement.

## License

MIT

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.
