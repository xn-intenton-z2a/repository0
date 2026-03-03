# plot-code-lib

_"Be a go-to plot library with a CLI, be the jq of formulae visualisations."_

A JavaScript library and CLI tool for generating mathematical plots from expressions. Transform mathematical expressions into beautiful visualizations with simple commands.

## Features

- 🧮 **Mathematical Expression Parser**: Support for variables, functions (sin, cos, tan, log, exp, sqrt, abs), and complex expressions
- 📊 **Time Series Generation**: Convert mathematical expressions into data points over specified ranges
- 🖥️ **Command Line Interface**: Simple CLI for generating plots from the terminal
- 📈 **Multiple Output Formats**: SVG and PNG support (SVG implemented, PNG in development)
- 🎯 **High Precision**: Built-in mathematical function library with proper operator precedence

## Installation

```bash
npm install plot-code-lib
```

## Usage

### Command Line Interface

Generate plots directly from the command line:

```bash
# Basic sine wave
node src/lib/main.js --expr "sin(x)" --range "-3.14:3.14"

# Quadratic function
node src/lib/main.js --expr "x^2 + 2*x + 1" --range "-3:3"

# Logarithmic function
node src/lib/main.js --expr "log(x)" --range "0.1:10"

# Complex expression with multiple functions
node src/lib/main.js --expr "sin(x) + cos(x)" --range "-6:6"
```

### CLI Options

| Option | Description | Example |
|--------|-------------|---------|
| `--expr` | Mathematical expression | `"sin(x)"`, `"x^2 + 2*x + 1"` |
| `--range` | Range for x values | `"-1:1"`, `"0:10:0.1"` |
| `--output` | Output file name | `"plot.svg"`, `"graph.png"` |
| `--format` | Output format (svg/png) | `"svg"`, `"png"` |

### Library API

```javascript
import { parseExpression, evaluateExpression, generateTimeSeries } from 'plot-code-lib';

// Parse and evaluate expressions
const result = evaluateExpression("2 + 3 * 4"); // Returns 14
const withVariables = evaluateExpression("x^2 + y", { x: 3, y: 1 }); // Returns 10

// Generate time series data
const points = generateTimeSeries("sin(x)", -Math.PI, Math.PI, 100);
// Returns array of {x, y} points
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
"x^2"                  // Quadratic
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
"x * sin(1/x)"        // Oscillating function
```

## Range Specifications

- **Simple range**: `"0:10"` (from 0 to 10)
- **With step**: `"0:10:0.5"` (from 0 to 10 in steps of 0.5)
- **Negative ranges**: `"-5:5"` (from -5 to 5)
- **Fractional**: `"-3.14:3.14:0.1"` (pi range with small steps)

## Development

Run tests:
```bash
npm test
npm run test:watch  # Watch mode for development
```

Run with coverage:
```bash
npm run test:unit
```

## Examples

Generate various mathematical plots:

```bash
# Trigonometric functions
node src/lib/main.js --expr "sin(x)" --range "-6.28:6.28"
node src/lib/main.js --expr "cos(x)" --range "-6.28:6.28" 
node src/lib/main.js --expr "tan(x)" --range "-1.5:1.5"

# Polynomial functions
node src/lib/main.js --expr "x^2" --range "-3:3"
node src/lib/main.js --expr "x^3 - 3*x" --range "-2:2"

# Exponential and logarithmic
node src/lib/main.js --expr "exp(x)" --range "-2:2"
node src/lib/main.js --expr "log(x)" --range "0.1:10"

# Complex expressions
node src/lib/main.js --expr "x * sin(10*x)" --range "-1:1"
node src/lib/main.js --expr "exp(-x^2)" --range "-3:3"  # Gaussian
```

## Current Status

✅ **Implemented Features:**
- Mathematical expression parser with full operator precedence
- Support for all basic mathematical functions
- Time series data generation
- Command line interface with argument parsing
- Comprehensive error handling and validation

🚧 **In Development:**
- SVG plot rendering and file output
- PNG export functionality  
- Advanced plotting options (colors, labels, multiple series)
- Interactive plot features

## Roadmap

- [ ] SVG plot rendering engine
- [ ] PNG export via SVG conversion
- [ ] Multi-series plotting support
- [ ] Custom styling and theming
- [ ] Interactive web-based plotting
- [ ] Additional mathematical functions
- [ ] Performance optimizations for large datasets

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**plot-code-lib** - Transform mathematical expressions into beautiful plots with ease.