# Mathematical Expression Parser

## Overview

Implement a robust mathematical expression parser that converts string expressions into evaluable functions for plot generation. This is the core foundation for transforming mathematical formulas into time series data.

## Acceptance Criteria

### Expression Syntax Support
- Parse basic arithmetic operations: +, -, *, /, ^, ()
- Support common mathematical functions: sin, cos, tan, log, exp, sqrt, abs
- Handle variable substitution (primarily x for single-variable functions)
- Support constants like pi, e
- Validate expression syntax and provide meaningful error messages

### Function Evaluation
- Convert parsed expressions into JavaScript functions
- Support domain restrictions and handle mathematical edge cases
- Return NaN or appropriate values for undefined mathematical operations
- Optimize function evaluation for performance with large datasets

### Integration Points
- Export parseExpression(expressionString) function
- Return evaluable function that accepts x parameter
- Provide expression validation without evaluation
- Support both library API and CLI integration

## Implementation Notes

- Use existing mathematical expression parsing libraries where appropriate
- Follow open standards for mathematical notation
- Ensure thread-safe evaluation for potential future parallel processing
- Design for extensibility to support additional mathematical functions

## Examples

Basic usage:
```
const fn = parseExpression("sin(x) + cos(x)")
const result = fn(Math.PI / 2)  // Should return ~1
```

CLI integration:
```
--expression "y=x^2 + 2*x + 1"
--expression "y=sin(2*pi*x)"
```

## Dependencies

Consider libraries like:
- mathjs for comprehensive mathematical expression parsing
- expr-eval for lightweight expression evaluation
- Native JavaScript Math functions as fallback