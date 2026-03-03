# plot-code-lib

_"Be a go-to plot library with a CLI, be the jq of formulae visualisations."_

A JavaScript library and CLI tool for transforming mathematical expressions into beautiful plots. Generate SVG and PNG visualizations from mathematical formulas with a simple, intuitive command-line interface.

## Features

✨ **Mathematical Expression Parsing**: Support for a wide range of mathematical functions and operations using mathjs  
📈 **Multiple Output Formats**: Generate both SVG and PNG plots  
🎛️ **Configurable Ranges**: Specify custom x and y value ranges  
⚙️ **High Resolution**: Adjustable step count for smooth curves  
🎨 **Customizable Styling**: Custom titles, colors, and dimensions  
🖥️ **CLI Interface**: Simple command-line interface inspired by jq's philosophy  

## Installation

```bash
# Global installation
npm install -g @xn-intenton-z2a/plot-code-lib

# Or use directly with npx
npx @xn-intenton-z2a/plot-code-lib plot --expression "sin(x)" --file sine.svg
```

## Quick Start

```bash
# Generate a sine wave plot
plot-code-lib plot --expression "y=sin(x)" --range "x=-10:10" --file sine.svg

# Create a PNG instead of SVG
plot-code-lib plot --expression "cos(x)" --range "x=-6.28:6.28" --file cosine.png

# Complex mathematical expressions
plot-code-lib plot --expression "exp(-x^2/4)*sin(3*x)" --range "x=-4:4" --file damped.svg
```

## CLI Usage

### Basic Syntax

```bash
plot-code-lib plot [options]
```

### Options

- `-e, --expression <expr>`: Mathematical expression (default: "y=sin(x)")
- `-r, --range <range>`: Variable ranges (default: "x=-10:10,y=-5:5")
- `-f, --file <path>`: Output file path (default: "output.svg")
- `-s, --steps <number>`: Number of calculation steps (default: "100")
- `-t, --title <title>`: Plot title

### Expression Formats

The tool supports multiple expression formats:

```bash
# Explicit format: y = f(x)
--expression "y=sin(x)"

# Implicit format: f(x) only
--expression "sin(x)"

# Complex expressions
--expression "y=sin(x)*cos(x/2)+exp(-x^2/8)"
```

### Range Specification

Ranges are specified as comma-separated variable assignments:

```bash
# Single variable range
--range "x=-10:10"

# Multiple variables (y range affects plot scaling)  
--range "x=-5:5,y=-2:2"

# Decimal ranges
--range "x=-3.14:3.14"
```

### Output Formats

The output format is automatically determined by the file extension:

- `.svg` → SVG vector format
- `.png` → PNG raster format

## Examples

### Basic Functions

```bash
# Sine wave
plot-code-lib plot --expression "sin(x)" --range "x=-10:10" --file examples/sine.svg

# Cosine wave  
plot-code-lib plot --expression "cos(x)" --range "x=-6.28:6.28" --file examples/cosine.png

# Quadratic function
plot-code-lib plot --expression "x^2" --range "x=-5:5" --file examples/quadratic.svg --title "Parabola"

# Tangent function
plot-code-lib plot --expression "tan(x/2)" --range "x=-6:6" --file examples/tangent.png
```

### Advanced Expressions

```bash
# Complex trigonometric
plot-code-lib plot --expression "sin(x) * cos(x/2)" --range "x=-12:12" --file examples/complex.svg

# Damped oscillation
plot-code-lib plot --expression "exp(-x^2/4)*sin(3*x)" --range "x=-4:4" --file examples/damped.svg

# High resolution plot
plot-code-lib plot --expression "exp(-x^2/8)*sin(2*x)" --steps 200 --range "x=-8:8" --file examples/detailed.svg
```

## Mathematical Functions

The tool supports all mathematical functions available in [mathjs](https://mathjs.org/docs/expressions/functions.html):

**Trigonometric**: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sinh`, `cosh`, `tanh`  
**Exponential/Logarithmic**: `exp`, `log`, `log10`, `log2`, `sqrt`, `cbrt`  
**Power/Root**: `pow`, `sqrt`, `nthRoot`  
**Constants**: `pi`, `e`, `i`, `Infinity`  
**Operations**: `+`, `-`, `*`, `/`, `^`, `%`, `!`

### Example Expressions

```javascript
"sin(x)"                    // Simple sine
"x^2 + 2*x + 1"            // Polynomial
"exp(-x^2/2) / sqrt(2*pi)" // Gaussian
"sin(x) + cos(2*x)"        // Superposition
"log(abs(x) + 1)"          // Logarithmic
"tan(pi*x/4)"              // Scaled tangent
```

## Library API

You can also use plot-code-lib programmatically:

```javascript
import { parseRange, generateTimeSeries, generateSVGPlot, generatePNGPlot } from '@xn-intenton-z2a/plot-code-lib';

// Parse range specification
const ranges = parseRange('x=-10:10');

// Generate data points
const points = generateTimeSeries('sin(x)', ranges, 100);

// Generate SVG
const svg = generateSVGPlot(points, { title: 'My Plot' });

// Generate PNG (returns Buffer)
const pngBuffer = await generatePNGPlot(points, { title: 'My Plot' });
```

### API Reference

#### `parseRange(rangeStr)`
Parses a range string like "x=-10:10,y=-5:5" into a range object.

#### `generateTimeSeries(expression, ranges, steps)`
Generates time series data points from a mathematical expression.

#### `generateSVGPlot(points, options)`
Creates SVG plot from data points with customizable styling.

#### `generatePNGPlot(points, options)`
Creates PNG plot from data points (async function).

## Examples Directory

The `examples/` directory contains sample plots generated by the tool:

- `sine.svg` - Basic sine wave  
- `cosine.png` - Cosine wave in PNG format
- `quadratic.svg` - Parabolic function
- `complex.svg` - Complex trigonometric expression
- `damped.svg` - Damped oscillation
- `tangent.png` - Tangent function
- `detailed.svg` - High-resolution plot (200 steps)

## Development

```bash
# Clone the repository
git clone https://github.com/your-org/plot-code-lib.git
cd plot-code-lib

# Install dependencies
npm install

# Run tests
npm test

# Test CLI locally
node src/lib/main.js plot --expression "sin(x)" --file test.svg
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Related

- [mathjs](https://mathjs.org/) - Mathematical expression evaluator
- [sharp](https://sharp.pixelplumbing.com/) - High-performance image processing

---

**plot-code-lib** - Transform mathematical expressions into beautiful visualizations with the simplicity of command-line tools like jq.