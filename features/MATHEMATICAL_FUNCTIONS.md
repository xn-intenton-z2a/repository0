# Advanced Mathematical Function Types

## Overview
Expand plot-code-lib beyond basic expressions to support specialized mathematical function types including polar coordinates, piecewise functions, and domain-specific mathematical operations. Build on existing MathJS foundation to enable comprehensive mathematical visualization.

## Acceptance Criteria

### Polar Coordinate Plotting
New polar command: plot-code-lib polar -e "1+cos(theta)" -r "theta=0:2*pi" -o cardioid.svg
Automatic polar-to-Cartesian transformation: x = r*cos(theta), y = r*sin(theta) with high precision
Support for mathematical expressions in polar form including rose curves, spirals, and cardioids
Polar grid overlay with concentric circles and radial lines for enhanced coordinate system visualization

### Piecewise and Conditional Functions
Enhanced expression support for piecewise functions using MathJS conditional syntax
Discontinuous function visualization with proper gap handling and domain boundary identification
Examples: plot-code-lib plot -e "x >= 0 ? sqrt(x) : 0" -r "x=-1:4" -o piecewise.svg
Visual discontinuity indicators using different line styles or gap rendering for mathematical accuracy

### Advanced Function Domains
Extended mathematical function library beyond basic trigonometric and polynomial expressions
Statistical function support including normal distribution, error functions, and probability density functions
Mathematical special functions: gamma, beta, Bessel functions for scientific and engineering applications
Advanced domain handling for logarithmic functions, inverse trigonometric, and hyperbolic functions with proper range validation

### Domain Validation and Error Handling
Automatic domain restriction detection for functions with limited input ranges (log, sqrt, etc.)
Mathematical singularity detection and appropriate visualization handling for undefined coordinate regions
Function evaluation error recovery ensuring partial function plots when domain restrictions apply
Advanced range optimization accounting for function domain limitations and mathematical constraints

## Technical Implementation
Extend ExpressionParser to support enhanced MathJS function library and conditional expression syntax
Polar coordinate transformation module with high-precision mathematical accuracy for specialized plots
Advanced domain validation ensuring proper mathematical function evaluation across complex expression types
Enhanced TimeSeriesGenerator supporting coordinate system transformations and domain-aware point generation

## Mission Alignment
Extends core mathematical visualization capabilities while maintaining simple command-line interface philosophy
Supports educational and research applications requiring specialized mathematical function visualization
Enables scientific computing visualization without compromising accessibility and ease of use principles
Provides foundation for comprehensive mathematical expression support aligning with jq simplicity and power