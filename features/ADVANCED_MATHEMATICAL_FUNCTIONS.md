# Advanced Mathematical Functions

Extend expression parsing to support additional mathematical functions including hyperbolic, statistical, and special functions to make plot-code-lib comprehensive for advanced mathematical visualization.

## Purpose

Enhance the mathematical capabilities of plot-code-lib by adding support for advanced functions that are commonly used in engineering, science, and mathematics education, making it a more complete tool for formulae visualization.

## Acceptance Criteria

- Add hyperbolic functions: sinh, cosh, tanh, asinh, acosh, atanh
- Include statistical functions: erf, gamma, factorial, combinations, permutations
- Support special functions: bessel functions, elliptic integrals, beta function
- Add step and impulse functions: heaviside, dirac delta approximation
- Include piecewise function support with conditional expressions
- Support complex number visualization for functions with imaginary components
- Add matrix and vector operations for parametric equations
- Include probability distributions: normal, exponential, poisson curves
- Support user-defined function notation and custom function libraries
- Add function composition and inverse function plotting capabilities

## Technical Implementation

Extend ExpressionParser class to recognize and evaluate advanced mathematical functions through mathjs library extensions. Add complex number handling for functions that may return imaginary results. Create function registry system for user-defined functions.

## Integration Points

- Extends existing ExpressionParser without breaking current syntax
- Compatible with all existing CLI flags and web interface
- Works with current TimeSeriesGenerator for data point generation
- Integrates with existing PlotRenderer for visualization output
- Maintains backward compatibility with basic mathematical expressions

## Example Usage

Hyperbolic functions: node src/lib/main.js --expression "y=sinh(x)" --range "x=-3:3" --file hyperbolic.svg

Statistical curves: node src/lib/main.js --expression "y=erf(x)" --range "x=-2:2" --file error-function.png

Probability distribution: node src/lib/main.js --expression "y=exp(-x^2/2)/sqrt(2*pi)" --range "x=-4:4" --file normal.svg