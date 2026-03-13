# Advanced Mathematical Functions

Expand mathematical function support with complex analysis, statistical functions, and specialized mathematical operations to establish plot-code-lib as a comprehensive mathematical visualization tool.

## Purpose

Transform plot-code-lib into a truly comprehensive mathematical plotting tool that rivals specialized software by supporting advanced mathematical functions, complex number operations, statistical distributions, and specialized mathematical domains that mathematicians, scientists, and engineers commonly use.

## Acceptance Criteria

- Add complex number support for expressions like z=a+bi with complex plane plotting
- Include statistical distribution functions (normal, uniform, binomial, poisson, etc.)
- Support piecewise functions with conditional syntax like y = x<0 ? -x : x^2  
- Add calculus-related functions (derivatives, integrals, limits) for educational use
- Include specialized functions (Bessel, gamma, factorial, combinations, permutations)
- Support parametric equations with t-parameter for curves like x=cos(t), y=sin(t)
- Add polar coordinate plotting with r=f(theta) expressions and polar grid display
- Include matrix operations and linear algebra functions for advanced mathematical plots
- Support multi-variable function plotting with contour plots and 3D surface projections
- Add function composition and nested function evaluation capabilities

## Technical Implementation

Extend ExpressionParser with advanced mathematical function libraries and complex number support. Add parametric equation parsing and evaluation. Create specialized renderers for polar plots, complex plane visualizations, and contour plots. Integrate advanced mathematical libraries for statistical functions and specialized operations. Add expression syntax extensions for conditional logic and multi-variable support.

## Integration Points

- Builds on existing ExpressionParser architecture with extended mathematical function support
- Enhances current TimeSeriesGenerator to handle parametric, polar, and multi-variable data
- Extends PlotRenderer with specialized plot types (polar, complex plane, contour)
- Works with existing CLI and web interfaces while adding advanced expression syntax
- Compatible with current SVG/PNG output system with new specialized plot layouts
- Integrates with existing range specification system extended for multi-parameter ranges

## Example Usage

Complex numbers: node src/lib/main.js -e "z=exp(i*x)" -r "x=0:2*pi" -f complex-exp.svg --complex-plane

Parametric curves: node src/lib/main.js -e "x=cos(t),y=sin(t)" -r "t=0:2*pi" -f circle.svg --parametric

Polar plots: node src/lib/main.js -e "r=sin(3*theta)" -r "theta=0:2*pi" -f rose-curve.svg --polar

Statistical: node src/lib/main.js -e "y=normal(x,0,1)" -r "x=-3:3" -f normal-dist.svg