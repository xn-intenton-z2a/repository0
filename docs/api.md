# API Documentation

**plot-code-lib** provides a comprehensive JavaScript API for programmatic mathematical plotting and data generation. This document covers all classes, methods, and interfaces available for integration into your applications.

## Table of Contents

- [ExpressionParser](#expressionparser)
- [TimeSeriesGenerator](#timeseriesgenerator)
- [PlotGenerator](#plotgenerator)
- [PlotCodeLib](#plotcodelib)
- [Type Definitions](#type-definitions)
- [Examples](#examples)

---

## ExpressionParser

Mathematical expression parser using MathJS for compilation and evaluation.

### Constructor

```javascript
const parser = new ExpressionParser()
```

Creates a new expression parser with internal compilation cache for performance optimization.

### Methods

#### `parse(expression)`

Parse and compile a mathematical expression into an evaluable function.

**Parameters:**
- `expression` (string): Mathematical expression using MathJS syntax

**Returns:**
- `Function`: Compiled function that accepts variable object and returns result

**Throws:**
- `Error`: If expression syntax is invalid

**Example:**
```javascript
const parser = new ExpressionParser();
const func = parser.parse("sin(x) + cos(2*x)");
const result = func({ x: Math.PI }); // Evaluates expression at x = π
```

**Supported Expression Syntax:**
- **Arithmetic**: `+`, `-`, `*`, `/`, `^`, `%`
- **Functions**: `sin`, `cos`, `tan`, `exp`, `log`, `sqrt`, `abs`, etc.
- **Constants**: `pi`, `e`, `phi` (golden ratio)
- **Conditionals**: `x > 0 ? x : -x` (ternary operator)
- **Complex**: Nested functions like `sin(cos(x^2))`

---

## TimeSeriesGenerator

Generates coordinate data from mathematical expressions using open standards (GeoJSON format).

### Constructor

```javascript
const generator = new TimeSeriesGenerator(parser)
```

**Parameters:**
- `parser` (ExpressionParser): Expression parser instance

### Methods

#### `parseRange(rangeSpec)`

Parse range specification string into structured range parameters.

**Parameters:**
- `rangeSpec` (string): Range in format `"variable=start:end"` or `"variable=start:end:step"`

**Returns:**
- `Object`: `{ variable: string, start: number, end: number, step: number }`

**Throws:**
- `Error`: If range format is invalid or values cannot be evaluated

**Examples:**
```javascript
// Basic range with automatic step (100 points)
generator.parseRange("x=0:10"); 
// → { variable: "x", start: 0, end: 10, step: 0.1 }

// Custom step size
generator.parseRange("x=0:2*pi:0.1"); 
// → { variable: "x", start: 0, end: 6.28..., step: 0.1 }

// Mathematical expressions in range
generator.parseRange("t=-pi:pi:pi/50");
// → { variable: "t", start: -3.14..., end: 3.14..., step: 0.0628... }
```

#### `generate(expression, rangeSpec)`

Generate coordinate data from mathematical expression over specified range.

**Parameters:**
- `expression` (string): Mathematical expression
- `rangeSpec` (string): Range specification

**Returns:**
- `GeoJsonFeature`: GeoJSON LineString feature with coordinate data

**Throws:**
- `Error`: If no valid data points are generated

**Example:**
```javascript
const data = generator.generate("sin(x)", "x=0:2*pi:0.1");
// Returns GeoJSON feature with sine wave coordinates
```

**GeoJSON Output Structure:**
```javascript
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

#### `generateParametric(xExpression, yExpression, rangeSpec)`

Generate parametric curve data from separate X and Y expressions.

**Parameters:**
- `xExpression` (string): X coordinate expression
- `yExpression` (string): Y coordinate expression  
- `rangeSpec` (string): Parameter range specification

**Returns:**
- `GeoJsonFeature`: GeoJSON LineString feature for parametric curve

**Example:**
```javascript
// Generate unit circle
const circle = generator.generateParametric("cos(t)", "sin(t)", "t=0:2*pi");

// Generate heart curve
const heart = generator.generateParametric(
  "16*sin(t)^3", 
  "13*cos(t)-5*cos(2*t)-2*cos(3*t)-cos(4*t)", 
  "t=0:2*pi"
);
```

---

## PlotGenerator

Creates SVG and PNG visualizations from GeoJSON coordinate data using D3.js.

### Constructor

```javascript
const plotter = new PlotGenerator()
```

Creates plot generator with default dimensions (800×600) and margins.

### Properties

- `width` (number): Plot width in pixels (default: 800)
- `height` (number): Plot height in pixels (default: 600)  
- `margins` (object): Plot margins `{ top: 40, right: 40, bottom: 60, left: 80 }`

### Methods

#### `setDimensions(width, height)`

Configure plot dimensions.

**Parameters:**
- `width` (number): Plot width in pixels
- `height` (number): Plot height in pixels

**Example:**
```javascript
plotter.setDimensions(1200, 800); // High resolution plot
```

#### `generateSVG(geoJsonData, options)`

Generate SVG markup from GeoJSON coordinate data.

**Parameters:**
- `geoJsonData` (GeoJsonFeature | FeatureCollection): Coordinate data
- `options` (object, optional): Plot customization options

**Returns:**
- `string`: Complete SVG markup

**Throws:**
- `Error`: If no coordinate data found

**Options Object:**
```javascript
{
  title: "Plot Title",        // Main plot title
  xLabel: "X Axis Label",     // X-axis label (default: "x")
  yLabel: "Y Axis Label",     // Y-axis label (default: "y")
}
```

**Example:**
```javascript
const svg = plotter.generateSVG(geoJsonData, {
  title: "Trigonometric Functions",
  xLabel: "Angle (radians)",
  yLabel: "Amplitude"
});
```

**SVG Features:**
- Automatic scaling based on data extent
- D3.js axis generation with tick marks and labels
- Multiple curve support with distinct colors
- Responsive text sizing and positioning
- Clean, publication-quality output

#### `generatePNG(svgString)`

Convert SVG markup to PNG format using Sharp library.

**Parameters:**
- `svgString` (string): Complete SVG markup

**Returns:**
- `Promise<Buffer>`: PNG image buffer

**Throws:**
- `Error`: If SVG conversion fails

**Example:**
```javascript
const svg = plotter.generateSVG(data);
const pngBuffer = await plotter.generatePNG(svg);
fs.writeFileSync('output.png', pngBuffer);
```

---

## PlotCodeLib

Main application class providing high-level plotting operations and CLI functionality.

### Constructor

```javascript
const app = new PlotCodeLib()
```

Creates application instance with initialized parser, generator, and plotter components.

### Properties

- `parser` (ExpressionParser): Expression parser instance
- `generator` (TimeSeriesGenerator): Time series data generator
- `plotter` (PlotGenerator): Plot visualization generator

### Methods

#### `generatePlot(options)`

Generate standard mathematical function plot.

**Parameters:**
- `options` (object): Plot generation options

**Returns:**
- `Promise<void>`: Resolves when plot is saved to file

**Options Object:**
```javascript
{
  expression: "sin(x)",        // Required: Mathematical expression
  range: "x=0:2*pi",          // Required: Variable range
  output: "output.svg",        // Required: Output file path
  title: "Plot Title",         // Optional: Plot title
  width: "800",               // Optional: Plot width (string)
  height: "600",              // Optional: Plot height (string)
  xlabel: "x",                // Optional: X-axis label
  ylabel: "y"                 // Optional: Y-axis label
}
```

#### `generateParametricPlot(options)`

Generate parametric curve plot.

**Parameters:**
- `options` (object): Parametric plot options

**Returns:**
- `Promise<void>`: Resolves when plot is saved

**Options Object:**
```javascript
{
  xexpr: "cos(t)",            // Required: X coordinate expression
  yexpr: "sin(t)",            // Required: Y coordinate expression  
  range: "t=0:2*pi",          // Required: Parameter range
  output: "circle.svg",        // Required: Output file path
  title: "Unit Circle",        // Optional: Plot title
  width: "800",               // Optional: Plot width
  height: "600",              // Optional: Plot height
  xlabel: "x",                // Optional: X-axis label
  ylabel: "y"                 // Optional: Y-axis label
}
```

#### `exportData(options)`

Export coordinate data in specified format without visualization.

**Parameters:**
- `options` (object): Export options

**Returns:**
- `Promise<void>`: Resolves when data is exported

**Options Object:**
```javascript
{
  expression: "x^2",          // Required: Mathematical expression
  range: "x=-5:5",            // Required: Variable range  
  output: "data.json",        // Required: Output file path
  format: "geojson"           // Optional: "geojson", "csv", "json"
}
```

**Export Formats:**
- **geojson**: Complete GeoJSON Feature with metadata
- **csv**: Simple comma-separated values (x,y header)
- **json**: Simplified JSON with expression metadata

#### `run()`

Execute CLI application with command-line argument parsing.

**Returns:**
- `Promise<void>`: Resolves when CLI execution completes

**Usage:**
```javascript
const app = new PlotCodeLib();
await app.run(); // Processes process.argv automatically
```

---

## Type Definitions

### GeoJsonFeature

```typescript
interface GeoJsonFeature {
  type: "Feature";
  properties: {
    expression?: string;
    range?: string;
    xExpression?: string;    // For parametric curves
    yExpression?: string;    // For parametric curves
    mode?: "parametric";     // For parametric curves
  };
  geometry: {
    type: "LineString";
    coordinates: [number, number][]; // Array of [x, y] coordinate pairs
  };
}
```

### Range

```typescript
interface Range {
  variable: string;  // Variable name (e.g., "x", "t")
  start: number;     // Range start value
  end: number;       // Range end value
  step: number;      // Step size between points
}
```

---

## Examples

### Basic Library Usage

```javascript
import { ExpressionParser, TimeSeriesGenerator, PlotGenerator } from 'plot-code-lib';
import fs from 'fs';

// 1. Parse mathematical expressions
const parser = new ExpressionParser();
const quadratic = parser.parse("x^2 - 4*x + 3");
console.log(quadratic({ x: 2 })); // → -1

// 2. Generate coordinate data
const generator = new TimeSeriesGenerator(parser);
const data = generator.generate("sin(x) + 0.5*cos(3*x)", "x=0:2*pi:0.1");

// 3. Create visualization
const plotter = new PlotGenerator();
plotter.setDimensions(1200, 800);
const svg = plotter.generateSVG(data, {
  title: "Complex Trigonometric Function",
  xLabel: "Angle (radians)",
  yLabel: "Amplitude"
});

// 4. Save to file
fs.writeFileSync('complex-trig.svg', svg);
```

### Multiple Function Comparison

```javascript
// Generate multiple datasets
const sine = generator.generate("sin(x)", "x=0:2*pi:0.05");
const cosine = generator.generate("cos(x)", "x=0:2*pi:0.05");
const tangent = generator.generate("tan(x)", "x=-pi/2+0.1:pi/2-0.1:0.05");

// Create feature collection
const featureCollection = {
  type: "FeatureCollection",
  features: [sine, cosine, tangent]
};

// Plot all functions together
const svg = plotter.generateSVG(featureCollection, {
  title: "Trigonometric Function Comparison"
});
```

### Parametric Curves

```javascript
// Rose curve (mathematical flower)
const rose = generator.generateParametric(
  "cos(5*t) * cos(t)", 
  "cos(5*t) * sin(t)", 
  "t=0:pi:0.01"
);

// Lissajous curve  
const lissajous = generator.generateParametric(
  "sin(3*t)", 
  "sin(2*t)", 
  "t=0:2*pi:0.01"
);

// Create high-resolution plots
plotter.setDimensions(1920, 1080);
const roseSvg = plotter.generateSVG(rose, { title: "Rose Curve" });
const lissajousSvg = plotter.generateSVG(lissajous, { title: "Lissajous Curve" });
```

### Data Export Pipeline

```javascript
// Export data in different formats
const expression = "exp(-x/2) * sin(5*x)";
const range = "x=0:10:0.01";

// Generate raw data
const data = generator.generate(expression, range);

// Export as GeoJSON (standard format)
fs.writeFileSync('data.geojson', JSON.stringify(data, null, 2));

// Export as CSV for spreadsheet analysis
const csvLines = ['x,y'];
data.geometry.coordinates.forEach(([x, y]) => {
  csvLines.push(`${x},${y}`);
});
fs.writeFileSync('data.csv', csvLines.join('\n'));

// Export as simple JSON
const simpleJson = {
  expression: expression,
  range: range,
  points: data.geometry.coordinates.length,
  data: data.geometry.coordinates
};
fs.writeFileSync('data.json', JSON.stringify(simpleJson, null, 2));
```

### Error Handling

```javascript
try {
  // Invalid expression
  const func = parser.parse("invalid_function(x)");
} catch (error) {
  console.error("Expression error:", error.message);
}

try {
  // Invalid range
  const data = generator.generate("sin(x)", "invalid_range");
} catch (error) {
  console.error("Range error:", error.message);
}

try {
  // Domain issues (e.g., log of negative numbers)
  const data = generator.generate("log(x)", "x=-5:5");
  // Will succeed but skip invalid points
  console.log(`Generated ${data.geometry.coordinates.length} valid points`);
} catch (error) {
  console.error("Generation error:", error.message);
}
```

### Performance Optimization

```javascript
// Cache parser for repeated use
const parser = new ExpressionParser();
const expressions = ["sin(x)", "cos(x)", "tan(x)", "sin(x)"];

// First parse caches the compiled expression
expressions.forEach(expr => {
  const func = parser.parse(expr); // "sin(x)" reuses cached version
});

// Optimize range for smooth curves
const highFreq = generator.generate("sin(50*x)", "x=0:1:0.001"); // Small step for high frequency
const lowFreq = generator.generate("sin(0.5*x)", "x=0:10:0.1");   // Larger step for low frequency

// Batch processing
const functions = ["x^2", "x^3", "sqrt(x)", "log(x)"];
const plots = functions.map(expr => {
  const data = generator.generate(expr, "x=0.1:10:0.1");
  return plotter.generateSVG(data, { title: `Function: ${expr}` });
});
```

---

## Integration Patterns

### Web Application Integration

```javascript
// Express.js route for dynamic plot generation
app.post('/api/plot', async (req, res) => {
  try {
    const { expression, range, format } = req.body;
    
    const generator = new TimeSeriesGenerator(new ExpressionParser());
    const data = generator.generate(expression, range);
    
    if (format === 'svg') {
      const plotter = new PlotGenerator();
      const svg = plotter.generateSVG(data);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    } else {
      res.json(data);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### React Component Integration

```javascript
import { useEffect, useState } from 'react';
import { ExpressionParser, TimeSeriesGenerator, PlotGenerator } from 'plot-code-lib';

function MathPlot({ expression, range, title }) {
  const [svgContent, setSvgContent] = useState('');
  
  useEffect(() => {
    const parser = new ExpressionParser();
    const generator = new TimeSeriesGenerator(parser);
    const plotter = new PlotGenerator();
    
    try {
      const data = generator.generate(expression, range);
      const svg = plotter.generateSVG(data, { title });
      setSvgContent(svg);
    } catch (error) {
      console.error('Plot generation error:', error);
    }
  }, [expression, range, title]);
  
  return <div dangerouslySetInnerHTML={{ __html: svgContent }} />;
}
```

### Node.js Batch Processing

```javascript
// Generate multiple plots from configuration
const configurations = [
  { expr: "sin(x)", range: "x=0:2*pi", title: "Sine Wave" },
  { expr: "cos(x)", range: "x=0:2*pi", title: "Cosine Wave" },
  { expr: "tan(x)", range: "x=-pi/2+0.1:pi/2-0.1", title: "Tangent Function" }
];

const parser = new ExpressionParser();
const generator = new TimeSeriesGenerator(parser);
const plotter = new PlotGenerator();

await Promise.all(configurations.map(async (config, index) => {
  const data = generator.generate(config.expr, config.range);
  const svg = plotter.generateSVG(data, { title: config.title });
  const png = await plotter.generatePNG(svg);
  
  fs.writeFileSync(`plot-${index}.svg`, svg);
  fs.writeFileSync(`plot-${index}.png`, png);
}));
```

---

This API documentation provides comprehensive coverage of all public interfaces, methods, and usage patterns for plot-code-lib. For additional examples and use cases, see the [CLI documentation](./README.md) and [examples directory](../examples/).