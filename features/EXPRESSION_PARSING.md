# Expression Parsing

## Overview

Transform mathematical expressions from string format into evaluatable functions that can generate time series data. This feature provides the core parsing and evaluation engine that converts user-provided mathematical expressions like "y=sin(x)" or "y=x^2+2*x-1" into executable functions.

## Acceptance Criteria

- Parse mathematical expressions with variables x and y using a standard syntax
- Support common mathematical functions: sin, cos, tan, log, exp, sqrt, abs, pow
- Support basic arithmetic operations: +, -, *, /, ^, ()
- Handle constants like pi, e
- Evaluate expressions for given x values to produce corresponding y values
- Return meaningful error messages for invalid expressions
- Support implicit multiplication like "2x" or "3(x+1)"

## Implementation Requirements

- Use an existing mathematical expression parser library like mathjs or formula-parser
- Export a parseExpression function that takes a string and returns an evaluator function
- The evaluator function should accept x value and return y value
- Handle edge cases like division by zero, domain errors for functions like log(-1)
- Validate expressions before evaluation to catch syntax errors early

## Usage Examples

The feature enables users to input mathematical expressions as strings and have them converted to executable functions for plotting.

Expression: "y=sin(x)" becomes a function that maps x values to sin(x) values
Expression: "y=x^2-4*x+3" becomes a quadratic function evaluator
Expression: "y=log(x)+sqrt(x)" becomes a composite function with domain validation