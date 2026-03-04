# plot-code-lib

> _"Be a go-to plot library with a CLI, be the jq of formulae visualisations."_

A JavaScript library and CLI tool for transforming mathematical expressions into beautiful SVG and PNG plots. Built for developers who need quick, scriptable mathematical visualizations.

## 🚀 Quick Start

```bash
# Install globally for CLI usage
npm install -g @xn-intenton-z2a/plot-code-lib

# Basic sine wave
plot-code-lib plot --expression "y=sin(x)" --range "x=-10:10" --file sine.svg

# Quadratic function as PNG
plot-code-lib plot --expression "x^2" --range "x=-3:3" --file parabola.png --title "Parabola"

# Complex expression with high resolution
plot-code-lib plot --expression "exp(-x^2/2)*cos(4*x)" --range "x=-4:4" --steps 200 --file gaussian.svg
```

## 📦 Installation

### CLI Usage
```bash
npm install -g @xn-intenton-z2a/plot-code-lib
```

### Library Usage
```bash
npm install @xn-intenton-z2a/plot-code-lib
```

## 🎯 Features

- **Mathematical Expression Parsing**: Supports standard mathematical notation using mathjs
- **Time Series Generation**: Convert expressions into structured data points
- **Dual Output Formats**: Generate both SVG (vector) and PNG (raster) plots
- **Customizable Styling**: Axes, grids, titles, colors, and dimensions
- **CLI Interface**: Terminal-friendly commands with comprehensive options
- **Library API**: Use as a JavaScript module in your own projects

## 📋 Command Line Interface

### Basic Usage

```bash
plot-code-lib plot [options]
```

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--expression <expr>` | `-e` | Mathematical expression | `y=sin(x)` |
| `--range <range>` | `-r` | Variable ranges | `x=-10:10,y=-5:5` |
| `--file <path>` | `-f` | Output file path | `output.svg` |
| `--steps <number>` | `-s` | Number of calculation steps | `100` |
| `--title <title>` | `-t` | Plot title | (auto-generated) |

### Examples Command

```bash
plot-code-lib examples
```

Shows built-in usage examples with various mathematical functions.

## 🔧 Library API

```javascript
import { parseRange, generateTimeSeries, generateSVGPlot, generatePNGPlot } from '@xn-intenton-z2a/plot-code-lib';

// Parse range string
const ranges = parseRange('x=-5:5,y=-2:2');

// Generate data points
const points = generateTimeSeries('sin(x)', ranges, 100);

// Create SVG plot
const svg = generateSVGPlot(points, { 
  title: 'Sine Wave',
  strokeColor: '#ff6b6b'
});

// Create PNG plot (async)
const pngBuffer = await generatePNGPlot(points, { 
  title: 'Sine Wave',
  width: 1200,
  height: 800
});
```

## 📊 Expression Examples

### Basic Functions

```bash
# Trigonometric functions
plot-code-lib plot -e "sin(x)" -r "x=-6.28:6.28" -f trig_sine.svg
plot-code-lib plot -e "cos(x)" -r "x=-6.28:6.28" -f trig_cosine.svg
plot-code-lib plot -e "tan(x)" -r "x=-1.5:1.5" -f trig_tangent.svg

# Polynomial functions  
plot-code-lib plot -e "x^2" -r "x=-5:5" -f poly_quadratic.svg
plot-code-lib plot -e "x^3 - 3*x" -r "x=-3:3" -f poly_cubic.svg

# Exponential and logarithmic
plot-code-lib plot -e "exp(x)" -r "x=-2:2" -f exp_function.svg
plot-code-lib plot -e "log(x)" -r "x=0.1:10" -f log_function.svg
```

### Advanced Functions

```bash
# Damped oscillation
plot-code-lib plot -e "exp(-x/4)*sin(3*x)" -r "x=0:12" -f damped_oscillation.svg

# Gaussian function
plot-code-lib plot -e "exp(-x^2/2)" -r "x=-4:4" -f gaussian.svg

# Modulated sine wave
plot-code-lib plot -e "sin(x)*cos(x/3)" -r "x=-15:15" -f modulated_sine.svg

# Rational function
plot-code-lib plot -e "1/(1+x^2)" -r "x=-5:5" -f rational_function.svg
```

### High-Resolution Plots

```bash
# Detailed plot with 500 points
plot-code-lib plot -e "sin(10*x)*exp(-x^2/4)" -r "x=-3:3" -s 500 -f high_res.svg

# Large range visualization
plot-code-lib plot -e "sin(x)/x" -r "x=-20:20" -s 400 -f sinc_function.svg
```

## 🎨 Output Formats

### SVG (Vector Graphics)
- Scalable without quality loss
- Perfect for web and print
- Editable with text editors
- Smaller file sizes for simple plots

### PNG (Raster Graphics)
- Fixed resolution
- Universal compatibility
- Good for screenshots and presentations
- Generated from SVG using Sharp

## 🔍 Expression Syntax

Supports the complete mathjs expression syntax:

**Basic Operations**: `+`, `-`, `*`, `/`, `^`, `%`

**Functions**: `sin`, `cos`, `tan`, `exp`, `log`, `sqrt`, `abs`, `floor`, `ceil`, `round`

**Constants**: `pi`, `e`

**Examples**:
- `sin(x)` - sine function
- `x^2 + 2*x + 1` - quadratic polynomial
- `exp(-x^2/2)/sqrt(2*pi)` - Gaussian distribution
- `abs(sin(x))` - absolute value of sine

## 🏗️ Project Structure

```
plot-code-lib/
├── src/lib/main.js          # Main library and CLI
├── tests/unit/main.test.js  # Unit tests
├── examples/                # Generated example plots
├── features/                # Feature documentation
└── package.json             # Project configuration
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:unit
```

## 🤝 Contributing

This is a template repository demonstrating agentic-lib workflows. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 🏷️ Version

Current version: 0.1.0

---

**Built with**: JavaScript (ES modules), mathjs, Sharp, Commander.js