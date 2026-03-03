# Extended Mathematical Function Support

## Overview
Expand plot-code-lib mathematical capabilities beyond basic expressions to support advanced function types including piecewise functions, polar coordinates, and specialized mathematical domains. Enable comprehensive mathematical visualization for research, education, and technical analysis applications.

## Acceptance Criteria

### Polar Coordinate System Support
New polar command: plot-code-lib polar -e "1+cos(theta)" -r "theta=0:2*pi" -o cardioid.svg
Automatic polar-to-Cartesian coordinate transformation with high mathematical precision for accurate curve rendering
Support for rose curves, spirals, cardioids, and lemniscates using standard polar mathematical expressions
Polar grid overlay options with radial and angular grid lines for enhanced mathematical coordinate visualization

### Piecewise Function Visualization
Piecewise function syntax support using conditional expressions for mathematical domain-specific definitions
Command support for discontinuous functions with proper gap handling and domain boundary visualization
Mathematical domain validation ensuring correct piecewise function evaluation across specified coordinate ranges
Visual indication of function discontinuities with appropriate styling for mathematical accuracy and clarity

### Advanced Mathematical Domains
Complex mathematical function support including absolute value, step functions, and mathematical floor/ceiling operations
Trigonometric function extensions supporting hyperbolic functions, inverse functions, and specialized mathematical operations
Statistical function support including probability distributions, error functions, and mathematical analysis functions
Mathematical constant support beyond pi and e including specialized constants for advanced mathematical applications

### Domain-Specific Function Features
Automatic domain optimization for functions with restricted domains including logarithmic and inverse function handling
Mathematical singularity detection and appropriate visualization handling for undefined coordinate regions
Function transformation support including scaling, translation, and mathematical composition operations for advanced analysis
Error function and special mathematical function support enabling scientific and engineering visualization applications

## Technical Implementation
Extended ExpressionParser supporting conditional expressions and piecewise function mathematical syntax definition
Polar coordinate transformation algorithms with high-precision mathematical accuracy for specialized coordinate systems
Advanced mathematical domain validation ensuring proper function evaluation across complex mathematical expressions
Enhanced TimeSeriesGenerator supporting multiple coordinate systems and specialized mathematical function types

## Mission Alignment
Extends jq of formulae visualizations to comprehensive mathematical function support for research applications
Maintains simple CLI interface while enabling advanced mathematical visualization for specialized domains
Supports educational and research applications requiring sophisticated mathematical function visualization capabilities
Provides foundation for scientific computing visualization without compromising core usability and accessibility