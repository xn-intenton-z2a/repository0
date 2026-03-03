# plot-code-lib

> "Be a go-to plot library with a CLI, be the jq of formulae visualisations."

**plot-code-lib** is a JavaScript library and CLI tool that transforms mathematical expressions into beautiful SVG plots. Generate publication-quality visualizations from command line with intuitive syntax following Unix philosophy principles.

## Features

- 🔢 **Mathematical Expression Parser**: Support for MathJS syntax including trigonometric functions, polynomials, and complex expressions
- 📊 **Time Series Generation**: Convert continuous mathematical functions into discrete coordinate arrays using GeoJSON specification
- 🎨 **SVG Plot Rendering**: Generate publication-quality mathematical plots with D3.js
- 🖥️ **Command Line Interface**: Intuitive CLI with Unix-style options using Commander.js
- 📐 **Flexible Range Specification**: Support for custom ranges, step sizes, and parametric expressions

## Installation

```bash
npm install -g plot-code-lib
```

## Command Line Usage

### Basic Plotting

Generate a sine wave:
```bash
plot-code-lib --expression "sin(x)" --range "x=0:2*pi:0.1" --output sine-wave.svg
```

Plot a quadratic function:
```bash
plot-code-lib --expression "x^2 - 2*x + 1" --range "x=-2:4:0.1" --output parabola.svg --title "Quadratic Function"
```

### Advanced Examples

Plot multiple trigonometric functions:
```bash
# Cosine wave with custom step size
plot-code-lib -e "cos(x)" -r "x=-pi:pi:0.05" -o cosine.svg

# Tangent function with limited range
plot-code-lib -e "tan(x)" -r "x=-pi/4:pi/4:0.01" -o tangent.svg

# Complex expression
plot-code-lib -e "sin(x) * exp(-x/5)" -r "x=0:10:0.1" -o damped-sine.svg -t "Damped Sine Wave"
```

Mathematical functions supported:
```bash
# Polynomials
plot-code-lib -e "x^3 - 3*x^2 + 2*x + 1" -r "x=-2:3" -o cubic.svg

# Exponentials and logarithms  
plot-code-lib -e "exp(x)" -r "x=-2:2:0.1" -o exponential.svg
plot-code-lib -e "log(x)" -r "x=0.1:10:0.1" -o logarithm.svg

# Trigonometric combinations
plot-code-lib -e "sin(x) + cos(2*x)" -r "x=0:4*pi:0.1" -o trig-combo.svg

# Square roots and powers
plot-code-lib -e "sqrt(x)" -r "x=0:10:0.1" -o square-root.svg
```

### Range Specifications

```bash
# Automatic step (100 points between start and end)
--range "x=0:10"

# Custom step size  
--range "x=0:10:0.5"

# Using mathematical expressions in ranges
--range "x=0:2*pi:pi/20"
--range "t=-pi/2:pi/2:0.01"
```

### Command Options

```
Usage: plot-code-lib [options] [command]

Options:
  -e, --expression <expr>  Mathematical expression (e.g., "sin(x)", "x^2")
  -r, --range <range>      Variable range (e.g., "x=-1:1", "x=0:2*pi:0.1") 
  -o, --output <file>      Output file path (SVG format) (default: "output.svg")
  -t, --title [title]      Plot title
  -h, --help              Display help for command
```

## Library Usage

```javascript
import { ExpressionParser, TimeSeriesGenerator, PlotGenerator } from 'plot-code-lib';

// Parse mathematical expressions
const parser = new ExpressionParser();
const func = parser.parse("sin(x) + cos(2*x)");
console.log(func({ x: Math.PI })); // Evaluate at x = π

// Generate time series data (GeoJSON format)
const generator = new TimeSeriesGenerator(parser);
const geoJsonData = generator.generate("x^2", "x=-5:5:0.5");

// Create SVG plots
const plotter = new PlotGenerator();
const svgMarkup = plotter.generateSVG(geoJsonData, "Quadratic Function");
```

## Data Formats

**plot-code-lib** uses open standards:

- **Mathematical Expressions**: MathJS syntax for maximum compatibility
- **Coordinate Data**: GeoJSON LineString format for interoperability  
- **Output**: SVG format for scalable, web-ready visualizations

### Example GeoJSON Output

```json
{
  "type": "Feature",
  "properties": {
    "expression": "sin(x)",
    "range": "x=0:2*pi:0.1"
  },
  "geometry": {
    "type": "LineString", 
    "coordinates": [[0, 0], [0.1, 0.0998], [0.2, 0.1987], ...]
  }
}
```

## Examples Gallery

Here are some example commands and their outputs:

```bash
# Classic sine wave
plot-code-lib -e "sin(x)" -r "x=0:2*pi:0.1" -o examples/sine.svg

# Parabola with vertex  
plot-code-lib -e "x^2 - 4*x + 3" -r "x=-1:5" -o examples/parabola.svg

# Exponential decay
plot-code-lib -e "exp(-x)" -r "x=0:5:0.1" -o examples/decay.svg

# Oscillating wave
plot-code-lib -e "sin(5*x) * exp(-x/3)" -r "x=0:15:0.1" -o examples/wave.svg

# Cubic polynomial
plot-code-lib -e "x^3 - 6*x^2 + 9*x + 1" -r "x=-2:5" -o examples/cubic.svg
```

## Agentic Workflows

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. The system generates issues, writes code, runs tests, and opens pull requests based on the project mission.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and contribution guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**plot-code-lib** — Transform mathematical expressions into beautiful visualizations with the simplicity of command line tools.