# Advanced Mathematical Functions

Extend plot-code-lib with comprehensive mathematical function support including complex expressions, statistical functions, and formula libraries to fulfill the mission of being "the jq of formulae visualisations."

## Purpose

Expand mathematical capabilities beyond basic trigonometric and algebraic functions to support advanced analysis, statistical plotting, and complex mathematical visualizations that make plot-code-lib the go-to tool for mathematical expression plotting.

## Status: FOUNDATION READY 🔄

Basic mathematical parsing exists with Math.js. Need to add advanced function categories and formula templates.

## Acceptance Criteria

- 🔲 Add comprehensive statistical functions (mean, median, std, normal distribution, etc.)
- 🔲 Support advanced mathematical functions (gamma, beta, bessel, legendre polynomials)
- 🔲 Include preset formula libraries with one-command access to common mathematical patterns
- 🔲 Add support for multi-variable expressions with parameter sweeps and 3D surface plotting
- 🔲 Support mathematical series and sequences (fibonacci, factorial, prime sequences)
- 🔲 Include differential equation plotting with numerical methods (euler, runge-kutta)
- 🔲 Add formula validation and suggestions for common mathematical expressions  
- 🔲 Support mathematical constants beyond pi and e (golden ratio, euler-mascheroni, etc.)
- 🔲 Include formula transformation utilities (derivatives, integrals, taylor series)
- 🔲 Add CLI templates for common mathematical use cases with --template flag
- 🔲 Support complex number plotting and phase diagrams
- 🔲 Include unit conversion support for physics and engineering formulas

## Technical Implementation

Extend ExpressionParser with additional Math.js modules and custom function definitions. Create formula template system with JSON configuration files. Add numerical methods for differential equations and series computations. Implement parameter sweep functionality for multi-dimensional plotting. Add formula suggestion engine based on expression patterns.

## Integration Points

- Extends existing ExpressionParser with advanced mathematical libraries and custom functions
- Compatible with current TimeSeriesGenerator for coordinate data generation with enhanced capabilities
- Works with existing PlotRenderer for visualization while supporting new plot types
- Integrates with CLI interface through new --template and --function-help flags
- Web interface gains access to formula presets and advanced mathematical demonstrations
- Maintains backwards compatibility with all existing simple mathematical expressions

## Example Usage

Statistical plotting: node src/lib/main.js --expression "y=normal(x,0,1)" --range "x=-4:4" --file gaussian.svg

Template usage: node src/lib/main.js --template fibonacci --range "n=1:20" --file fibonacci.svg

Advanced function: node src/lib/main.js --expression "y=gamma(x)" --range "x=0.1:5" --file gamma.svg

Parameter sweep: node src/lib/main.js --expression "y=sin(a*x)" --params "a=1:5,step=0.5" --range "x=0:2*pi" --file sine-family.svg

Formula help: node src/lib/main.js --function-help statistics (shows available statistical functions)

Complex plotting: node src/lib/main.js --expression "y=abs(exp(i*x))" --range "x=0:2*pi" --file unit-circle.svg