# Parametric Plot Generation

Generate parametric curves where both x and y coordinates are functions of a parameter, enabling complex mathematical visualizations beyond simple y=f(x) functions.

## Purpose

Extend plotting capabilities to support parametric equations of the form x=f(t), y=g(t). This enables visualization of circles, spirals, cycloids, Lissajous figures, and other curves not expressible as y=f(x).

## Acceptance Criteria

- Parse parametric expressions using --param-x and --param-y flags
- Support parameter ranges like "t=0:2*pi,step=0.01"
- Generate coordinate pairs from parametric functions over parameter domain
- Handle parameter variables (t, theta, s) in expressions
- Generate smooth curves for continuous parametric functions  
- Export parametric data in existing CSV/JSON formats with parameter values
- Integrate with existing plot rendering for parametric curves
- Support mathematical constants (pi, e) in parameter expressions

## Technical Implementation

Add --param-x and --param-y CLI flags as alternative to --expression. Extend TimeSeriesGenerator to evaluate parametric functions over parameter domain. Modify data structure to include parameter values alongside x,y coordinates.

## Integration Points

- Adds new CLI mode alongside existing y=f(x) plotting
- Uses current ExpressionParser for parametric function parsing
- Integrates with existing PlotRenderer for curve visualization
- Compatible with existing export formats and output options

## Example Usage

Circle parameterization:
node src/lib/main.js --param-x "cos(t)" --param-y "sin(t)" --range "t=0:2*pi" --file circle.svg

Cycloid curve:  
node src/lib/main.js --param-x "t-sin(t)" --param-y "1-cos(t)" --range "t=0:4*pi" --file cycloid.png

Lissajous figure:
node src/lib/main.js --param-x "sin(3*t)" --param-y "cos(2*t)" --range "t=0:2*pi" --file lissajous.svg