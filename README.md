# plot-code-lib

_"Be a go-to plot library with a CLI, be the jq of formulae visualisations."_

A JavaScript library and CLI tool for generating plots from mathematical expressions. Transform mathematical formulae into beautiful SVG visualizations with a simple command-line interface.

## Features

✅ **Mathematical Expression Parser** - Parse and evaluate complex mathematical expressions using industry-standard mathjs  
✅ **Time Series Generation** - Convert expressions to data points with configurable ranges and precision  
✅ **SVG Plot Generation** - Create publication-ready SVG plots with customizable styling  
✅ **CLI Interface** - Easy-to-use command-line tool with comprehensive options  
✅ **Flexible Input Formats** - Support for both `f(x)` and `y = f(x)` expression formats  
✅ **Range Parsing** - Intuitive range specification with formats like `-10:10` or `x=-5:5`  

## Quick Start

### Installation

```bash
npm install @xn-intenton-z2a/plot-code-lib
```

### Basic Usage

```bash
# Generate a sine wave plot
node src/lib/main.js --expression "sin(x)" --range "-10:10" --file sine.svg

# Plot a quadratic function  
node src/lib/main.js "y=x^2" -r "-5:5" -f parabola.svg

# Complex expressions work too
node src/lib/main.js "sin(x) + cos(x)" -r "-2*pi:2*pi" --steps 200
```

## CLI Reference

### Basic Syntax
```bash
node src/lib/main.js [OPTIONS] [EXPRESSION]
```

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--expression` | `-e` | Mathematical expression (e.g., "sin(x)", "y=cos(x)") | - |
| `--range` | `-r` | Range for variable (e.g., "-10:10", "x=-5:5") | "-10:10" |
| `--file` | `-f` | Output file path | "output.svg" |
| `--steps` | `-s` | Number of data points | 100 |
| `--width` | - | Plot width in pixels | 800 |
| `--height` | - | Plot height in pixels | 600 |
| `--help` | `-h` | Show help information | - |

### Expression Formats

The parser supports flexible expression formats:

```bash
# Function notation
node src/lib/main.js "sin(x)"

# Equation notation  
node src/lib/main.js "y = cos(x)"

# Complex expressions
node src/lib/main.js "sin(x) * cos(x)"
node src/lib/main.js "x^2 + 2*x + 1" 
node src/lib/main.js "log(x)"
node src/lib/main.js "sqrt(x)"
```

### Range Formats

```bash
# Simple range
--range "-5:5"

# With variable prefix
--range "x=-10:10"

# Different ranges
--range "-pi:pi"    # Symbolic constants work
--range "0:100"     # Positive ranges
--range "-1:1"      # Small ranges
```

## Examples

### Basic Functions

```bash
# Sine wave
node src/lib/main.js --expression "sin(x)" --range "-2*pi:2*pi" --file sine.svg

# Cosine wave
node src/lib/main.js --expression "cos(x)" --range "-2*pi:2*pi" --file cosine.svg

# Tangent (with limited range to avoid discontinuities)
node src/lib/main.js --expression "tan(x)" --range "-pi/4:pi/4" --file tangent.svg
```

### Polynomial Functions

```bash
# Quadratic
node src/lib/main.js "x^2" -r "-5:5" -f quadratic.svg

# Cubic  
node src/lib/main.js "x^3 - 3*x" -r "-3:3" -f cubic.svg

# Higher order polynomial
node src/lib/main.js "x^4 - 4*x^2 + 2" -r "-3:3" -f quartic.svg
```

### Logarithmic and Exponential

```bash
# Natural logarithm
node src/lib/main.js "log(x)" -r "0.1:10" -f logarithm.svg

# Exponential
node src/lib/main.js "exp(x)" -r "-3:3" -f exponential.svg

# Square root
node src/lib/main.js "sqrt(x)" -r "0:25" -f sqrt.svg
```

### Combined Functions

```bash
# Damped oscillation
node src/lib/main.js "exp(-x/5) * sin(x)" -r "0:20" -f damped.svg

# Wave interference
node src/lib/main.js "sin(x) + sin(2*x)" -r "-pi:pi" -f interference.svg

# Gaussian-like curve
node src/lib/main.js "exp(-x^2)" -r "-3:3" -f gaussian.svg
```

## Library Usage

### Expression Parser

```javascript
import { ExpressionParser } from '@xn-intenton-z2a/plot-code-lib';

const parser = new ExpressionParser();

// Parse an expression
const parsed = parser.parse("sin(x)");
if (parsed.isValid) {
  console.log("Variable:", parsed.variable);
  
  // Evaluate at a point
  const result = parser.evaluate(parsed, Math.PI/2);  // Result: 1
  
  // Generate time series
  const data = parser.generateTimeSeries(parsed, { min: -10, max: 10, steps: 100 });
}
```

### SVG Plotter

```javascript
import { SVGPlotter } from '@xn-intenton-z2a/plot-code-lib';

const plotter = new SVGPlotter({ width: 800, height: 600 });
const data = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 4 }];

const svg = plotter.plot(data, {
  title: "My Function",
  xLabel: "x", 
  yLabel: "f(x)"
});

plotter.saveSVG(svg, "output.svg");
```

## Development

### Setup
```bash
git clone <repository-url>
cd plot-code-lib
npm install
```

### Testing
```bash
npm test           # Run all tests
npm run test:unit  # Unit tests with coverage  
```

### Building
```bash
npm run build      # Currently no build step needed
```

## Technical Details

### Dependencies

- **mathjs** - Mathematical expression parser and evaluator
- **d3** - SVG generation and scaling utilities  
- **vitest** - Testing framework

### Supported Functions

The expression parser supports all mathjs functions including:
- Trigonometric: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`
- Logarithmic: `log`, `log10`, `log2`, `ln`  
- Exponential: `exp`, `pow`, `sqrt`
- Hyperbolic: `sinh`, `cosh`, `tanh`
- Constants: `pi`, `e`, `i`
- Operators: `+`, `-`, `*`, `/`, `^`, `%`

### Output Formats

Currently supported:
- ✅ **SVG** - Scalable Vector Graphics (default)
- 🚧 **PNG** - Planned for future versions

## Mission Statement

**plot-code-lib** aims to be the go-to plotting library with CLI capabilities - "the jq of formulae visualisations." Our goal is to make mathematical visualization as simple and powerful as possible, supporting:

- Mathematical expression parsing using open standards
- Time series data generation and manipulation  
- Multiple output formats (SVG, PNG)
- Comprehensive CLI interface
- Library usage for programmatic integration

## Agentic Development

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. The system generates issues from the mission statement, writes code, runs tests, and opens pull requests automatically.

## License

MIT © 2025-2026 Polycode Limited

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.