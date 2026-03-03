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
- 📁 **Data Export**: Export coordinate data in GeoJSON, CSV, and JSON formats
- 🔧 **Programmatic API**: Full JavaScript library for integration into other projects

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

### Data Export
```bash
plot-code-lib export -e "x^2" -r "x=-5:5" -o quadratic.json --format geojson
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

Explore complex mathematical visualizations:

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

# Damped oscillation
plot-code-lib plot -e "sin(5*x) * exp(-x/3)" -r "x=0:15:0.1" -o damped-wave.svg --title "Damped Oscillation"
```

### Complex Parametric Curves

Create beautiful mathematical art with parametric equations:

```bash
# Circle
plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o circle.svg --title "Unit Circle"

# Heart curve (Cardioid)
plot-code-lib parametric -x "16*sin(t)^3" -y "13*cos(t)-5*cos(2*t)-2*cos(3*t)-cos(4*t)" -r "t=0:2*pi" -o heart.svg --title "Heart Curve"

# Lissajous curve
plot-code-lib parametric -x "sin(3*t)" -y "sin(2*t)" -r "t=0:2*pi" -o lissajous.svg --title "Lissajous Curve"

# Rose curve
plot-code-lib parametric -x "cos(5*t)*cos(t)" -y "cos(5*t)*sin(t)" -r "t=0:pi" -o rose.svg --title "Rose Curve"

# Spiral of Archimedes  
plot-code-lib parametric -x "t*cos(t)" -y "t*sin(t)" -r "t=0:6*pi:0.1" -o spiral.svg --title "Archimedes Spiral"

# Butterfly curve
plot-code-lib parametric -x "sin(t)*(exp(cos(t))-2*cos(4*t)-sin(t/12)^5)" -y "cos(t)*(exp(cos(t))-2*cos(4*t)-sin(t/12)^5)" -r "t=0:12*pi:0.1" -o butterfly.svg --title "Butterfly Curve"
```

### Data Analysis Workflows

Export and process mathematical data for analysis:

```bash
# Generate coordinate data as GeoJSON (default)
plot-code-lib export -e "sin(x)" -r "x=0:2*pi:0.1" -o sine-data.json --format geojson

# Export as CSV for spreadsheet analysis
plot-code-lib export -e "x^2" -r "x=-5:5:0.5" -o quadratic.csv --format csv

# Export as simple JSON for data processing
plot-code-lib export -e "exp(-x)" -r "x=0:5:0.1" -o decay.json --format json

# Chain with other tools (the jq philosophy)
plot-code-lib export -e "sin(x)" -r "x=0:2*pi:0.1" -o sine.json --format json && \
  cat sine.json | jq '.data | length'
```

### Publication-Quality Output

Generate high-resolution plots for research and presentations:

```bash
# High-resolution PNG for presentations
plot-code-lib plot -e "sin(x)*cos(3*x)" -r "x=0:2*pi" -o high-res.png \
  --width 1920 --height 1080 --title "High Resolution Plot" \
  --xlabel "Time (s)" --ylabel "Amplitude"

# Custom styling with labels
plot-code-lib plot -e "log10(x)" -r "x=1:100" -o log-scale.svg \
  --title "Logarithmic Scale Analysis" \
  --xlabel "Input Value" --ylabel "log₁₀(x)" \
  --width 1200 --height 800

# Scientific notation support
plot-code-lib plot -e "6.626e-34 * x" -r "x=1e14:1e15:1e12" -o planck.svg \
  --title "Planck's Constant Relationship"
```

## Command Reference

### plot command
Generate standard mathematical function plots.

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

**Examples:**
```bash
# Basic quadratic function
plot-code-lib plot -e "x^2 - 4*x + 3" -r "x=-1:5" -o parabola.svg

# Trigonometric with custom labels
plot-code-lib plot -e "sin(2*pi*x)" -r "x=0:2" -o wave.svg \
  --xlabel "Time (s)" --ylabel "Amplitude" --title "2Hz Sine Wave"
```

### parametric command
Generate parametric curves defined by separate X and Y expressions.

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

**Examples:**
```bash  
# Ellipse
plot-code-lib parametric -x "2*cos(t)" -y "sin(t)" -r "t=0:2*pi" -o ellipse.svg

# Hypotrochoid (spirograph pattern)
plot-code-lib parametric \
  -x "(R-r)*cos(t) + d*cos((R-r)/r*t)" \
  -y "(R-r)*sin(t) - d*sin((R-r)/r*t)" \
  -r "t=0:2*pi" -o spirograph.svg \
  --width 600 --height 600
```

### export command
Export coordinate data without creating visualizations - perfect for data pipelines.

```
plot-code-lib export [options]

Options:
  -e, --expression <expr>  Mathematical expression (e.g., "sin(x)", "x^2")
  -r, --range <range>      Variable range (e.g., "x=-1:1", "x=0:2*pi:0.1")
  -o, --output <file>      Output file 
  --format <format>        Output format: geojson, csv, json (default: "geojson")
```

**Examples:**
```bash
# GeoJSON format (geographic standard)
plot-code-lib export -e "cos(x)" -r "x=0:pi" -o cosine.geojson --format geojson

# CSV format (spreadsheet compatible)  
plot-code-lib export -e "x^3" -r "x=-2:2:0.1" -o cubic.csv --format csv

# Simple JSON format
plot-code-lib export -e "sqrt(x)" -r "x=0:10" -o sqrt.json --format json
```

## Data Export

Export coordinate data without generating visualizations - perfect for data pipelines and analysis workflows:

```bash
# Export as GeoJSON (geographic standard, default format)
plot-code-lib export -e "sin(x)" -r "x=0:2*pi:0.1" -o sine-data.json --format geojson

# Export as CSV for spreadsheet analysis
plot-code-lib export -e "x^2" -r "x=-5:5:0.5" -o quadratic.csv --format csv

# Export as simple JSON for data processing
plot-code-lib export -e "exp(-x)" -r "x=0:5:0.1" -o decay.json --format json
```

### Integration with Data Processing Tools

Follow the Unix philosophy - chain with other command-line tools:

```bash
# Count data points
plot-code-lib export -e "sin(x)" -r "x=0:2*pi:0.1" --format json -o sine.json && \
  cat sine.json | jq '.data | length'

# Extract Y values with jq
plot-code-lib export -e "x^2" -r "x=0:10" --format json -o data.json && \
  cat data.json | jq '.data | map(.[1])'

# Convert to different formats
plot-code-lib export -e "cos(x)" -r "x=0:pi" --format csv -o cosine.csv && \
  awk -F',' 'NR>1 {sum+=$2} END {print "Average:", sum/(NR-1)}' cosine.csv

# Pipe to analysis tools
plot-code-lib export -e "random()" -r "x=1:1000" --format csv | \
  tail -n +2 | awk -F',' '{print $2}' | sort -n
```

## Range Specifications

Control the domain and resolution of your plots with flexible range syntax:

```bash
# Basic range: automatic step (100 points between start and end)  
--range "x=0:10"

# Custom step size for high precision
--range "x=0:10:0.01"

# Using mathematical expressions in ranges
--range "x=0:2*pi:pi/20"
--range "t=-pi/2:pi/2:0.01"

# Scientific notation support
--range "x=1e-6:1e-3:1e-8"
```

### Range Examples by Use Case

```bash
# High-frequency oscillations (need small steps)
plot-code-lib plot -e "sin(100*x)" -r "x=0:1:0.001" -o high-freq.svg

# Slow-changing functions (larger steps OK)
plot-code-lib plot -e "x^0.5" -r "x=0:100:1" -o sqrt.svg

# Precise mathematical constants
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi:pi/100" -o precise-sine.svg

# Large domain analysis
plot-code-lib plot -e "log(x)" -r "x=1:1000:10" -o wide-log.svg
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

**plot-code-lib** uses MathJS syntax for maximum compatibility and power.

### Supported Functions

**Trigonometric:** 
- Basic: `sin`, `cos`, `tan`, `sec`, `csc`, `cot`
- Inverse: `asin`, `acos`, `atan`, `atan2`, `asec`, `acsc`, `acot`
- Hyperbolic: `sinh`, `cosh`, `tanh`, `sech`, `csch`, `coth`
- Inverse Hyperbolic: `asinh`, `acosh`, `atanh`, `asech`, `acsch`, `acoth`

**Exponential/Logarithmic:** 
- `exp`, `expm1`, `log`, `log10`, `log2`, `log1p`
- `sqrt`, `cbrt`, `nthRoot`

**Utility Functions:**
- `abs`, `sign`, `ceil`, `floor`, `round`, `fix`, `mod`
- `min`, `max`, `gcd`, `lcm`, `factorial`

**Statistical:** 
- `mean`, `median`, `std`, `var`
- `combinations`, `permutations`

**Operators:** 
- Arithmetic: `+`, `-`, `*`, `/`, `^`, `%`
- Comparison: `<`, `<=`, `>`, `>=`, `==`, `!=`
- Logical: `and`, `or`, `not`, `xor`

**Constants:** 
- `pi`, `e`, `phi` (golden ratio), `tau`, `i` (imaginary unit)
- `LN2`, `LN10`, `LOG2E`, `LOG10E`, `SQRT1_2`, `SQRT2`

### Complex Expressions Examples

```bash
# Conditional expressions (piecewise functions)
plot-code-lib plot -e "x >= 0 ? x^2 : -x^2" -r "x=-5:5" -o piecewise.svg \
  --title "Piecewise Function"

# Absolute value using conditional
plot-code-lib plot -e "x < 0 ? -x : x" -r "x=-10:10" -o absolute.svg

# Complex nested functions  
plot-code-lib plot -e "sin(cos(x^2))" -r "x=-pi:pi" -o nested.svg \
  --title "Nested Trigonometric Functions"

# Multi-variable expressions (using parameter substitution)
plot-code-lib plot -e "sin(a*x + b)" -r "x=0:2*pi" -o phase-shift.svg \
  # Note: Define a=2, b=pi/4 by substituting before execution

# Statistical distributions
plot-code-lib plot -e "1/sqrt(2*pi) * exp(-0.5*x^2)" -r "x=-4:4" -o normal.svg \
  --title "Standard Normal Distribution"

# Factorial and combinatorics
plot-code-lib plot -e "factorial(x)" -r "x=0:10:1" -o factorial.svg

# Modular arithmetic (sawtooth)
plot-code-lib plot -e "mod(x, 2*pi)" -r "x=0:12*pi" -o sawtooth.svg

# Bessel function approximation
plot-code-lib plot -e "sin(x)/x" -r "x=-20:20:0.1" -o sinc.svg \
  --title "Sinc Function"
```

### Error Handling

The parser gracefully handles mathematical edge cases:

```bash
# Division by zero is handled (produces infinite values, skipped in plots)
plot-code-lib plot -e "1/x" -r "x=-2:2:0.1" -o reciprocal.svg

# Complex results are skipped (e.g., sqrt of negative numbers)  
plot-code-lib plot -e "sqrt(x)" -r "x=-5:5" -o sqrt-domain.svg

# Logarithm domain issues handled
plot-code-lib plot -e "log(x)" -r "x=-2:10:0.1" -o log-safe.svg
```

## Performance & Features

- **⚡ Fast Rendering:** Optimized D3.js pipeline with Sharp PNG conversion
- **🎯 Precision:** Handles complex mathematical expressions with domain validation
- **📊 Flexible:** Standard functions, parametric curves, and custom ranges
- **🔧 Extensible:** Full JavaScript API for programmatic use
- **📐 Standards:** GeoJSON coordinate data, MathJS expressions, SVG/PNG output
- **🚀 Pipeline Ready:** Unix philosophy - compose with other CLI tools

## Real-World Use Cases

### Scientific Research
```bash
# Model exponential decay (radioactive, RC circuits)
plot-code-lib plot -e "N0 * exp(-lambda * t)" -r "t=0:10" -o decay-model.svg \
  --title "Exponential Decay Model" --xlabel "Time" --ylabel "Quantity"

# Population growth models
plot-code-lib plot -e "K / (1 + ((K-N0)/N0) * exp(-r*t))" -r "t=0:20" -o logistic.svg \
  --title "Logistic Growth Model"

# Signal processing - Fourier series approximation
plot-code-lib plot -e "sin(x) + sin(3*x)/3 + sin(5*x)/5" -r "x=0:4*pi" -o fourier.svg \
  --title "Square Wave Fourier Approximation"
```

### Engineering Applications
```bash
# RLC circuit response
plot-code-lib plot -e "exp(-alpha*t) * cos(omega*t)" -r "t=0:5" -o damped-oscillation.svg \
  --title "Damped Oscillation"

# Frequency response analysis
plot-code-lib plot -e "1 / sqrt(1 + (omega/omega0)^2)" -r "omega=0.1:10" -o frequency-response.svg \
  --xlabel "ω/ω₀" --ylabel "|H(jω)|"

# Control systems - step response
plot-code-lib plot -e "1 - exp(-t/tau)" -r "t=0:5" -o step-response.svg \
  --title "First-Order System Step Response"
```

### Data Science & Statistics
```bash
# Probability distributions comparison
plot-code-lib plot -e "exp(-0.5*((x-mu)/sigma)^2) / (sigma*sqrt(2*pi))" -r "x=-4:4" -o gaussian.svg \
  --title "Normal Distribution"

# Chi-squared distribution
plot-code-lib plot -e "(x^((k/2)-1) * exp(-x/2)) / (2^(k/2) * gamma(k/2))" -r "x=0:15" -o chi-squared.svg

# Regression analysis - polynomial fits
plot-code-lib plot -e "a*x^3 + b*x^2 + c*x + d" -r "x=-2:2" -o cubic-fit.svg \
  --title "Cubic Polynomial Fit"
```

### Mathematical Art & Visualization
```bash
# Mandelbrot set boundary approximation
plot-code-lib parametric -x "cos(t) * (2 + cos(8*t))" -y "sin(t) * (2 + cos(8*t))" \
  -r "t=0:2*pi" -o mathematical-flower.svg

# Golden spiral
plot-code-lib parametric -x "phi^t * cos(t)" -y "phi^t * sin(t)" -r "t=0:4*pi" -o golden-spiral.svg

# Cycloid (wheel rolling)
plot-code-lib parametric -x "R*(t - sin(t))" -y "R*(1 - cos(t))" -r "t=0:4*pi" -o cycloid.svg
```

### Batch Processing Workflows
```bash
# Generate multiple plots with different parameters
for freq in 1 2 5 10; do
  plot-code-lib plot -e "sin(${freq}*x)" -r "x=0:2*pi" -o "sine-${freq}hz.svg" \
    --title "Sine Wave ${freq} Hz"
done

# Parametric family of curves
for n in 3 4 5 6; do
  plot-code-lib parametric -x "cos(${n}*t)*cos(t)" -y "cos(${n}*t)*sin(t)" \
    -r "t=0:pi" -o "rose-${n}.svg" --title "Rose Curve n=${n}"
done

# Data processing pipeline
plot-code-lib export -e "sin(x) + 0.1*random()" -r "x=0:10:0.1" --format csv -o noisy-sine.csv && \
  # Further processing with awk, R, Python, etc.
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and contribution guidelines.

## Troubleshooting

### Common Issues and Solutions

**"No valid data points generated"**
```bash
# Issue: Expression produces NaN or infinite values
# Solution: Check domain restrictions
plot-code-lib plot -e "log(x)" -r "x=0.1:10" -o log.svg  # ✓ Valid domain
plot-code-lib plot -e "log(x)" -r "x=-5:10" -o log.svg   # ✗ Includes negative values
```

**"Failed to parse expression"**
```bash
# Issue: Invalid syntax
plot-code-lib plot -e "sin(x" -r "x=0:pi" -o sine.svg    # ✗ Missing closing parenthesis
plot-code-lib plot -e "sin(x)" -r "x=0:pi" -o sine.svg   # ✓ Correct syntax
```

**Empty or strange plots**
```bash
# Issue: Range too large or small, wrong step size
plot-code-lib plot -e "sin(x)" -r "x=0:1000:100" -o sine.svg  # ✗ Too few points
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi:0.1" -o sine.svg  # ✓ Appropriate resolution
```

### Performance Tips

```bash
# For high-frequency functions, use smaller steps
plot-code-lib plot -e "sin(100*x)" -r "x=0:1:0.001" -o high-freq.svg

# For smooth curves, ensure sufficient resolution
plot-code-lib plot -e "x^3" -r "x=-10:10:0.1" -o smooth-cubic.svg

# For large ranges, consider logarithmic sampling
plot-code-lib export -e "exp(x)" -r "x=0:10:0.1" --format csv -o exponential.csv
```

### Advanced Tips

**Variable substitution for parametric constants:**
```bash
# Define constants in shell, then use in expressions
R=5; r=3; d=2
plot-code-lib parametric \
  -x "($R-$r)*cos(t) + $d*cos(($R-$r)/$r*t)" \
  -y "($R-$r)*sin(t) - $d*sin(($R-$r)/$r*t)" \
  -r "t=0:2*pi" -o spirograph.svg
```

**Combining with image processing:**
```bash
# Generate plot and convert to different formats
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o sine.png --width 1200 --height 800
convert sine.png -background white -flatten sine.jpg  # ImageMagick conversion
```

**Shell scripting for animation frames:**
```bash
# Generate animation frames
mkdir frames
for phase in $(seq 0 0.1 6.28); do
  frame=$(printf "%03d" $(echo "$phase * 10" | bc))
  plot-code-lib plot -e "sin(x + $phase)" -r "x=0:2*pi" \
    -o "frames/sine_${frame}.png" --width 800 --height 600
done
# Use ffmpeg to create video: ffmpeg -r 10 -i frames/sine_%03d.png -pix_fmt yuv420p animation.mp4
```

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**plot-code-lib** — Transform mathematical expressions into beautiful visualizations with the simplicity of command line tools.