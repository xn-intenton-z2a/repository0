# plot-code-lib

_"Be a go-to plot library with a CLI, be the jq of formulae visualisations."_

**plot-code-lib** is a JavaScript library and CLI tool designed to transform mathematical expressions into beautiful plots. It reads expressions in a simple syntax and generates time series data, then creates stunning SVG and PNG visualizations.

## 🚀 Features

- **📐 Expression Parsing**: Support for mathematical expressions with intuitive syntax
- **📊 Multiple Plot Types**: Cartesian, parametric, and polar coordinate systems
- **🎨 Beautiful Output**: Generate SVG and PNG plots with customizable dimensions
- **🔧 CLI Interface**: Simple command-line tool with comprehensive options
- **📏 Flexible Ranges**: Support for mathematical expressions in ranges (π, 2π, etc.)
- **⚡ Fast Rendering**: Efficient data generation with configurable point counts

## 📦 Installation

```bash
npm install plot-code-lib
```

## 🔨 Usage

### Command Line Interface

#### Basic Usage
```bash
# Simple sine wave
plot-code-lib -e 'y=sin(x)' -f sine.svg

# Quadratic function with custom range
plot-code-lib -e 'y=x^2' -r 'x=-5:5,y=0:25' -f parabola.png
```

#### Advanced Examples
```bash
# Parametric spiral
plot-code-lib -e 'x=t*cos(t),y=t*sin(t)' -r 't=0:10π' -f spiral.svg

# Polar rose
plot-code-lib -e 'r=sin(4*theta)' -r 'theta=0:2π' -f rose.svg

# Multiple functions with custom styling
plot-code-lib -e 'y=sin(x),y=cos(x)' -r 'x=-π:π,y=-1.5:1.5' \\
  --width 1200 --height 800 --title 'Trigonometric Functions' -f trig.svg
```

### CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `-e, --expression <expr>` | Mathematical expression to plot | `y=sin(x)` |
| `-r, --range <range>` | Range for variables | `x=-10:10,y=-10:10` |
| `-f, --file <path>` | Output file path (.svg or .png) | `output.svg` |
| `-w, --width <pixels>` | Plot width in pixels | `800` |
| `-h, --height <pixels>` | Plot height in pixels | `600` |
| `--points <number>` | Number of data points | `1000` |
| `--format <format>` | Output format (svg\\|png) | `svg` |
| `--title <title>` | Plot title | |
| `--dry-run` | Show what would be done | |

### Expression Formats

#### Cartesian (y = f(x))
```bash
plot-code-lib -e 'y=sin(x)' -r 'x=-2π:2π'
plot-code-lib -e 'y=x^2 + 2*x + 1' -r 'x=-10:10'
plot-code-lib -e 'y=log(x)' -r 'x=0.1:10'
```

#### Parametric (x = f(t), y = g(t))
```bash
plot-code-lib -e 'x=cos(t),y=sin(t)' -r 't=0:2π'
plot-code-lib -e 'x=t*cos(t),y=t*sin(t)' -r 't=0:6π'
plot-code-lib -e 'x=3*cos(t),y=2*sin(t)' -r 't=0:2π'
```

#### Polar (r = f(θ))
```bash
plot-code-lib -e 'r=1+cos(theta)' -r 'theta=0:2π'
plot-code-lib -e 'r=sin(3*theta)' -r 'theta=0:π'
plot-code-lib -e 'r=theta' -r 'theta=0:6π'
```

## 🎯 Examples

### 🌊 Sine Wave
```bash
plot-code-lib -e 'y=sin(x)' -r 'x=-2π:2π,y=-2:2' \\
  --title 'Beautiful Sine Wave' -f sine.svg
```

### 📈 Parabola
```bash
plot-code-lib -e 'y=x^2' -r 'x=-5:5,y=0:25' \\
  --width 600 --height 400 -f parabola.png
```

### 🌀 Parametric Spiral
```bash
plot-code-lib -e 'x=t*cos(t),y=t*sin(t)' -r 't=0:10π' \\
  --points 2000 --title 'Archimedean Spiral' -f spiral.svg
```

### 🌹 Polar Rose
```bash
plot-code-lib -e 'r=sin(4*theta)' -r 'theta=0:2π' \\
  --title 'Four-Petaled Rose' -f rose.svg
```

### 📊 Multiple Functions
```bash
plot-code-lib -e 'y=sin(x),y=cos(x)' -r 'x=-π:π,y=-1.5:1.5' \\
  --title 'Trigonometric Comparison' -f trig.svg
```

## 🧮 Mathematical Functions

Supported functions include:
- **Trigonometric**: `sin(x)`, `cos(x)`, `tan(x)`, `sec(x)`, `csc(x)`, `cot(x)`
- **Inverse Trig**: `asin(x)`, `acos(x)`, `atan(x)`, `atan2(y,x)`
- **Hyperbolic**: `sinh(x)`, `cosh(x)`, `tanh(x)`
- **Logarithmic**: `log(x)`, `log10(x)`, `log2(x)`, `ln(x)`
- **Exponential**: `exp(x)`, `sqrt(x)`, `cbrt(x)`, `pow(x,y)`
- **Constants**: `pi`, `e`, `π`

## 📋 Range Specification

Ranges support mathematical expressions:
```bash
-r 'x=-π:π'              # Pi notation
-r 'x=-2*pi:2*pi'        # Mathematical expressions
-r 'x=0:10,y=-5:5'       # Multiple variables
-r 't=0:4π'              # Parametric ranges
-r 'theta=0:2π'          # Polar ranges
```

## 🎨 Output Formats

### SVG (Vector Graphics)
- Scalable and crisp at any size
- Smaller file sizes for simple plots
- Ideal for web and print

### PNG (Raster Graphics)
- Fixed resolution
- Good for complex visualizations
- Compatible with all image viewers

## 🔧 JavaScript API

```javascript
import { ExpressionPlotter, parseExpression, parseRange } from 'plot-code-lib';

// Parse expression
const expr = parseExpression('y=sin(x)');
const ranges = parseRange('x=-2π:2π,y=-2:2');

// Create plotter
const plotter = new ExpressionPlotter({
  width: 800,
  height: 600,
  title: 'My Plot'
});

// Generate plot
await plotter.plot(expr, ranges, {
  points: 1000,
  outputFile: 'output.svg'
});
```

## 🧪 Dry Run Mode

Test your commands without generating files:
```bash
plot-code-lib -e 'y=sin(x)' -r 'x=-2π:2π' --dry-run
```

Output:
```
📐 Expression: y=sin(x)
📊 Range: x=[-6.28, 6.28], y=[-10, 10]
🔍 Dry run mode - would generate 1000 points
📁 Would save to: output.svg
📏 Dimensions: 800x600px
```

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**plot-code-lib** - Transform mathematical expressions into beautiful plots. Be the jq of formulae visualisations! ✨