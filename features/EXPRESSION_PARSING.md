# EXPRESSION_PARSING

Mathematical expression parsing and evaluation engine that transforms formula strings into computable functions for plot generation.

## Overview

The expression parsing feature enables users to input mathematical formulas using standard notation and have them automatically parsed, validated, and evaluated across data ranges. This forms the computational core of the plot-code-lib library.

## Key Capabilities

Parse mathematical expressions in multiple formats:
- Explicit format: `y=sin(x)`, `z=x^2+2*x+1`  
- Implicit format: `sin(x)`, `x^2+2*x+1`
- Support for standard mathematical functions: sin, cos, tan, log, exp, sqrt, abs, floor, ceil
- Support for arithmetic operators: +, -, *, /, ^, %
- Support for constants: pi, e
- Variable detection and scope management

Expression validation and error handling:
- Syntax validation before evaluation
- Clear error messages for invalid expressions
- Graceful handling of domain errors (sqrt of negative, division by zero)
- Detection of undefined functions or variables

Variable range processing:
- Parse range specifications like `x=-10:10,y=-5:5`
- Support for multiple variable ranges
- Automatic independent variable detection
- Default range fallback when ranges not specified

## Technical Requirements

Must integrate with mathjs library for robust expression evaluation
Must provide parseRange function that converts string ranges to objects
Must provide generateTimeSeries function that evaluates expressions across ranges
Must handle floating-point precision issues appropriately
Must skip invalid evaluation points without failing entire computation
Must support at least 100-1000 evaluation steps for smooth plots

## Acceptance Criteria

Successfully parse and evaluate basic arithmetic expressions
Successfully parse and evaluate trigonometric functions
Successfully parse and evaluate exponential and logarithmic functions
Successfully handle expressions with multiple variables
Successfully detect and report syntax errors in expressions
Successfully skip points with domain errors (NaN, infinity)
Successfully parse range strings with multiple variables
Successfully generate point arrays with x,y coordinate pairs
Performance: evaluate 1000 points in under 100ms for typical expressions