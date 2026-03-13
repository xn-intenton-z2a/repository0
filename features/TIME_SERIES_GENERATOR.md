# Time Series Data Generator

Generate time series coordinate data from mathematical expressions and specified ranges for plotting.

## Purpose

This feature takes a parsed mathematical expression and a range specification to generate arrays of x,y coordinate pairs that represent the function over the specified domain. The generated data forms the foundation for creating plots.

## Acceptance Criteria

- Accept range specification in format like "x=-1:1" or "x=-pi:pi,step=0.1"
- Generate coordinate pairs [x,y] for the specified range
- Support custom step sizes for sampling density
- Handle range boundaries and step calculation automatically
- Support named constants (pi, e) in range specifications
- Generate sufficient points for smooth plot curves
- Handle discontinuous functions gracefully
- Export data in standard time series format (JSON with timestamps or CSV)

## Technical Implementation

The generator should create arrays of coordinate data by evaluating the parsed expression function at regular intervals across the specified range. Default step size should provide smooth curves while maintaining reasonable performance.

## Integration Points

- Receives parsed expressions from the Expression Parser feature
- Provides coordinate data to the Plot Renderer feature
- CLI accepts range parameters and outputs data files
- Web interface shows live preview of generated data points
- Supports both SVG and PNG rendering workflows

## Example Usage

```
// Library API
const generator = new TimeSeriesGenerator();
const data = generator.generate(expressionFunction, { 
  x: { min: -Math.PI, max: Math.PI, step: 0.1 }
});
// Returns: [{x: -3.14, y: 0.00}, {x: -3.04, y: 0.10}, ...]

// CLI usage
node src/lib/main.js --expression "y=x^2" --range "x=-2:2,step=0.05" --output data.json
```

## Data Format

Generated time series data should follow standard time series format as documented in TIME_SERIES.md library reference. Data should be structured as coordinate arrays compatible with D3.js plotting and easily serializable to JSON or CSV for persistence and interchange.