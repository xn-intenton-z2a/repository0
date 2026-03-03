# Time Series Data Generation

## Overview
Generate coordinate data points from mathematical expressions using GeoJSON specification as the standard format. Convert continuous mathematical functions into discrete coordinate arrays suitable for plotting and geospatial analysis.

## Acceptance Criteria

### Range Specification
- Accept range parameters in format: "x=start:end:step" or "x=start:end"
- Support inclusive ranges with automatic step calculation
- Handle parametric ranges: "t=0:2*pi:0.1" for parametric curves
- Default to 1000 points when step size not specified
- Validate range parameters for mathematical consistency

### Data Point Generation  
- Generate coordinate pairs (x, y) from MathJS expression evaluation
- Support parametric generation: t -> (x(t), y(t)) coordinate pairs
- Handle polar coordinates: r(θ), θ -> (x, y) conversion
- Implement adaptive sampling for curves with high curvature
- Detect and handle mathematical discontinuities gracefully

### GeoJSON Output Format
Use GeoJSON LineString specification for coordinate data:
- Coordinates array: [[x1, y1], [x2, y2], ...]
- Include metadata properties: expression, range, timestamp
- Support FeatureCollection for multiple function plots
- Maintain coordinate precision to 6 decimal places minimum

### Advanced Features
- Multi-function support: generate data for expression arrays
- Parametric curve support: x(t), y(t) parameter equations
- Polar coordinate conversion: r(θ) to Cartesian coordinates
- Complex function support: real and imaginary components

### Performance Optimization
- Efficient bulk evaluation using MathJS compile-once strategy
- Memory streaming for large coordinate sets (>10k points)
- Progress callbacks for long-running generation operations
- Early termination for infinite or undefined regions

## Technical Requirements
- Output GeoJSON-compliant coordinate structures
- Integrate with MathJS expression evaluator
- Support both functional y=f(x) and parametric x(t),y(t) modes
- Include comprehensive input validation and error handling

## GeoJSON Structure
```json
{
  "type": "Feature",
  "geometry": {
    "type": "LineString", 
    "coordinates": [[x1, y1], [x2, y2]]
  },
  "properties": {
    "expression": "sin(x)",
    "range": "x=0:2*pi:0.1",
    "timestamp": "2026-03-03T09:22:36.909Z",
    "points": 63
  }
}
```

## Usage Examples
```javascript
generateTimeSeries("sin(x)", "x=0:2*pi")           // Sine wave GeoJSON
generateTimeSeries("x^2", "x=-10:10:0.5")          // Parabola coordinates
generateParametric("cos(t)", "sin(t)", "t=0:2*pi") // Unit circle
generatePolar("1+cos(theta)", "theta=0:2*pi")      // Cardioid curve
```