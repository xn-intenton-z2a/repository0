# Advanced Mathematical Function Types

## Overview
Expand plot-code-lib beyond current basic expressions to support specialized mathematical function types including polar coordinates, piecewise functions, and domain-specific operations. Leverage existing MathJS foundation to enable comprehensive scientific and educational mathematical visualization.

## Acceptance Criteria

### Polar Coordinate Plotting  
New polar command for polar coordinate expressions: plot-code-lib polar -e "1+cos(theta)" -r "theta=0:2*pi" -o cardioid.svg
High-precision polar-to-Cartesian transformation: x = r*cos(theta), y = r*sin(theta) 
Support for specialized polar expressions including rose curves, spirals, cardioids, and lemniscates
Polar grid overlay with concentric circles and radial lines providing enhanced coordinate visualization

### Piecewise and Conditional Functions
Enhanced expression support for piecewise functions using MathJS conditional syntax and logical operators
Discontinuous function visualization with intelligent gap handling and boundary identification
Examples: plot-code-lib plot -e "x >= 0 ? sqrt(x) : 0" -r "x=-1:4" -o piecewise.svg
Visual discontinuity indicators using configurable line styles and gap rendering for mathematical clarity

### Advanced Function Library Extensions
Statistical function support including normal distribution, error functions, and probability density functions
Mathematical special functions: gamma, beta, Bessel functions for scientific and engineering applications  
Enhanced trigonometric support including inverse and hyperbolic functions with proper domain handling
Logarithmic and exponential function enhancements with automatic domain restriction detection

### Domain Validation and Mathematical Accuracy
Automatic domain restriction detection for functions with limited ranges (log, sqrt, inverse trig, etc.)
Mathematical singularity detection with appropriate visualization handling for undefined regions
Function evaluation error recovery ensuring robust partial plots when domain restrictions apply
Advanced range optimization accounting for function limitations and mathematical constraints

## Technical Implementation
ExpressionParser extension supporting enhanced MathJS function library and conditional syntax
Polar coordinate transformation module with mathematical precision and specialized plot generation  
Domain validation system ensuring proper function evaluation across complex expression types
TimeSeriesGenerator enhancement supporting coordinate transformations and domain-aware generation

## Mission Alignment
Extends core mathematical visualization while maintaining command-line interface simplicity and accessibility
Supports advanced educational and research applications requiring specialized mathematical function visualization
Enables scientific computing visualization without compromising ease of use or jq philosophy principles
Provides comprehensive mathematical expression foundation aligning with professional analysis requirements