# Mathematical Expression Parser

## Overview
Implement a robust mathematical expression parser that can convert string-based mathematical formulae into evaluable JavaScript functions. This parser forms the foundation for transforming mathematical expressions into plottable data points.

## Acceptance Criteria

### Core Expression Support
- Parse basic arithmetic operations: +, -, *, /, ^, ()
- Support mathematical functions: sin, cos, tan, sqrt, log, ln, exp, abs
- Handle variable substitution for x and y coordinates
- Support constants like pi, e
- Validate expression syntax and provide meaningful error messages

### Input Format
- Accept expressions in standard mathematical notation
- Examples: "sin(x)", "x^2 + 2*x + 1", "cos(x) * exp(-x/2)"
- Support implicit multiplication: "2x" becomes "2*x"

### Output Format
- Return compiled JavaScript function that can be evaluated
- Function should accept coordinate values and return computed result
- Preserve numerical precision for plotting accuracy

### Error Handling
- Detect invalid syntax with specific error locations
- Handle division by zero gracefully
- Report undefined variables or functions
- Provide suggestions for common mistakes

## Technical Requirements
- Use existing mathematical expression parsing library (e.g., expr-eval, mathjs)
- Integrate with time series generation for coordinate evaluation
- Support both single-variable (f(x)) and multi-variable expressions
- Maintain compatibility with standard mathematical notation

## Usage Examples
```
parseExpression("sin(x)") // Returns function for sine wave
parseExpression("x^2 - 4*x + 3") // Returns quadratic function
parseExpression("log(abs(x)) + cos(y)") // Returns 2D function
```