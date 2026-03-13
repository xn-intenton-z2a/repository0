# Parametric Plot Generation

Generate and visualize parametric equations where both x and y coordinates are functions of a parameter t, enabling complex mathematical curves like spirals, cycloids, and Lissajous figures.

## Purpose

This feature extends the plotting capabilities beyond simple y=f(x) functions to support parametric equations of the form x=f(t), y=g(t), enabling visualization of complex mathematical curves, geometric patterns, and physical phenomena representations.

## Acceptance Criteria

- Parse parametric expressions in format "x=cos(t),y=sin(t)" or separate --x and --y flags
- Support parameter ranges like "t=0:2*pi,step=0.01" 
- Generate coordinate pairs from parametric functions
- Handle multiple parameter variables (t, theta, s)
- Support vector-valued functions and curve parameterizations
- Generate smooth curves for continuous parametric functions
- Handle closed curves and periodic functions appropriately
- Export parametric data in time series format with parameter values
- Include arc length calculations for curve analysis
- Web interface provides parametric plotting mode

## Technical Implementation

Extend the ExpressionParser to handle parametric format with comma-separated x,y expressions or add separate --param-x and --param-y CLI flags. Modify TimeSeriesGenerator to evaluate parametric functions over parameter domain and generate (x,y) coordinate pairs.

## Integration Points

- Extends expression parsing to handle parametric format
- Integrates with existing plot rendering for parametric curves  
- CLI supports parametric expression syntax with new flags
- Web interface provides dedicated parametric plotting mode
- Data export includes parameter values for mathematical analysis

## Example Usage

```
# Circle parameterization
node src/lib/main.js --param-x "cos(t)" --param-y "sin(t)" --range "t=0:2*pi" --file circle.svg

# Cycloid curve
node src/lib/main.js --param-x "t-sin(t)" --param-y "1-cos(t)" --range "t=0:4*pi" --file cycloid.png

# Lissajous figure  
node src/lib/main.js --param-x "sin(3*t)" --param-y "cos(2*t)" --range "t=0:2*pi" --file lissajous.svg
```

## Mathematical Applications

Parametric plotting enables visualization of cycloids, epicycloids, spirals, rose curves, and other mathematical phenomena not easily expressed as y=f(x) functions, expanding the library's usefulness for advanced mathematical education and research.