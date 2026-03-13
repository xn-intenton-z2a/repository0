# plot-code-lib

_"Be a go-to plot library with a CLI, be the jq of formulae visualisations"_

A JavaScript library and CLI tool for generating mathematical plots from expressions. Transform formulas like `y=sin(x)` into publication-ready SVG and PNG visualizations with a simple command-line interface.

[![Tests](https://github.com/xn-intenton-z2a/repository0/actions/workflows/agentic-lib-test.yml/badge.svg)](https://github.com/xn-intenton-z2a/repository0/actions/workflows/agentic-lib-test.yml)

## ✨ Features

- **Mathematical Expression Parser**: Parse expressions with standard syntax using Math.js
- **Time Series Data Generation**: Generate coordinate data with configurable ranges and step sizes
- **Professional Plot Rendering**: Create SVG and PNG plots with axes, labels, and auto-scaling
- **Command-Line Interface**: Full CLI with intuitive flags and helpful error messages
- **Browser and Node.js Support**: Works in both environments with proper dependency handling

## 🚀 Quick Start

### Installation

```bash
npm install plot-code-lib
```

### Basic Usage

```bash
# Generate a sine wave plot
node src/lib/main.js --expression "y=sin(x)" --range "x=-pi:pi" --file sine.svg

# Create a parabola with custom step size
node src/lib/main.js --expression "y=x^2-2*x+1" --range "x=-2:4,step=0.05" --file parabola.png

# Plot logarithmic function with verbose output
node src/lib/main.js --expression "y=log(x)" --range "x=0.1:10" --file log.svg --verbose
```

## 📊 Examples

### Trigonometric Functions

```bash
# Sine wave
node src/lib/main.js --expression "y=sin(x)" --range "x=-pi:pi" --file sine.svg

# Cosine with custom range
node src/lib/main.js --expression "y=cos(x)" --range "x=0:2*pi,step=0.05" --file cosine.png

# Combined trig functions
node src/lib/main.js --expression "y=sin(x)*cos(x)" --range "x=-2*pi:2*pi" --file trig-combo.svg
```

### Polynomial Functions

```bash
# Simple parabola
node src/lib/main.js --expression "y=x^2" --range "x=-3:3" --file parabola.svg

# Cubic function
node src/lib/main.js --expression "y=x^3-3*x^2+2*x" --range "x=-1:4" --file cubic.png

# Quartic with fine resolution
node src/lib/main.js --expression "y=x^4-5*x^2+4" --range "x=-3:3,step=0.02" --file quartic.svg
```

### Exponential and Logarithmic Functions

```bash
# Natural logarithm
node src/lib/main.js --expression "y=log(x)" --range "x=0.1:10" --file natural-log.svg

# Exponential function
node src/lib/main.js --expression "y=exp(x)" --range "x=-2:2" --file exponential.png

# Square root function
node src/lib/main.js --expression "y=sqrt(x)" --range "x=0:10" --file square-root.svg
```

## 🛠️ CLI Reference

```
Usage: node src/lib/main.js [OPTIONS]

Options:
  --expression EXPR    Mathematical expression (e.g., "y=sin(x)")
  --range RANGE       Variable range (e.g., "x=-pi:pi" or "x=-1:1,step=0.05")
  --file FILENAME     Output file (.svg or .png)
  --verbose           Show detailed output
  --help              Show this help message
  --version           Show version number
```

### Expression Syntax

Supports standard mathematical notation:

- **Arithmetic**: `+`, `-`, `*`, `/`, `^` (power)
- **Functions**: `sin`, `cos`, `tan`, `log`, `ln`, `exp`, `sqrt`, `abs`
- **Constants**: `pi`, `e`
- **Parentheses**: For grouping operations
- **Variables**: Single or multi-character (e.g., `x`, `theta`)

Examples:
- `y=sin(x)`
- `y=x^2 + 2*x + 1`
- `y=exp(-x^2/2) / sqrt(2*pi)`
- `y=log(abs(x)) + cos(pi*x)`

### Range Specifications

Define the domain for your function:

- **Basic range**: `x=-1:1` (from -1 to 1 with default step 0.1)
- **Custom step**: `x=0:10,step=0.5` (from 0 to 10 with step 0.5)
- **Constants**: `x=-pi:pi` (using mathematical constants)
- **Fine resolution**: `x=-2:2,step=0.01` (for smooth curves)

## 📚 Library API

### ExpressionParser

```javascript
import { ExpressionParser } from 'plot-code-lib';

const parser = new ExpressionParser();
const func = parser.parse("y=sin(x)");
const result = func({ x: Math.PI/2 }); // returns 1
```

### TimeSeriesGenerator

```javascript
import { TimeSeriesGenerator } from 'plot-code-lib';

const generator = new TimeSeriesGenerator();
const range = generator.parseRange("x=-pi:pi,step=0.1");
const data = generator.generate(expressionFunc, range);

// Export formats
const json = generator.exportJSON(data);
const csv = generator.exportCSV(data);
```

### PlotRenderer

```javascript
import { PlotRenderer } from 'plot-code-lib';

const renderer = new PlotRenderer();

// Generate SVG
const svg = renderer.renderSVG(data, {
  width: 800,
  height: 600,
  title: "My Plot"
});

// Generate PNG
const pngBuffer = await renderer.renderPNG(data);

// Save to file
await renderer.saveFile(svg, "plot.svg");
await renderer.saveFile(pngBuffer, "plot.png");
```

## 🌐 Web Interface

The library includes a web interface for interactive plotting. Run:

```bash
npm start
```

Then open your browser to see the interactive demo with live plotting capabilities.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:unit

# Run behavior tests (requires browser)
npm run test:behaviour
```

## 🔧 Development

### Prerequisites

- Node.js >= 24.0.0
- npm >= 10.0.0

### Dependencies

- **mathjs**: Mathematical expression parsing and evaluation
- **d3**: SVG generation and scaling
- **sharp**: PNG conversion from SVG
- **vitest**: Testing framework
- **playwright**: End-to-end testing

### Building

```bash
# Build web interface for production
npm run build

# Start development server
npm start

# Run CLI directly
npm run start:cli -- --help
```

## 📖 File Structure

```
src/
├── lib/
│   └── main.js           # Core library (browser + Node.js)
└── web/
    ├── index.html        # Web interface
    └── lib.js           # Browser entry point
tests/
├── unit/                # Unit tests for all components
├── behaviour/           # End-to-end Playwright tests
└── ...
docs/                    # Generated documentation and examples
examples/                # Sample plots and usage examples
```

## 🎯 Mission

This repository demonstrates the agentic-lib workflows for autonomous code development. The core functionality in `src/lib/main.js` evolves through automated workflows that:

- Generate issues from the mission statement
- Implement features with comprehensive tests
- Create documentation and examples
- Maintain quality through automated testing

See [`MISSION.md`](MISSION.md) for the complete project mission and [`agentic-lib.toml`](agentic-lib.toml) for workflow configuration.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🔗 Links

- [Repository](https://github.com/xn-intenton-z2a/repository0)
- [Live Demo](https://xn-intenton-z2a.github.io/repository0/)
- [Mission Statement](MISSION.md)
- [Agentic-lib Framework](https://github.com/xn-intenton-z2a/agentic-lib)

---

_Built with [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot._