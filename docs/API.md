# API Documentation

**plot-code-lib** provides a comprehensive JavaScript API for mathematical expression plotting and data generation.

## Table of Contents

- [Core Classes](#core-classes)
  - [ExpressionParser](#expressionparser)
  - [TimeSeriesGenerator](#timeseriesgenerator)
  - [PlotGenerator](#plotgenerator)
  - [PlotCodeLib](#plotcodelib)
- [Error Handling](#error-handling)
- [Data Formats](#data-formats)
- [Examples](#examples)

## Core Classes

### ExpressionParser

Parses and compiles mathematical expressions using MathJS with caching for performance.

#### Constructor

```javascript
const parser = new ExpressionParser();
```

#### Methods

##### `parse(expression)`

Parse and compile a mathematical expression.

**Parameters:**
- `expression` (string): Mathematical expression (e.g., "sin(x)", "x^2 + 2*x + 1")

**Returns:**
- Function: Compiled function that takes variables object and returns numeric result

**Throws:**
- Error: If expression syntax is invalid

**Example:**
```javascript
const parser = new ExpressionParser();
const func = parser.parse("sin(x) + cos(2*x)");

// Evaluate at specific points
console.log(func({ x: 0 }));        // 1
console.log(func({ x: Math.PI }));  // -1
console.log(func({ x: Math.PI/2 })); // 1
```

**Caching Behavior:**
The parser automatically caches compiled expressions for performance. Subsequent calls with the same expression return the cached function.

```javascript
const func1 = parser.parse("x^2");
const func2 = parser.parse("x^2"); 
console.log(func1 === func2); // true - same cached reference
```

---

### TimeSeriesGenerator

Generates coordinate data from mathematical expressions and outputs GeoJSON format.

#### Constructor

```javascript
const generator = new TimeSeriesGenerator(parser);
```

**Parameters:**
- `parser` (ExpressionParser): Expression parser instance

#### Methods

##### `parseRange(rangeSpec)`

Parse range specification into components.

**Parameters:**
- `rangeSpec` (string): Range specification in format "variable=start:end" or "variable=start:end:step"

**Returns:**
- Object: `{variable: string, start: number, end: number, step: number}`

**Throws:**
- Error: If range format is invalid or values cannot be evaluated

**Examples:**
```javascript
const generator = new TimeSeriesGenerator(parser);

// Basic range with automatic step (100 points)
const range1 = generator.parseRange("x=-1:1");
// Result: {variable: "x", start: -1, end: 1, step: 0.02}

// Custom step size
const range2 = generator.parseRange("x=0:10:0.5");
// Result: {variable: "x", start: 0, end: 10, step: 0.5}

// Mathematical expressions in range
const range3 = generator.parseRange("t=0:2*pi:pi/20");
// Result: {variable: "t", start: 0, end: 6.283..., step: 0.157...}
```

##### `generate(expression, rangeSpec)`

Generate coordinate data from expression and range.

**Parameters:**
- `expression` (string): Mathematical expression
- `rangeSpec` (string): Range specification

**Returns:**
- Object: GeoJSON Feature with LineString geometry

**Throws:**
- Error: If no valid data points are generated

**Example:**
```javascript
const data = generator.generate("sin(x)", "x=0:2*pi:0.1");

console.log(data);
// {
//   type: "Feature",
//   properties: {
//     expression: "sin(x)",
//     range: "x=0:2*pi:0.1"
//   },
//   geometry: {
//     type: "LineString", 
//     coordinates: [[0, 0], [0.1, 0.0998], [0.2, 0.1987], ...]
//   }
// }
```

**Domain Handling:**
The generator automatically handles mathematical edge cases:
- Complex numbers are skipped
- Infinite values (1/0) are skipped  
- NaN results are skipped
- Only finite, real coordinates are included

##### `generateParametric(xExpression, yExpression, rangeSpec)`

Generate parametric curve data.

**Parameters:**
- `xExpression` (string): X coordinate expression
- `yExpression` (string): Y coordinate expression  
- `rangeSpec` (string): Parameter range specification

**Returns:**
- Object: GeoJSON Feature with parametric metadata

**Throws:**
- Error: If no valid data points are generated

**Example:**
```javascript
// Generate unit circle
const circle = generator.generateParametric("cos(t)", "sin(t)", "t=0:2*pi");

console.log(circle);
// {
//   type: "Feature", 
//   properties: {
//     xExpression: "cos(t)",
//     yExpression: "sin(t)",
//     range: "t=0:2*pi",
//     mode: "parametric"
//   },
//   geometry: {
//     type: "LineString",
//     coordinates: [[1, 0], [0.999, 0.063], ...]
//   }
// }
```

---

### PlotGenerator

Creates SVG and PNG visualizations from GeoJSON coordinate data.

#### Constructor

```javascript
const plotter = new PlotGenerator();
```

#### Properties

- `width` (number): Plot width in pixels (default: 800)
- `height` (number): Plot height in pixels (default: 600)  
- `margins` (Object): Plot margins `{top, right, bottom, left}` (default: `{top: 40, right: 40, bottom: 60, left: 80}`)

#### Methods

##### `setDimensions(width, height)`

Set plot dimensions.

**Parameters:**
- `width` (number): Plot width in pixels
- `height` (number): Plot height in pixels

**Example:**
```javascript
const plotter = new PlotGenerator();
plotter.setDimensions(1200, 800);

console.log(plotter.width);  // 1200
console.log(plotter.height); // 800
```

##### `generateSVG(geoJsonData, options)`

Generate SVG plot from GeoJSON data.

**Parameters:**
- `geoJsonData` (Object): GeoJSON Feature or FeatureCollection
- `options` (Object): Plot configuration options

**Options:**
- `title` (string): Plot title
- `xLabel` (string): X-axis label  
- `yLabel` (string): Y-axis label

**Returns:**
- string: SVG markup

**Throws:**
- Error: If no coordinate data found in GeoJSON

**Example:**
```javascript
const geoJson = generator.generate("x^2", "x=-2:2:0.1");
const options = {
  title: "Quadratic Function",
  xLabel: "Input (x)",
  yLabel: "Output (y)"
};

const svgString = plotter.generateSVG(geoJson, options);
console.log(svgString); // "<svg width="800" height="600" ...>...</svg>"
```

**Multi-Series Support:**
The plotter supports multiple series by passing a FeatureCollection:

```javascript
const series1 = generator.generate("sin(x)", "x=0:2*pi");
const series2 = generator.generate("cos(x)", "x=0:2*pi"); 

const multiSeries = {
  type: "FeatureCollection",
  features: [series1, series2]
};

const svg = plotter.generateSVG(multiSeries, {title: "Sine and Cosine"});
```

**Automatic Scaling:**
The plot generator automatically:
- Calculates optimal axis ranges from data
- Creates linear scales for X and Y axes
- Generates axis ticks and labels
- Uses distinct colors for multiple series

##### `generatePNG(svgString)`

Convert SVG to PNG format.

**Parameters:**
- `svgString` (string): SVG markup

**Returns:**
- Promise<Buffer>: PNG image data

**Throws:**
- Error: If SVG conversion fails

**Example:**
```javascript
const svgString = plotter.generateSVG(geoJson, options);
const pngBuffer = await plotter.generatePNG(svgString);

// Save to file
import { writeFileSync } from 'fs';
writeFileSync('plot.png', pngBuffer);
```

---

### PlotCodeLib

Main application class that integrates all components with CLI interface.

#### Constructor

```javascript
const app = new PlotCodeLib();
```

Creates instances of ExpressionParser, TimeSeriesGenerator, and PlotGenerator internally.

#### Methods

##### `run()`

Run the CLI application with Commander.js argument parsing.

**Returns:**
- Promise<void>

**Example:**
```javascript
const app = new PlotCodeLib();
await app.run();
```

**CLI Commands:**
The `run()` method sets up three main commands:
- `plot`: Standard function plots
- `parametric`: Parametric curve plots  
- `export`: Data export without visualization

##### `generatePlot(options)`

Generate a standard function plot.

**Parameters:**
- `options` (Object): CLI options object

**Options:**
- `expression` (string): Mathematical expression
- `range` (string): Variable range specification
- `output` (string): Output file path (.svg or .png)
- `title` (string, optional): Plot title
- `width` (string, optional): Plot width (default: "800")
- `height` (string, optional): Plot height (default: "600")  
- `xlabel` (string, optional): X-axis label (default: "x")
- `ylabel` (string, optional): Y-axis label (default: "y")

**Returns:**
- Promise<void>

**Throws:**
- Error: If file extension is not .svg or .png

**Example:**
```javascript
const options = {
  expression: "sin(x)",
  range: "x=0:2*pi",
  output: "sine.svg",
  title: "Sine Wave",
  width: "1200",
  height: "800",
  xlabel: "Angle (rad)",
  ylabel: "Amplitude"
};

await app.generatePlot(options);
console.log("SVG plot saved to sine.svg");
```

##### `generateParametricPlot(options)`

Generate a parametric curve plot.

**Parameters:**
- `options` (Object): CLI options object

**Options:**  
- `xexpr` (string): X coordinate expression
- `yexpr` (string): Y coordinate expression
- `range` (string): Parameter range specification
- `output` (string): Output file path (.svg or .png)
- `title`, `width`, `height`, `xlabel`, `ylabel`: Same as `generatePlot()`

**Returns:**
- Promise<void>

**Example:**
```javascript
const options = {
  xexpr: "cos(t)",
  yexpr: "sin(t)", 
  range: "t=0:2*pi",
  output: "circle.svg",
  title: "Unit Circle"
};

await app.generateParametricPlot(options);
```

##### `exportData(options)`

Export coordinate data in specified format.

**Parameters:**
- `options` (Object): CLI options object

**Options:**
- `expression` (string): Mathematical expression  
- `range` (string): Variable range specification
- `output` (string): Output file path
- `format` (string): Output format ("geojson", "csv", "json")

**Returns:**
- Promise<void>

**Example:**
```javascript
const options = {
  expression: "x^2",
  range: "x=-5:5:0.5", 
  output: "quadratic.csv",
  format: "csv"
};

await app.exportData(options);
console.log("CSV data exported to quadratic.csv");
```

**Export Formats:**

1. **GeoJSON** (default): Standard geographic data format
   ```json
   {
     "type": "Feature",
     "properties": {"expression": "sin(x)", "range": "x=0:2*pi"},
     "geometry": {"type": "LineString", "coordinates": [[0,0], [0.1,0.1]]}
   }
   ```

2. **CSV**: Spreadsheet-compatible format
   ```csv
   x,y
   0,0
   0.1,0.09983341664682815
   0.2,0.19866933079506122
   ```

3. **JSON**: Simple coordinate array format
   ```json
   {
     "expression": "sin(x)",
     "range": "x=0:2*pi", 
     "data": [[0,0], [0.1,0.0998], [0.2,0.1987]]
   }
   ```

---

## Error Handling

All classes implement comprehensive error handling:

### ExpressionParser Errors

```javascript
try {
  const func = parser.parse("invalid_syntax(");
} catch (error) {
  console.error('Parse Error:', error.message);
  // "Failed to parse expression "invalid_syntax(": Parenthesis ) expected"
}
```

### TimeSeriesGenerator Errors

```javascript
try {
  const data = generator.generate("sqrt(x)", "x=-5:5");
} catch (error) {
  console.error('Generation Error:', error.message);
  // "No valid data points generated from expression"
}
```

### Range Parsing Errors

```javascript
try {
  const range = generator.parseRange("invalid_range");
} catch (error) {
  console.error('Range Error:', error.message);  
  // "Invalid range format: invalid_range. Use format: variable=start:end or variable=start:end:step"
}
```

### PlotGenerator Errors

```javascript
try {
  const svg = plotter.generateSVG({geometry: {coordinates: []}});
} catch (error) {
  console.error('Plot Error:', error.message);
  // "No coordinate data found in GeoJSON"
}
```

### PNG Conversion Errors

```javascript
try {
  const png = await plotter.generatePNG("invalid_svg");
} catch (error) {
  console.error('PNG Error:', error.message);
  // "Failed to convert SVG to PNG: ..."
}
```

---

## Data Formats

### Input Expression Syntax

Uses **MathJS** syntax for maximum compatibility:

```javascript
// Arithmetic operators
"x + 2"           // Addition
"x - 1"           // Subtraction  
"2 * x"           // Multiplication
"x / 3"           // Division
"x ^ 2"           // Exponentiation
"x % 3"           // Modulo

// Mathematical functions
"sin(x)"          // Trigonometric
"exp(x)"          // Exponential
"log(x)"          // Natural logarithm
"sqrt(x)"         // Square root
"abs(x)"          // Absolute value

// Constants
"pi"              // π ≈ 3.14159
"e"               // e ≈ 2.71828
"phi"             // Golden ratio ≈ 1.618

// Complex expressions
"sin(x) + cos(2*x)"
"exp(-x^2 / 2) / sqrt(2*pi)"
"x >= 0 ? x^2 : -x^2"
```

### Range Specifications

```javascript
"x=0:10"          // 100 points from 0 to 10
"x=0:10:0.5"      // Custom step size
"t=0:2*pi:0.1"    // Using mathematical expressions
"x=-pi/2:pi/2"    // Negative and fractional values  
"x=1e-3:1e3"      // Scientific notation
```

### GeoJSON Output Format

Standard GeoJSON Feature with LineString geometry:

```javascript
{
  "type": "Feature",
  "properties": {
    "expression": "sin(x)",
    "range": "x=0:2*pi:0.1"
    // For parametric: "xExpression", "yExpression", "mode": "parametric"
  },
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [0, 0],                    // [x, y] coordinate pairs
      [0.1, 0.09983341664682815],
      [0.2, 0.19866933079506122],
      // ... more points
    ]
  }
}
```

---

## Examples

### Basic Programmatic Usage

```javascript
import { ExpressionParser, TimeSeriesGenerator, PlotGenerator } from 'plot-code-lib';

// Initialize components
const parser = new ExpressionParser();
const generator = new TimeSeriesGenerator(parser);
const plotter = new PlotGenerator();

// Generate function plot
const data = generator.generate("sin(x) + 0.5*cos(3*x)", "x=0:2*pi:0.05");
const svg = plotter.generateSVG(data, {
  title: "Complex Trigonometric Function",
  xLabel: "x (radians)", 
  yLabel: "f(x)"
});

// Save SVG
import { writeFileSync } from 'fs';
writeFileSync('complex-trig.svg', svg);
```

### Parametric Curves

```javascript
// Generate heart curve (cardioid)
const heartData = generator.generateParametric(
  "16*sin(t)^3", 
  "13*cos(t)-5*cos(2*t)-2*cos(3*t)-cos(4*t)",
  "t=0:2*pi:0.05"
);

plotter.setDimensions(800, 800); // Square aspect ratio
const heartSvg = plotter.generateSVG(heartData, {
  title: "Parametric Heart Curve",
  xlabel: "x",
  ylabel: "y"
});

writeFileSync('heart.svg', heartSvg);
```

### Multi-Series Plots

```javascript
// Compare multiple functions
const sine = generator.generate("sin(x)", "x=0:2*pi:0.1");
const cosine = generator.generate("cos(x)", "x=0:2*pi:0.1"); 
const tangent = generator.generate("tan(x)", "x=-pi/2:pi/2:0.1");

const multiSeries = {
  type: "FeatureCollection",
  features: [sine, cosine, tangent]
};

const comparisonSvg = plotter.generateSVG(multiSeries, {
  title: "Trigonometric Functions Comparison"
});

writeFileSync('trig-comparison.svg', comparisonSvg);
```

### PNG Generation

```javascript
// High-resolution PNG for publications
plotter.setDimensions(1920, 1080);

const data = generator.generate("exp(-x^2/2)/sqrt(2*pi)", "x=-4:4:0.01");
const svg = plotter.generateSVG(data, {
  title: "Standard Normal Distribution",
  xLabel: "Standard Deviations (σ)",
  yLabel: "Probability Density"
});

const pngBuffer = await plotter.generatePNG(svg);
writeFileSync('normal-distribution.png', pngBuffer);
```

### Data Export Workflows

```javascript
// Export for analysis in other tools
const data = generator.generate("sin(2*pi*x) + 0.1*random()", "x=0:10:0.01");

// GeoJSON format (preserves metadata)
writeFileSync('noisy-sine.geojson', JSON.stringify(data, null, 2));

// Extract coordinates for CSV
const coordinates = data.geometry.coordinates;
const csvLines = ['x,y'];
coordinates.forEach(([x, y]) => csvLines.push(`${x},${y}`));
writeFileSync('noisy-sine.csv', csvLines.join('\n'));

// Simple JSON format
const simpleFormat = {
  expression: data.properties.expression,
  range: data.properties.range,
  points: coordinates.length,
  data: coordinates
};
writeFileSync('noisy-sine.json', JSON.stringify(simpleFormat, null, 2));
```

This comprehensive API documentation covers all public methods, parameters, return values, error conditions, and practical examples for effective use of the plot-code-lib library.