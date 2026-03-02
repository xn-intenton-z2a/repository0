# Mathematical Expression Parsing

Parse mathematical expressions into evaluable functions using standard mathematical notation and operators.

## Overview

Transform string-based mathematical expressions into JavaScript functions that can be evaluated for plotting. Support common mathematical functions, operators, and variables to enable flexible formula-based data generation.

## Acceptance Criteria

### Expression Support
- Parse basic arithmetic operators: +, -, *, /, ^, %
- Support mathematical functions: sin, cos, tan, log, ln, sqrt, abs, floor, ceil
- Handle parentheses for operation precedence
- Support variables like x, y for parametric equations
- Support constants: pi, e
- Validate expression syntax and provide clear error messages

### API Interface
- Export parseExpression function that returns evaluable function
- Handle malformed expressions gracefully with descriptive errors
- Support expressions like "sin(x)", "2*x + 3", "x^2 + y^2", "log(x) * cos(y)"

### CLI Integration
- Accept --expression flag with mathematical expression string
- Validate expression before processing
- Show helpful error messages for invalid syntax

### Error Handling
- Detect undefined variables and functions
- Catch division by zero and domain errors
- Provide specific error locations in complex expressions
- Return structured error information for programmatic handling

## Implementation Notes

Use existing mathematical expression parsing libraries rather than building from scratch. Consider libraries like mathjs, expr-eval, or similar for robust expression evaluation with proper error handling and mathematical function support.