# plot-code-lib

_"Be a go-to plot library with a CLI, be the jq of formulae visualisations."_

**plot-code-lib** is a JavaScript library and CLI tool designed to transform mathematical expressions into beautiful visualizations. Generate SVG and PNG plots from simple mathematical expressions with an easy-to-use command-line interface.

## Features

- **Mathematical Expression Parser**: Parse and evaluate expressions like `y=sin(x)`, `y=x^2`, `r=cos(theta)`
- **Time Series Generation**: Convert expressions and ranges into coordinate data
- **SVG Plot Rendering**: Generate high-quality vector graphics with grids and axes
- **CLI Interface**: Command-line tool for quick mathematical visualizations
- **Standard Formats**: Input/output using standard data formats

## Installation

```bash
npm install @xn-intenton-z2a/plot-code-lib
```

Or use directly with npx:

```bash
npx @xn-intenton-z2a/plot-code-lib --expression "y=sin(x)" --range "x=-pi:pi" --output sine.svg
```

## CLI Usage

### Basic Command Structure

```bash
plot-code --expression "EXPR" --range "RANGE" --output "FILE"
```

### Examples

#### Sine Wave
```bash
plot-code --expression "y=sin(x)" --range "x=-pi:pi" --output sine.svg
```

#### Cosine with Custom Range
```bash
plot-code --expression "y=cos(x)" --range "x=-2*pi:2*pi" --output cosine.svg
```

#### Quadratic Function
```bash
plot-code --expression "y=x^2" --range "x=-5:5" --output quadratic.svg
```

#### Logarithmic Function with Custom Step Size
```bash
plot-code --expression "y=log(x)" --range "x=0.1:0.1:10" --output log.svg
```

#### Complex Expression
```bash
plot-code --expression "y=sin(x)*cos(x)" --range "x=0:0.1:4*pi" --output sincos.svg
```

#### Exponential Decay
```bash
plot-code --expression "y=exp(-x)" --range "x=0:5" --output decay.svg
```

### Command Options

| Option | Short | Description | Example |
|--------|-------|-------------|---------|
| `--expression` | `-e` | Mathematical expression to plot | `"y=sin(x)"` |
| `--range` | `-r` | Variable range specification | `"x=-pi:pi"` |
| `--output` | `-o` | Output file path | `"plot.svg"` |
| `--file` | `-f` | Alias for --output | `"plot.svg"` |
| `--help` | `-h` | Show help message | |
| `--version` | `-v` | Show version information | |

### Expression Syntax

#### Supported Functions
- `sin(x)`, `cos(x)`, `tan(x)` - Trigonometric functions
- `log(x)` - Natural logarithm
- `sqrt(x)` - Square root
- `abs(x)` - Absolute value
- `exp(x)` - Exponential function (e^x)

#### Supported Constants
- `pi` - π (3.14159...)
- `e` - Euler's number (2.71828...)

#### Supported Operations
- `+` - Addition
- `-` - Subtraction
- `*` - Multiplication
- `/` - Division
- `^` - Exponentiation (power)

#### Expression Examples
```bash
y=sin(x)           # Simple sine function
y=2*x + 3          # Linear function
y=x^2 - 4*x + 3    # Quadratic function
y=exp(-x^2)        # Gaussian function
y=sin(x)/x         # Sinc function
y=log(abs(x))      # Logarithm of absolute value
```

### Range Syntax

#### Format Options
```bash
x=start:end           # 100 steps between start and end
x=start:step:end      # Custom step size
```

#### Range Examples
```bash
x=-pi:pi              # From -π to π with 100 steps
x=-10:0.5:10          # From -10 to 10 with step size 0.5
x=0.1:0.1:5           # From 0.1 to 5 with step size 0.1
```

#### Using Constants in Ranges
```bash
x=-2*pi:2*pi          # From -2π to 2π
x=-e:e                # From -e to e
x=0:pi/4:2*pi         # From 0 to 2π with step π/4
```

## Library Usage

### Import and Use

```javascript
import { main } from '@xn-intenton-z2a/plot-code-lib';

// Generate plot programmatically
main(['--expression', 'y=sin(x)', '--range', 'x=-pi:pi', '--output', 'output.svg']);
```

### Components

The library consists of several key components:

- **ExpressionParser**: Parses mathematical expressions
- **RangeParser**: Parses range specifications
- **TimeSeriesGenerator**: Generates coordinate data
- **SVGRenderer**: Creates SVG plots

## Output Format

The tool generates SVG files with the following features:

- **Grid**: Light gray grid lines for easy reading
- **Axes**: Black coordinate axes with proper scaling
- **Plot Line**: Blue line showing the mathematical function
- **Labels**: Variable names on axes
- **Proper Scaling**: Automatic scaling with padding for optimal visualization

## Advanced Examples

### Multiple Mathematical Concepts

```bash
# Trigonometric identity
plot-code --expression "y=sin(x)^2+cos(x)^2" --range "x=0:2*pi" --output identity.svg

# Damped oscillation
plot-code --expression "y=exp(-x/4)*sin(2*x)" --range "x=0:20" --output damped.svg

# Hyperbolic functions (using exp)
plot-code --expression "y=(exp(x)-exp(-x))/2" --range "x=-3:3" --output sinh.svg

# Polynomial with multiple terms
plot-code --expression "y=x^4-5*x^2+4" --range "x=-3:3" --output poly.svg
```

### Scientific Functions

```bash
# Normal distribution approximation
plot-code --expression "y=exp(-x^2/2)" --range "x=-4:4" --output gaussian.svg

# Logistic function
plot-code --expression "y=1/(1+exp(-x))" --range "x=-6:6" --output logistic.svg

# Power law
plot-code --expression "y=x^(-2)" --range "x=0.1:10" --output power.svg
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:unit
```

## Development

### Project Structure

```
plot-code-lib/
├── src/lib/main.js          # Main library and CLI
├── tests/unit/main.test.js  # Test suite
├── package.json             # Package configuration
└── README.md               # This file
```

### Building

No build step required - uses ES modules directly.

```bash
npm run build  # Outputs: "Nothing to build"
```

### Running Locally

```bash
# Run with node
node src/lib/main.js --expression "y=sin(x)" --range "x=-pi:pi"

# Or use npm script
npm start -- --expression "y=sin(x)" --range "x=-pi:pi"
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Roadmap

- [ ] PNG output support
- [ ] Parametric equations support (x=f(t), y=g(t))
- [ ] Polar coordinate plotting
- [ ] Multiple function plotting on same axes
- [ ] Custom color schemes
- [ ] Interactive SVG with zoom/pan
- [ ] 3D plotting support
- [ ] Animation support for time-varying functions

---

**plot-code-lib** - Transform mathematical expressions into beautiful visualizations with the simplicity of a command-line tool.
