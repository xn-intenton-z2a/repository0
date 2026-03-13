# MATHJS

## Table of Contents

- Expression Parser and Evaluation
- Supported Data Types
- Mathematical Functions and Constants
- Symbolic Computation
- Chaining Operations
- JavaScript Integration and Compatibility
- Command Line Usage
- Performance Characteristics
- Extensibility

## Expression Parser and Evaluation

Math.js is an extensive math library for JavaScript and Node.js featuring a flexible expression parser with support for symbolic computation. The library can evaluate mathematical expressions provided as strings with built-in functions and constants.

### Basic Expression Evaluation
The math.evaluate() function processes mathematical expressions:
- math.evaluate('1.2 * (2 + 4.5)') returns 7.8
- math.evaluate('12.7 cm to inch') returns 5 inch with unit conversion
- math.evaluate('sin(45 deg) ^ 2') returns 0.5 with trigonometric functions
- math.evaluate('9 / 3 + 2i') returns 3 + 2i for complex number operations
- math.evaluate('det([-1, 2; 3, 1])') returns -7 for matrix determinant

### Parser Features
- Supports standard mathematical notation
- Handles unit conversions automatically
- Processes complex numbers with i notation
- Evaluates matrix operations using bracket notation
- Recognizes mathematical functions by name
- Compatible with JavaScript's built-in Math library
- Contains a large set of built-in functions and constants
- Easily extensible for custom functions

## Supported Data Types

Math.js supports multiple data types for comprehensive mathematical operations:
- Numbers (standard JavaScript numbers)
- Big numbers for high precision arithmetic
- Bigint for integer operations
- Complex numbers with real and imaginary components
- Fractions for exact rational arithmetic
- Units with automatic conversion capabilities
- Strings for text processing
- Arrays for vector operations
- Matrices for linear algebra

### Type Flexibility
All data types are supported seamlessly within expressions, allowing mixed operations without explicit type conversion. The library automatically handles type coercion and maintains precision where appropriate.

## Mathematical Functions and Constants

### Built-in Functions
- math.round(value, precision) for rounding operations
- math.atan2(y, x) for two-argument arctangent
- math.log(value, base) for logarithmic calculations
- math.sqrt(value) for square root calculations including complex results
- math.derivative(expression, variable) for symbolic differentiation
- math.pow(base, exponent) for power operations including matrix exponentiation

### Constants
- math.e for Euler's number (approximately 2.718)
- math.pi for the mathematical constant π
- math.i for the imaginary unit

## Symbolic Computation

The library performs symbolic mathematical operations:
- Derivative calculation: math.derivative('x^2 + x', 'x') returns '2*x+1'
- Expression simplification and manipulation
- Variable substitution capabilities

## Chaining Operations

Math.js supports method chaining for sequential operations:
- math.chain(3).add(4).multiply(2).done() returns 14
- The chaining mechanism allows building complex calculations step by step with intermediate results maintained internally

## JavaScript Integration and Compatibility

Math.js is compatible with JavaScript's built-in Math library and runs on any JavaScript engine. The library provides comprehensive support for both browser and Node.js environments with full ES6 module and CommonJS support.

## Command Line Usage

Math.js can be used as a command line application for direct mathematical computations and expression evaluation, providing an interactive mathematical environment.

## Performance Characteristics

The library is optimized for performance while maintaining flexibility. Expression compilation is available for repeated evaluations of the same expression with different values.

## Extensibility

Math.js is easily extensible, allowing custom functions, operators, and data types to be added to meet specific application requirements.

## Supplementary Details

Math.js provides a comprehensive mathematical environment suitable for scientific computing, data analysis, and educational applications. The library maintains compatibility with standard mathematical notation while providing programmatic access to advanced mathematical operations.

## Reference Details

### Core API Methods
- math.evaluate(expression: string): any - Evaluates mathematical expressions
- math.chain(value: any): Chain - Creates a chainable calculation sequence
- math.derivative(expr: string, variable: string): string - Computes symbolic derivatives
- math.round(value: number, precision: number): number - Rounds to specified precision
- math.pow(base: any, exponent: any): any - Power operation supporting matrices

### Configuration Options
- Parser can be configured for custom operators and functions
- Number formatting options available
- Custom unit definitions supported
- Expression compilation for performance optimization

### Integration Patterns
- Import as ES module: import { evaluate } from 'mathjs'
- CommonJS support: const { evaluate } = require('mathjs')
- Browser usage via CDN or bundled builds
- TypeScript definitions included

## Detailed Digest

**Source Content:** Math.js official website (https://mathjs.org/)
**Retrieved:** 2026-03-13
**Attribution:** Math.js development team
**Data Size:** Approximately 2.8KB extracted content

Math.js is an extensive mathematics library for JavaScript and Node.js providing flexible expression parsing, symbolic computation, and comprehensive support for different data types including numbers, big numbers, complex numbers, fractions, units, and matrices. The library features built-in functions and constants, expression evaluation capabilities, and chainable operations for sequential mathematical computations.