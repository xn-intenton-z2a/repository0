# Multi-Mode Coordinate Data Generation

## Overview
Generate coordinate data points from mathematical expressions in multiple modes using GeoJSON specification. Support standard functions, parametric curves, and polar coordinates with automatic conversion to unified coordinate format suitable for plotting.

## Acceptance Criteria

### Universal Range Processing
- Parse standard ranges: "x=start:end:step" or "x=start:end"
- Handle parametric ranges: "t=0:2*pi:0.1" for parametric curves
- Support polar ranges: "theta=0:2*pi" for polar coordinates
- Multi-variable ranges for complex expressions
- Automatic step size calculation with intelligent defaults

### Multi-Mode Coordinate Generation
- Standard function mode: y = f(x) with direct coordinate pairs
- Parametric mode: t -> (x(t), y(t)) coordinate generation
- Polar mode: (r(θ), θ) -> (x, y) Cartesian conversion
- Multi-function mode: generate FeatureCollection from expression arrays
- Complex expression support with real/imaginary component handling

### Intelligent Sampling and Quality
- Adaptive sampling for high-curvature regions and discontinuities
- Detect mathematical singularities and domain boundaries
- Skip invalid points (NaN, Infinity) with graceful continuation
- Optimize point density for smooth curve representation
- Memory-efficient streaming for large datasets

### Enhanced GeoJSON Output
Generate GeoJSON with rich metadata:
- Standard LineString for single functions
- FeatureCollection for multi-function plots
- Embedded properties: expression, mode, range, timestamp, point count
- Coordinate precision optimized for mathematical accuracy
- Support for function-specific metadata and styling hints

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