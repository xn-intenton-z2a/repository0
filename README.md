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

## Quick Start

### Basic Function Plot
```bash
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o sine-wave.svg --title "Sine Wave"
```

### Parametric Plot
```bash
plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o circle.svg --title "Unit Circle"
```

## Command Line Usage

### Standard Function Plots

Generate mathematical function plots:
```bash
# Basic sine wave
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o sine-wave.svg --title "Sine Wave"

# Quadratic function
plot-code-lib plot -e "x^2 - 2*x + 1" -r "x=-2:4:0.1" -o parabola.png --title "Quadratic Function"

# Exponential decay
plot-code-lib plot -e "exp(-x)" -r "x=0:5:0.1" -o decay.svg --title "Exponential Decay"

# Complex expression with damping
plot-code-lib plot -e "sin(5*x) * exp(-x/3)" -r "x=0:15:0.1" -o damped-wave.svg --title "Damped Oscillation"
```

### Parametric Plots

Create curves defined by parametric equations:
```bash
# Circle
plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o circle.svg --title "Unit Circle"

# Heart curve
plot-code-lib parametric -x "16*sin(t)^3" -y "13*cos(t)-5*cos(2*t)-2*cos(3*t)-cos(4*t)" -r "t=0:2*pi" -o heart.svg --title "Heart Curve"

# Lissajous curve
plot-code-lib parametric -x "sin(3*t)" -y "sin(2*t)" -r "t=0:2*pi" -o lissajous.svg --title "Lissajous Curve"

# Rose curve
plot-code-lib parametric -x "cos(5*t)*cos(t)" -y "cos(5*t)*sin(t)" -r "t=0:pi" -o rose.svg --title "Rose Curve"
```

### Advanced Mathematical Functions

```bash
# Polynomials
plot-code-lib plot -e "x^3 - 3*x^2 + 2*x + 1" -r "x=-2:3" -o cubic.svg --title "Cubic Polynomial"

# Logarithmic functions
plot-code-lib plot -e "log(x)" -r "x=0.1:10:0.1" -o logarithm.svg --title "Natural Logarithm"

# Trigonometric combinations
plot-code-lib plot -e "sin(x) + cos(2*x)" -r "x=0:4*pi:0.1" -o trig-combo.svg --title "Combined Trig Functions"

# Gaussian distribution
plot-code-lib plot -e "exp(-x^2/2) / sqrt(2*pi)" -r "x=-4:4" -o gaussian.svg --title "Gaussian Distribution"

# Sigmoid function
plot-code-lib plot -e "1/(1 + exp(-x))" -r "x=-6:6" -o sigmoid.svg --title "Sigmoid Function"
```

## Command Options

### plot command
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

### parametric command
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

### export command
```
plot-code-lib export [options]

Options:
  -e, --expression <expr>  Mathematical expression (e.g., "sin(x)", "x^2")
  -r, --range <range>      Variable range (e.g., "x=-1:1", "x=0:2*pi:0.1")
  -o, --output <file>      Output file (JSON, CSV)
  --format <format>        Output format (geojson, csv, json) (default: "geojson")
```

## Data Export

Export coordinate data without generating visualizations - perfect for data pipelines and analysis workflows:

```bash
# Export as GeoJSON (standard format)
plot-code-lib export -e "sin(x)" -r "x=0:2*pi:0.1" -o sine-data.json --format geojson

# Export as CSV for spreadsheet analysis
plot-code-lib export -e "x^2" -r "x=-5:5:0.5" -o quadratic.csv --format csv

# Export as simple JSON
plot-code-lib export -e "exp(-x)" -r "x=0:5:0.1" -o decay.json --format json
```

## Range Specifications

Control the domain and resolution of your plots:

```bash
# Automatic step (100 points between start and end)
--range "x=0:10"

# Custom step size  
--range "x=0:10:0.5"

# Using mathematical expressions in ranges
--range "x=0:2*pi:pi/20"
--range "t=-pi/2:pi/2:0.01"
```

## Output Formats

Generate plots in multiple formats:

```bash
# SVG (vector graphics) - scalable and web-ready
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o output.svg

# PNG (raster graphics) - universal compatibility
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o output.png --width 1200 --height 800
```

## Library Usage

Use plot-code-lib programmatically in your JavaScript projects:

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

**plot-code-lib** uses open standards for maximum interoperability:

- **Mathematical Expressions**: MathJS syntax for maximum compatibility
- **Coordinate Data**: GeoJSON LineString format for data exchange
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

## Expression Syntax Reference

**Supported Functions:**
- **Trigonometric:** `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sec`, `csc`, `cot`
- **Exponential/Logarithmic:** `exp`, `log`, `log10`, `log2`, `sqrt`, `cbrt`
- **Hyperbolic:** `sinh`, `cosh`, `tanh`, `asinh`, `acosh`, `atanh`
- **Utility:** `abs`, `sign`, `ceil`, `floor`, `round`, `min`, `max`

**Operators:** `+`, `-`, `*`, `/`, `^`, `%`, `!`

**Constants:** `pi`, `e`, `phi`, `tau`, `i`

**Complex Expressions:**
```bash
# Conditional expressions
plot-code-lib plot -e "x >= 0 ? x : -x" -r "x=-5:5" -o absolute.svg

# Piecewise functions  
plot-code-lib plot -e "x < 0 ? x^2 : sin(x)" -r "x=-3:3" -o piecewise.svg

# Nested functions
plot-code-lib plot -e "sin(cos(x))" -r "x=0:2*pi" -o nested.svg
```

## Performance & Features

- **⚡ Fast Rendering:** Optimized D3.js pipeline with Sharp PNG conversion
- **🎯 Precision:** Handles complex mathematical expressions with domain validation
- **📊 Flexible:** Standard functions, parametric curves, and custom ranges
- **🔧 Extensible:** Full JavaScript API for programmatic use
- **📐 Standards:** GeoJSON coordinate data, MathJS expressions, SVG/PNG output

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and contribution guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**plot-code-lib** — Transform mathematical expressions into beautiful visualizations with the simplicity of command line tools.