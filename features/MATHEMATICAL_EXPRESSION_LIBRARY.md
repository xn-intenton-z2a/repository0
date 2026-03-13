# Mathematical Expression Library

Expand the mathematical function library and expression capabilities to make plot-code-lib a comprehensive tool for mathematical visualization and analysis.

## Purpose

Build plot-code-lib into a rich mathematical plotting environment with extensive function support, custom function definitions, and advanced mathematical operations while maintaining the simplicity of a command-line tool.

## Acceptance Criteria

- Extend function library beyond basic math to include statistical, trigonometric hyperbolic functions
- Add support for custom function definitions with --define flag
- Include mathematical constants (pi, e, golden ratio, etc.) with --constants flag to list them
- Support multi-variable expressions with proper dependency resolution
- Add function composition capabilities for complex mathematical relationships
- Include unit conversion functions for common scientific measurements
- Support mathematical sequence generation (fibonacci, prime numbers, etc.)
- Add calculus approximations (derivatives, integrals) using numerical methods
- Include statistical functions (mean, median, standard deviation) for data analysis
- Support complex number operations and plotting for advanced mathematics

## Technical Implementation

Extend ExpressionParser class with comprehensive mathematical function library. Create FunctionLibrary class that manages built-in and user-defined functions. Add mathematical constants registry and unit conversion utilities. Implement numerical methods for calculus operations.

## Integration Points

- Builds on existing ExpressionParser mathematical expression evaluation
- Uses current TimeSeriesGenerator for coordinate data with enhanced functions
- Works with existing PlotRenderer for all mathematical visualization
- Compatible with current CLI interface and file output systems
- Maintains backward compatibility while adding advanced mathematical capabilities

## Example Usage

Statistical plot: node src/lib/main.js -e "y=normalDist(x, 0, 1)" -r "x=-3:3" -f gaussian.svg

Custom function: node src/lib/main.js --define "f(x)=x^3-2*x+1" -e "y=f(x)" -r "x=-2:2" -f cubic.svg

Sequence plot: node src/lib/main.js -e "y=fibonacci(x)" -r "x=1:10" -f sequence.svg

Complex analysis: node src/lib/main.js -e "y=abs(x+2*i)" -r "x=-5:5" -f complex.svg