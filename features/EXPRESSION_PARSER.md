# Mathematical Expression Parser

Parse mathematical expressions using a standard syntax and evaluate them for given variable values to generate coordinate data for plotting.

## Purpose

This feature enables the library to accept mathematical expressions like `y=sin(x)`, `y=x^2 + 2*x + 1`, or `y=log(x)` and parse them into evaluatable functions. The parser should support common mathematical operations and functions to make the tool useful for a wide range of plotting needs.

## Acceptance Criteria

- Parse expressions with standard mathematical syntax (y=f(x) format)
- Support basic arithmetic operators: +, -, *, /, ^
- Support common mathematical functions: sin, cos, tan, log, ln, exp, sqrt, abs
- Support parentheses for grouping operations
- Support constants like pi and e
- Return parsed expression as evaluatable function
- Handle invalid expressions with clear error messages
- Support both single-character (x, y) and multi-character (theta, radius) variables

## Technical Implementation

The parser should use an existing mathematical expression parsing library rather than implementing parsing from scratch. The parsed expression should return a JavaScript function that can be called with variable values to compute results.

## Integration Points

- CLI tool uses parser to process --expression parameter
- Web interface provides input field for mathematical expressions
- Generated functions integrate with time series data generation
- Parser errors display helpful messages in both CLI and web interfaces

## Example Usage

```
// Library API
const parser = new ExpressionParser();
const func = parser.parse("y=sin(x)*cos(x)");
const result = func({ x: Math.PI/4 }); // returns y coordinate

// CLI usage
node src/lib/main.js --expression "y=sin(x)" --range "x=-pi:pi" --file plot.svg
```