# plot-code-lib

_"Be a go-to plot library with a CLI, be the jq of formulae visualisations."_

A JavaScript library and CLI tool for generating mathematical plots from expressions. Transform mathematical expressions into beautiful SVG visualizations with simple commands.

## Features

- 🧮 **Mathematical Expression Parser**: Support for variables, functions (sin, cos, tan, log, exp, sqrt, abs), and complex expressions
- 📊 **Time Series Generation**: Convert mathematical expressions into data points over specified ranges  
- 🎨 **SVG Plot Rendering**: Generate high-quality scalable vector graphics plots with grids, axes, and labels
- 🖥️ **Command Line Interface**: Simple CLI for generating plots from the terminal
- 📈 **Multiple Output Formats**: SVG implemented, PNG in development
- 🎯 **High Precision**: Built-in mathematical function library with proper operator precedence

## Quick Start

Generate a sine wave plot:
```bash
node src/lib/main.js --expr "sin(x)" --range "-3.14:3.14" --output sine_wave.svg
```

## Installation

```bash
npm install plot-code-lib
```

## Usage

### Command Line Interface

Generate plots directly from the command line:

```bash
# Basic sine wave
node src/lib/main.js --expr "sin(x)" --range "-3.14:3.14" --output sine.svg

# Quadratic function  
node src/lib/main.js --expr "x^2" --range "-3:3" --output parabola.svg

# Logarithmic function
node src/lib/main.js --expr "log(x)" --range "0.1:10" --output logarithm.svg

# Complex trigonometric expression
node src/lib/main.js --expr "sin(x) + cos(2*x)" --range "0:6.28" --output complex_trig.svg
```

### CLI Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `--expr` | Mathematical expression | Required | `"sin(x)"`, `"x^2 + 2*x + 1"` |
| `--range` | Range for x values | `"-5:5"` | `"-1:1"`, `"0:10"` |
| `--output` | Output file name | `"plot.svg"` | `"my_plot.svg"` |
| `--format` | Output format | `"svg"` | `"svg"`, `"png"` (png in development) |
| `--steps` | Number of data points | `200` | `100`, `500` |

### Library API

```javascript
import { 
  parseExpression, 
  evaluateExpression, 
  generateTimeSeries, 
  createSVGPlot 
} from 'plot-code-lib';

// Parse and evaluate expressions
const result = evaluateExpression("2 + 3 * 4"); // Returns 14
const withVariables = evaluateExpression("x^2 + y", { x: 3, y: 1 }); // Returns 10

// Generate time series data
const points = generateTimeSeries("sin(x)", -Math.PI, Math.PI, 100);
// Returns array of {x, y} points

// Create SVG plot
const svg = createSVGPlot(points, {
  title: 'Sine Wave',
  width: 800,
  height: 600
});
```

## Supported Mathematical Functions

- **Basic Operators**: `+`, `-`, `*`, `/`, `^` (exponentiation)
- **Trigonometric**: `sin(x)`, `cos(x)`, `tan(x)`
- **Logarithmic**: `log(x)`, `ln(x)`, `exp(x)`
- **Other**: `sqrt(x)`, `abs(x)`, `floor(x)`, `ceil(x)`, `round(x)`
- **Parentheses**: Full support for grouping and precedence

## Expression Examples

```javascript
// Linear functions
"x"                    // Identity function
"2*x + 1"             // Linear with slope 2, intercept 1

// Polynomial functions  
"x^2"                  // Quadratic parabola
"x^3 - 2*x^2 + x"     // Cubic polynomial

// Trigonometric functions
"sin(x)"               // Basic sine wave
"2 * sin(x) + 1"      // Amplitude 2, shifted up by 1
"sin(2*x)"            // Frequency doubled
"sin(x) + cos(x)"     // Sum of sine and cosine

// Exponential and logarithmic
"exp(x)"              // Natural exponential
"log(x)"              // Natural logarithm  
"2^x"                 // Powers of 2

// Complex expressions
"sqrt(x^2 + 1)"       // Hyperbola
"abs(sin(x))"         // Absolute value of sine
"x * sin(10*x)"       // Oscillating function with envelope
```

## Generated Plot Examples

The CLI generates publication-ready SVG plots with:
- ✅ Automatic axis scaling and labeling
- ✅ Grid lines for easy reading
- ✅ Professional typography  
- ✅ Configurable dimensions and styling
- ✅ Mathematical expression as title

### Example Commands and Output

```bash
# Sine wave over 2π range
node src/lib/main.js --expr "sin(x)" --range "-3.14:3.14"
# ✓ Generated 200 data points over range [-3.14, 3.14] 
# ✓ SVG plot saved to: plot.svg

# Parabola with custom output name
node src/lib/main.js --expr "x^2" --range "-2:2" --output parabola.svg  
# ✓ Generated 200 data points over range [-2.00, 2.00]
# ✓ Y range: [0.00, 4.00]

# Logarithm function
node src/lib/main.js --expr "log(x)" --range "0.1:10"
# ✓ Generated 200 data points over range [0.10, 10.00]  
# ✓ Y range: [-2.30, 2.30]
```

## Development

Run tests:
```bash
npm test                # Run all tests
npm run test:watch     # Watch mode for development  
npm run test:unit      # Run with coverage
```

Build and test:
```bash
npm run build          # Validate build
npm start              # Show CLI help
```

## More Examples

Generate various mathematical plots:

```bash
# Trigonometric functions
node src/lib/main.js --expr "sin(x)" --range "-6.28:6.28" --output sin_2pi.svg
node src/lib/main.js --expr "cos(x)" --range "-6.28:6.28" --output cos_2pi.svg
node src/lib/main.js --expr "tan(x)" --range "-1.5:1.5" --output tan_limited.svg

# Polynomial functions
node src/lib/main.js --expr "x^2" --range "-3:3" --output quadratic.svg
node src/lib/main.js --expr "x^3 - 3*x" --range "-2:2" --output cubic.svg

# Exponential and logarithmic  
node src/lib/main.js --expr "exp(x)" --range "-2:2" --output exponential.svg
node src/lib/main.js --expr "log(x)" --range "0.1:10" --output natural_log.svg

# Complex and interesting functions
node src/lib/main.js --expr "x * sin(10*x)" --range "-1:1" --output oscillating.svg
node src/lib/main.js --expr "exp(-x^2)" --range "-3:3" --output gaussian.svg
node src/lib/main.js --expr "sin(x)/x" --range "-10:10" --output sinc.svg
```

## Current Status

✅ **Fully Implemented:**
- Mathematical expression parser with full operator precedence
- Support for all basic mathematical functions and operators
- Time series data generation with configurable precision
- **SVG plot rendering with professional styling**
- **Command line interface with comprehensive options**
- **File output and error handling**  
- Comprehensive test suite with 23 passing tests

🚧 **In Development:**
- PNG export functionality
- Advanced plotting options (custom colors, multiple series)
- Interactive plot features

## Architecture

- **Expression Parser**: Tokenizer → AST → Evaluator pipeline
- **Time Series Generator**: Configurable range and step processing  
- **SVG Renderer**: Scalable plots with automatic scaling and labeling
- **CLI Interface**: Argument parsing with validation and help

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**plot-code-lib** - Transform mathematical expressions into beautiful plots with ease.