# plot-code-lib

> "Be a go-to plot library with a CLI, be the jq of formulae visualisations."

**plot-code-lib** is a JavaScript library and CLI tool that transforms mathematical expressions into beautiful SVG and PNG plots. Generate publication-quality visualizations from command line with intuitive syntax following Unix philosophy principles.

## Features

- 🔢 **Mathematical Expression Parser**: Support for MathJS syntax including trigonometric functions, polynomials, and complex expressions
- 📊 **Time Series Generation**: Convert continuous mathematical functions into discrete coordinate arrays using GeoJSON specification
- 🎨 **Dual Format Rendering**: Generate both SVG vector graphics and PNG raster images using D3.js and Sharp
- 🖥️ **Command Line Interface**: Intuitive CLI with Unix-style options using Commander.js
- 📐 **Multiple Plot Types**: Standard function plots and parametric curves
- 🎯 **Flexible Range Specification**: Support for custom ranges, step sizes, and mathematical expressions in parameters

## Installation

```bash
npm install -g plot-code-lib
```

## Command Line Usage

### Standard Function Plots

Generate a sine wave:
```bash
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o sine-wave.svg --title "Sine Wave"
```

Plot a quadratic function:
```bash
plot-code-lib plot -e "x^2 - 2*x + 1" -r "x=-2:4:0.1" -o parabola.png --title "Quadratic Function"
```

### Parametric Plots

Generate a circle:
```bash
plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o circle.svg --title "Unit Circle"
```

Create a heart shape:
```bash
plot-code-lib parametric -x "16*sin(t)^3" -y "13*cos(t)-5*cos(2*t)-2*cos(3*t)-cos(4*t)" -r "t=0:2*pi" -o heart.svg --title "Heart"
```

### Advanced Examples

Mathematical functions supported:
```bash
# Polynomials
plot-code-lib plot -e "x^3 - 3*x^2 + 2*x + 1" -r "x=-2:3" -o cubic.svg

# Exponentials and logarithms  
plot-code-lib plot -e "exp(x)" -r "x=-2:2:0.1" -o exponential.svg
plot-code-lib plot -e "log(x)" -r "x=0.1:10:0.1" -o logarithm.svg

# Trigonometric combinations
plot-code-lib plot -e "sin(x) + cos(2*x)" -r "x=0:4*pi:0.1" -o trig-combo.svg

# Complex parametric curves
plot-code-lib parametric -x "sin(3*t)" -y "sin(2*t)" -r "t=0:2*pi" -o lissajous.svg --title "Lissajous Curve"
```

### Output Formats

Generate SVG (vector graphics):
```bash
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o output.svg
```

Generate PNG (raster graphics):
```bash
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o output.png --width 1200 --height 800
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

#### plot command
```
plot-code-lib plot [options]

Options:
  -e, --expression <expr>  Mathematical expression (e.g., "sin(x)", "x^2")
  -r, --range <range>      Variable range (e.g., "x=-1:1", "x=0:2*pi:0.1")
  -o, --output <file>      Output file (SVG or PNG)
  -t, --title <title>      Plot title
  -w, --width <width>      Plot width (default: 800)
  -h, --height <height>    Plot height (default: 600)
  --xlabel <label>         X-axis label (default: "x")
  --ylabel <label>         Y-axis label (default: "y")
```

#### parametric command
```
plot-code-lib parametric [options]

Options:
  -x, --xexpr <expr>       X coordinate expression (e.g., "cos(t)")
  -y, --yexpr <expr>       Y coordinate expression (e.g., "sin(t)")
  -r, --range <range>      Parameter range (e.g., "t=0:2*pi")
  -o, --output <file>      Output file (SVG or PNG)
  -t, --title <title>      Plot title
  -w, --width <width>      Plot width (default: 800)
  -h, --height <height>    Plot height (default: 600)
  --xlabel <label>         X-axis label (default: "x")
  --ylabel <label>         Y-axis label (default: "y")
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

// Generate parametric curves
const parametricData = generator.generateParametric("cos(t)", "sin(t)", "t=0:2*pi");

// Create plots
const plotter = new PlotGenerator();
plotter.setDimensions(1200, 800);

// Generate SVG
const svgMarkup = plotter.generateSVG(geoJsonData, { 
  title: "Quadratic Function",
  xLabel: "x", 
  yLabel: "y" 
});

// Generate PNG
const pngBuffer = await plotter.generatePNG(svgMarkup);
```

## Data Formats

**plot-code-lib** uses open standards:

- **Mathematical Expressions**: MathJS syntax for maximum compatibility
- **Coordinate Data**: GeoJSON LineString format for interoperability  
- **Output**: SVG format for scalable visualizations, PNG for universal compatibility

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
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o examples/sine.svg --title "Sine Wave"

# Parabola with vertex  
plot-code-lib plot -e "x^2 - 4*x + 3" -r "x=-1:5" -o examples/parabola.png

# Exponential decay
plot-code-lib plot -e "exp(-x)" -r "x=0:5:0.1" -o examples/decay.svg

# Parametric circle
plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o examples/circle.svg --title "Unit Circle"

# Lissajous curve
plot-code-lib parametric -x "sin(3*t)" -y "sin(2*t)" -r "t=0:2*pi" -o examples/lissajous.png --title "Lissajous 3:2"

# Complex expression with damping
plot-code-lib plot -e "sin(5*x) * exp(-x/3)" -r "x=0:15:0.1" -o examples/wave.svg --title "Damped Oscillation"
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