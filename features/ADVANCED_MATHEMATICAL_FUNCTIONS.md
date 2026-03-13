# Advanced Mathematical Functions

Extend expression parsing to support a comprehensive library of mathematical functions beyond the current basic operations.

## Purpose

Expand the mathematical capabilities of plot-code-lib by supporting advanced functions commonly needed in mathematical visualization, making it a more powerful tool for educational and research applications.

## Acceptance Criteria

- Support trigonometric functions: sin, cos, tan, asin, acos, atan, sinh, cosh, tanh
- Include logarithmic and exponential functions: log, ln, exp, pow, sqrt
- Add statistical and special functions: gamma, factorial, erf, bessel
- Support hyperbolic functions and inverse variants
- Include mathematical constants: pi, e, phi, with proper precision
- Handle complex number operations where applicable
- Provide function documentation in help output
- Support function composition and nested expressions
- Include unit conversion functions (radians/degrees)

## Technical Implementation

Leverage Math.js comprehensive function library through the existing ExpressionParser class. Add function validation and documentation to CLI help output. Extend web interface to show available functions.

## Integration Points

- Builds on existing ExpressionParser using Math.js capabilities
- Compatible with current TimeSeriesGenerator for data generation
- Works with existing PlotRenderer for visualization
- Extends both CLI and web interface functionality seamlessly

## Example Usage

Users can plot advanced expressions like "y=gamma(x)", "y=erf(x/2)", or "y=bessel(1,x)" with the same simple interface, accessing the full power of mathematical analysis through the plotting library.