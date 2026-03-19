# Mathematical Expression Parser

Parse mathematical expression strings into evaluatable JavaScript functions for plotting.

## Functionality

Accept mathematical expressions as strings (e.g., "y=Math.sin(x)", "y=x*x+2*x-1") and convert them into callable JavaScript functions. Support all Math object methods and basic arithmetic operations.

## Implementation Requirements

Use the Function constructor to create functions dynamically from expression strings. Remove "y=" prefix if present. Validate expressions contain only allowed Math methods and operators. Return a function that accepts x parameter and returns y value.

## Security Constraints

Validate input expressions to prevent code injection. Whitelist only Math object methods, arithmetic operators (+, -, *, /, ^), parentheses, and variable x. Reject expressions with function calls outside Math namespace.

## API Design

```javascript
export function parseExpression(expression) {
  // Returns function(x) => y
}
```

## Acceptance Criteria

- Parse "y=Math.sin(x)" into callable function
- Parse "y=x*x+2*x-1" into callable function  
- Support all Math object methods (sin, cos, exp, log, pow, etc.)
- Handle expressions with or without "y=" prefix
- Validate expressions for security
- Throw descriptive errors for invalid expressions
- Return functions that evaluate correctly for numeric inputs