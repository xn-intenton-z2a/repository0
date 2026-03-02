# plot-code-lib

**The jq of formulae visualisations** — Transform mathematical expressions to time series data and generate SVG/PNG plots.

This library and CLI tool takes mathematical expressions and ranges, evaluates them to generate time series data, and creates beautiful plots in SVG format.

## Features

- 🔢 **Expression Parsing**: Parse mathematical expressions using standard syntax (powered by mathjs)
- 📊 **Time Series Generation**: Convert expressions to data points over specified ranges
- 📈 **SVG Plotting**: Generate clean, scalable vector graphics with D3.js
- 🔧 **CLI Interface**: Simple command-line tool for quick plotting
- ⚡ **Fast & Lightweight**: Minimal dependencies, fast execution

## Quick Start

### Installation

```bash
npm install @xn-intenton-z2a/plot-code-lib
```

### CLI Usage

Generate a sine wave:
```bash
npx plot-code-lib --expression "sin(x)" --range "x=-6:6" --file "sine.svg"
```

Generate a parabola:
```bash
npx plot-code-lib --expression "y=x^2" --range "x=-3:3" --file "parabola.svg"
```

Complex expression with custom points:
```bash
npx plot-code-lib --expression "cos(x) + sin(2*x)" --range "x=0:10" --points 200 --file "complex.svg"
```

### CLI Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `-e, --expression <expr>` | Mathematical expression | Required | `"sin(x)"`, `"y=x^2"` |
| `-r, --range <range>` | Range specification | `"x=-10:10"` | `"x=-5:5"`, `"x=-1:1,y=-1:1"` |
| `-f, --file <file>` | Output file name | `"output.svg"` | `"plot.svg"` |
| `-p, --points <points>` | Number of data points | `100` | `50`, `200` |
| `-h, --help` | Show help | - | - |

## Expression Syntax

The library supports standard mathematical expressions using [mathjs](https://mathjs.org/) syntax:

### Basic Functions
- `sin(x)`, `cos(x)`, `tan(x)` — Trigonometric functions
- `log(x)`, `ln(x)` — Logarithmic functions  
- `sqrt(x)`, `x^2`, `pow(x, 2)` — Power functions
- `abs(x)` — Absolute value
- `exp(x)` — Exponential function

### Operators
- `+`, `-`, `*`, `/` — Basic arithmetic
- `^` — Exponentiation
- `()` — Grouping

### Constants
- `pi`, `e` — Mathematical constants

### Examples
```bash
# Sine wave
--expression "sin(x)"

# Parabola with variable name
--expression "y = x^2 + 2*x + 1"

# Complex expression
--expression "sin(x) * cos(2*x) + 0.5"

# Exponential decay
--expression "exp(-x) * cos(5*x)"

# Polynomial
--expression "x^3 - 2*x^2 + x - 1"
```

## Range Specification

Ranges define the domain for plotting:

### Simple Range
```bash
--range "-5:5"          # x from -5 to 5
--range "x=-5:5"        # Same as above (explicit)
```

### Multiple Dimensions
```bash
--range "x=-5:5,y=-10:10"   # x and y ranges (y range used for axis scaling)
```

## API Usage

```javascript
import { ExpressionParser, RangeParser, TimeSeriesGenerator, SVGPlotter } from '@xn-intenton-z2a/plot-code-lib';

// Parse expression
const parser = new ExpressionParser();
const expression = parser.parse("sin(x)");

// Parse range
const rangeParser = new RangeParser();
const ranges = rangeParser.parse("x=-6:6");

// Generate data
const generator = new TimeSeriesGenerator();
const data = generator.generate(expression, ranges, 100);

// Create plot
const plotter = new SVGPlotter();
const svg = plotter.plot(data, ranges);

console.log(svg); // SVG string
```

## Example Outputs

### Sine Wave
```bash
npx plot-code-lib --expression "sin(x)" --range "x=-6:6" --file "sine.svg"
```
Generated plot with 100 points  
Expression: sin(x)  
Range: x=-6:6  
Output: sine.svg  

### Parabola
```bash
npx plot-code-lib --expression "y=x^2" --range "x=-3:3" --file "parabola.svg"
```
Generated plot with 100 points  
Expression: y=x^2  
Range: x=-3:3  
Output: parabola.svg  

### Complex Function
```bash
npx plot-code-lib --expression "sin(x) + cos(2*x)" --range "x=0:4*pi" --points 200 --file "complex.svg"
```

## Development

This project is part of the [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) ecosystem — autonomous code transformation driven by GitHub Copilot.

### Setup

```bash
git clone <repository>
npm install
npm test
```

### Testing

```bash
npm test           # Run all tests
npm run test:unit  # Run unit tests with coverage
```

### Contributing

1. Write your feature goals in [MISSION.md](MISSION.md)  
2. The autonomous workflows will create issues and implement features
3. Review and merge the generated PRs

## Architecture

- **ExpressionParser**: Parses and validates mathematical expressions using mathjs
- **RangeParser**: Parses range specifications (e.g., "x=-1:1,y=-2:2")  
- **TimeSeriesGenerator**: Evaluates expressions over ranges to generate data points
- **SVGPlotter**: Creates SVG plots using D3.js in a virtual DOM

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- [Mission](MISSION.md) — Project goals and roadmap
- [Contributing](CONTRIBUTING.md) — Development guidelines  
- [agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — Autonomous development framework
