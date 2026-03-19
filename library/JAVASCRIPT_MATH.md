# JavaScript Math Object

## Table of Contents

1. Math Object Methods for Mathematical Expressions
2. Expression Parsing with Function Constructor
3. Mathematical Functions for Plotting
4. Implementation Patterns for Expression Evaluation

## Math Object Methods for Mathematical Expressions

The JavaScript Math object provides static methods and constants for mathematical operations essential for plotting libraries.

### Core Mathematical Functions

Math.sin(x) - Sine function, returns value between -1 and 1
Math.cos(x) - Cosine function, returns value between -1 and 1  
Math.tan(x) - Tangent function
Math.asin(x) - Arcsine function
Math.acos(x) - Arccosine function
Math.atan(x) - Arctangent function
Math.atan2(y, x) - Two-argument arctangent

Math.exp(x) - Exponential function (e^x)
Math.log(x) - Natural logarithm
Math.log10(x) - Base-10 logarithm
Math.log2(x) - Base-2 logarithm

Math.pow(x, y) - Power function (x^y)
Math.sqrt(x) - Square root
Math.cbrt(x) - Cube root

Math.abs(x) - Absolute value
Math.ceil(x) - Ceiling function
Math.floor(x) - Floor function
Math.round(x) - Round to nearest integer
Math.trunc(x) - Truncate decimal part

### Mathematical Constants

Math.E - Euler's number (~2.718)
Math.LN2 - Natural logarithm of 2 (~0.693)
Math.LN10 - Natural logarithm of 10 (~2.303)
Math.LOG2E - Base-2 logarithm of e (~1.443)
Math.LOG10E - Base-10 logarithm of e (~0.434)
Math.PI - Pi (~3.14159)
Math.SQRT1_2 - Square root of 1/2 (~0.707)
Math.SQRT2 - Square root of 2 (~1.414)

## Expression Parsing with Function Constructor

### Dynamic Function Creation

The Function constructor creates functions from string expressions at runtime, enabling mathematical expression parsing.

Basic pattern:
const func = new Function('x', 'return ' + expression);

For expression "y=Math.sin(x)":
const parseExpression = (expr) => {
  // Remove y= prefix if present
  const mathExpr = expr.replace(/^y\s*=\s*/, '');
  // Create function with x parameter
  return new Function('x', `return ${mathExpr}`);
};

### Security Considerations

Function constructor evaluates arbitrary code. For safe expression parsing:
- Validate input contains only Math object calls and basic operators
- Whitelist allowed Math methods
- Sanitize variable names (only x, y allowed)

## Mathematical Functions for Plotting

### Common Plotting Functions

Linear: y = mx + b
Quadratic: y = ax² + bx + c  
Cubic: y = ax³ + bx² + cx + d
Trigonometric: y = A*sin(Bx + C) + D
Exponential: y = A*e^(Bx) + C
Logarithmic: y = A*log(Bx) + C

### Function Evaluation Over Range

Pattern for evaluating expression over numeric range:
function evaluateOverRange(func, start, step, end) {
  const points = [];
  for (let x = start; x <= end; x += step) {
    const y = func(x);
    if (isFinite(y)) {
      points.push({ x, y });
    }
  }
  return points;
}

## Implementation Patterns for Expression Evaluation

### Range Parsing

Parse range string "start:step:end":
function parseRange(rangeStr) {
  const parts = rangeStr.split(':');
  if (parts.length !== 3) {
    throw new Error('Range must be in format start:step:end');
  }
  return {
    start: parseFloat(parts[0]),
    step: parseFloat(parts[1]), 
    end: parseFloat(parts[2])
  };
}

### Error Handling

Handle mathematical errors in evaluation:
- Check for NaN results: isNaN(y)
- Check for infinite results: !isFinite(y)
- Skip invalid points rather than throwing errors
- Provide meaningful error messages for parsing failures

## Reference Details

### Complete Math Method Signatures

Math.sin(x: number): number
Math.cos(x: number): number
Math.tan(x: number): number
Math.asin(x: number): number
Math.acos(x: number): number
Math.atan(x: number): number
Math.atan2(y: number, x: number): number
Math.exp(x: number): number
Math.log(x: number): number
Math.log10(x: number): number
Math.log2(x: number): number
Math.pow(x: number, y: number): number
Math.sqrt(x: number): number
Math.cbrt(x: number): number
Math.abs(x: number): number
Math.ceil(x: number): number
Math.floor(x: number): number
Math.round(x: number): number
Math.trunc(x: number): number
Math.max(...values: number[]): number
Math.min(...values: number[]): number
Math.random(): number

### Function Constructor Signature

new Function([arg1[, arg2[, ...argN]],] functionBody)

Parameters:
- arg1, arg2, ... argN: Parameter names as strings
- functionBody: String containing JavaScript statements comprising the function definition

Returns: Function object

## Detailed Digest

Technical content extracted from MDN JavaScript Math object documentation focusing on mathematical functions essential for plotting libraries. The Math object provides static methods for trigonometric, exponential, logarithmic, and basic arithmetic operations. All methods are pure functions without side effects. The Function constructor enables dynamic creation of mathematical functions from string expressions, which is critical for user-defined plotting expressions. Content retrieved on 2026-03-19.

Attribution: Mozilla Developer Network (MDN)
Data size: ~162KB HTML content