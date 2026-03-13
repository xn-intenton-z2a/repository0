# Parametric Plot Generation

Generate and visualize parametric equations where both x and y coordinates are functions of a parameter t, enabling complex mathematical curves like spirals, cycloids, and Lissajous figures.

## Purpose

This feature extends the plotting capabilities beyond simple y=f(x) functions to support parametric equations of the form x=f(t), y=g(t), enabling visualization of complex mathematical curves, geometric patterns, and physical phenomena representations.

## Acceptance Criteria

- Parse parametric expressions in format "x=cos(t),y=sin(t)"  
- Support parameter ranges like "t=0:2*pi,step=0.01"
- Generate coordinate pairs from parametric functions
- Handle multiple parameter variables (t, theta, s)
- Support vector-valued functions and curve parameterizations
- Generate smooth curves for continuous parametric functions
- Handle closed curves and periodic functions appropriately
- Export parametric data in specialized format indicating parameter values
- Support 3D parametric curves (x,y,z) for future extension
- Include arc length and curvature calculations

## Technical Implementation

Extend the TimeSeriesGenerator to handle parametric expressions where both x and y are functions of a parameter. Parse expressions containing multiple coordinate definitions and evaluate them over the parameter domain.

## Integration Points

- Extends expression parsing to handle parametric format
- Integrates with existing plot rendering for parametric curves
- CLI supports parametric expression syntax
- Web interface provides parametric plotting mode
- Data export includes parameter values for analysis

## Example Usage

```
// Circle parameterization
node src/lib/main.js --expression "x=cos(t),y=sin(t)" --range "t=0:2*pi" --file circle.svg

// Cycloid curve  
node src/lib/main.js --expression "x=t-sin(t),y=1-cos(t)" --range "t=0:4*pi" --file cycloid.png

// Lissajous figure
node src/lib/main.js --expression "x=sin(3*t),y=cos(2*t)" --range "t=0:2*pi" --file lissajous.svg
```

## Mathematical Applications

Parametric plotting enables visualization of cycloids, epicycloids, spirals, roses curves, and other mathematical phenomena not easily expressed as y=f(x) functions.