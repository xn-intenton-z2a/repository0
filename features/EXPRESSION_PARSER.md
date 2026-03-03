# Mathematical Expression Parser

## Overview

Core mathematical expression parsing engine that converts string expressions into evaluable functions. This is the foundation feature that enables the library to process mathematical formulae like `y=sin(x)` or `r=cos(theta)` and evaluate them across specified ranges.

## Acceptance Criteria

### Expression Syntax Support
- Parse basic arithmetic operations: `+`, `-`, `*`, `/`, `^` (power)
- Support mathematical functions: `sin`, `cos`, `tan`, `log`, `ln`, `sqrt`, `abs`
- Handle constants: `pi`, `e`
- Support variables: `x`, `y`, `t`, `theta`, `r`
- Parse equations in format: `y=f(x)` or `r=f(theta)`

### Function Evaluation
- Convert parsed expressions into JavaScript functions
- Evaluate expressions for given input values
- Return numeric results for valid mathematical operations
- Handle domain errors gracefully (e.g., sqrt of negative numbers)

### Input Validation
- Detect invalid syntax and provide meaningful error messages
- Validate variable names and function names
- Check for balanced parentheses and proper operator placement

## Implementation Notes

Use existing JavaScript mathematical expression libraries like `math.js` or `expr-eval` rather than building a parser from scratch. Focus on creating a clean API that integrates well with the time series generation feature.

## API Design

Export a `parseExpression(expressionString)` function that returns an evaluable function object with metadata about variables used.