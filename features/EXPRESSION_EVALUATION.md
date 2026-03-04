# Expression Evaluation Engine

## Overview

A mathematical expression parsing and evaluation engine that transforms text expressions like "sin(x)" or "y=2*x+1" into executable functions. This forms the core computational capability that enables users to create plots from mathematical formulas.

## Functionality

### Expression Parsing
Parse mathematical expressions in common notation:
- Simple form: "sin(x)", "x^2", "cos(x) + 2"  
- Equation form: "y=sin(x)", "f(x)=x^2+3*x-1"
- Support standard mathematical operators: +, -, *, /, ^, ()
- Handle mathematical constants: PI, E
- Support mathematical functions: sin, cos, tan, exp, log, sqrt, abs, etc.

### Safe Evaluation
Convert parsed expressions into JavaScript functions that can be safely evaluated:
- Validate expressions to prevent code injection
- Use Function constructor with restricted scope
- Provide comprehensive math library access through Math object
- Handle invalid expressions with clear error messages
- Return NaN for undefined mathematical operations

### Error Handling
Robust error handling for malformed expressions:
- Syntax errors in mathematical notation
- Undefined functions or variables
- Division by zero and other mathematical exceptions
- Graceful degradation that allows plotting to continue with valid points

## Acceptance Criteria

- Parse expressions like "sin(x)", "y=2*x+1", "cos(x)*exp(-x/2)"
- Generate evaluator functions that accept x values and return y values
- Support all standard mathematical operations and functions
- Reject unsafe expressions while accepting valid mathematical notation
- Handle edge cases like division by zero, negative square roots gracefully
- Provide clear error messages for invalid syntax

## Technical Requirements

- Use ES6 modules and modern JavaScript
- No external mathematical parsing libraries initially
- Extensible design allowing future mathematical function additions
- Performance suitable for evaluating 200+ points efficiently
- Memory efficient function generation