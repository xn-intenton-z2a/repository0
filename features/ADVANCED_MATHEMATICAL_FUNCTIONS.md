# Advanced Mathematical Functions

Extend mathematical expression parsing to support advanced functions including hyperbolic, inverse trigonometric, and statistical functions for scientific plotting.

## Purpose

This feature expands the mathematical capabilities beyond basic functions to support advanced mathematical expressions used in scientific computing, engineering, and statistical analysis.

## Acceptance Criteria

- Support hyperbolic functions: sinh, cosh, tanh, asinh, acosh, atanh
- Support inverse trigonometric functions: asin, acos, atan, atan2
- Support statistical functions: erf, gamma, factorial, combinations, permutations  
- Support special mathematical functions: bessel functions, elliptic integrals
- Support probability distributions: normal, exponential, chi-squared
- Support complex number operations where applicable
- Handle domain restrictions with appropriate error messages
- Support mathematical constants: phi (golden ratio), gamma (Euler-Mascheroni)
- Enable advanced function composition and nested operations
- Provide function documentation in help system

## Technical Implementation

Leverage Math.js extended function library and add custom implementations for functions not natively supported. Create function registry with domain validation and error handling for each advanced function type.

## Integration Points

- Extends existing ExpressionParser with additional function registry
- CLI help system documents available advanced functions
- Web interface provides function picker or autocomplete
- Error messages guide users on proper function usage and domains
- Examples showcase scientific and engineering use cases

## Example Usage

```
// Hyperbolic functions
node src/lib/main.js --expression "y=sinh(x)" --range "x=-3:3" --file hyperbolic.svg

// Statistical normal distribution
node src/lib/main.js --expression "y=exp(-x^2/2)/sqrt(2*pi)" --range "x=-4:4" --file normal.png  

// Engineering applications
node src/lib/main.js --expression "y=erf(x)" --range "x=-3:3" --file error-function.svg
```

## Function Categories

Advanced functions should be organized into mathematical categories: trigonometric, hyperbolic, statistical, special functions, and probability distributions with appropriate domain handling for each category.