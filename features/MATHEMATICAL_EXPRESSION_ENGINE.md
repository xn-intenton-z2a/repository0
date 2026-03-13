# Mathematical Expression Engine

Provide robust mathematical expression parsing and evaluation with comprehensive function support, error handling, and domain validation for reliable plotting.

## Purpose

Create a powerful mathematical expression engine that supports a wide range of mathematical functions and handles edge cases gracefully, ensuring plot-code-lib can reliably process complex mathematical expressions and generate accurate time series data for visualization.

## Acceptance Criteria

- Parse mathematical expressions in y=f(x) format with comprehensive function support
- Support trigonometric functions (sin, cos, tan, sec, csc, cot) with proper domain handling
- Include logarithmic and exponential functions (log, ln, exp, sqrt) with domain validation
- Add polynomial and power functions (x^n, abs, floor, ceil, round) with overflow protection
- Support mathematical constants (pi, e, inf) in expressions and range specifications
- Implement robust error handling for invalid expressions with helpful error messages
- Add domain validation to skip invalid points (division by zero, negative logs, etc.)
- Support complex mathematical operations (+, -, *, /, ^, %) with proper precedence
- Include bracket/parentheses support for operation grouping and complex expressions
- Generate clean time series data excluding infinite, NaN, and out-of-domain values

## Technical Implementation

Enhance ExpressionParser class using Math.js for comprehensive mathematical function support. Add domain validation logic in TimeSeriesGenerator. Implement robust error handling with specific error types. Add mathematical constant support in range parsing. Ensure proper handling of edge cases and invalid mathematical operations.

## Integration Points

- Enhances existing ExpressionParser class with comprehensive function library support
- Integrates with TimeSeriesGenerator for robust data point validation and filtering
- Works with current range specification format while adding mathematical constant support
- Compatible with existing PlotRenderer for seamless plotting of generated time series data
- Maintains backward compatibility with current expression syntax while adding power

## Example Usage

Trigonometric: node src/lib/main.js -e "y=sin(2*pi*x)" -r "x=0:1" -f sine-wave.svg

Logarithmic: node src/lib/main.js -e "y=log(x)" -r "x=0.1:10" -f logarithmic.svg

Complex expression: node src/lib/main.js -e "y=sqrt(x^2+1)" -r "x=-5:5" -f hyperbola.svg

Power function: node src/lib/main.js -e "y=x^3-2*x+1" -r "x=-3:3" -f cubic.svg