# MATH_PARSER

## Summary

MATH_PARSER defines a focused feature to add a safe, deterministic mathematical expression parser and compiler to the library entry point, enabling secure evaluation of expressions such as y=sin(x) without executing arbitrary JavaScript. The feature specifies the API, accepted syntax, error semantics, and unit tests required to make expression parsing robust and testable across the library, CLI, and website examples.

## Motivation

Reliable and secure expression parsing is central to the mission because all time series generation depends on turning user-provided formulae into numeric functions. A dedicated parsing feature reduces duplication, clarifies security constraints, and makes unit testing of parsing semantics explicit for downstream features like PLOT_CLI.

## Behaviour and API

- Library exports (added to src/lib/main.js):
  - parseExpression(expressionString) -> { dependentVar: string, ast: Object }
    - Validates syntax of a single equation assigning one dependent variable to an expression of a single independent variable.
    - Returns a parsed abstract syntax tree (AST) suitable for compilation.
  - compileExpression(ast) -> { fn: (x: number) => number }
    - Compiles the AST into a deterministic JavaScript function that only uses supported math functions and numeric operators.
  - evaluateExpression(expressionString, x) -> number
    - Convenience wrapper that parses and evaluates expression for a numeric x.

- Accepted syntax:
  - Single equation: dependent = expression, e.g. y=sin(x) or f(x)=x^2+3*x+1
  - The independent variable name may be any single identifier; dependent variable must be a single identifier.
  - Supported operators: +, -, *, /, ^, unary +/-, parentheses.
  - Supported functions: sin, cos, tan, asin, acos, atan, exp, log, sqrt, pow, abs, floor, ceil, min, max
  - Numeric literals: integers, decimals, and scientific notation.

- Error handling:
  - parseExpression throws a descriptive Error for syntax violations, unknown identifiers, or unsupported operations.
  - compileExpression throws when AST contains unsupported constructs.
  - evaluateExpression returns NaN only when the compiled function produces NaN for a valid numeric input; fatal parse/compile errors are thrown.

- Security constraints:
  - Never use eval or Function to execute user input.
  - Only the predefined math functions and operators are allowed; any unknown identifier causes a parse error.

## Acceptance Criteria

1. parseExpression exists and parses common expressions into a structured AST; unit tests verify AST node types for sample inputs.
2. compileExpression produces a function that returns numeric results matching a reference math library for common inputs (sin, cos, polynomial, pow).
3. evaluateExpression returns expected numeric values for sample expressions and inputs, including edge cases (x==0, negative, large values).
4. parseExpression rejects expressions with multiple equations, unknown identifiers, or JavaScript syntax (e.g., function calls other than allowed list).
5. All new functionality is covered by unit tests in tests/unit/, with deterministic assertions and no reliance on image generation or external processes.

## Testing and Validation

- Unit tests to add or extend tests/unit/main.test.js:
  - parseExpression.validExpressions validates AST shape for several canonical expressions.
  - parseExpression.invalidExpressions asserts thrown errors for disallowed syntax.
  - compileExpression.evaluationAccuracy verifies compiled function matches Math.* equivalents across a set of x values.
  - evaluateExpression.integration tests that evaluateExpression("y=sin(x)", 1.0) returns approximately Math.sin(1.0).

- Tests should run under existing vitest configuration and not add new test frameworks.

## Implementation Notes

- Implement a small recursive-descent parser or a tokenizer+shunting-yard algorithm to convert infix expressions to AST, keeping the implementation self-contained within src/lib/main.js.
- Keep the parser and compiler small and well-documented; prefer explicit whitelisting of functions and operators.
- Avoid adding heavy dependencies; the feature should be implementable without adding new production dependencies. If a dependency is necessary, document it and keep it minimal.
- Ensure exported functions are pure and side-effect free to ease unit testing.

## Examples

- parseExpression("y=sin(x)") returns dependentVar: y and an AST representing sin(x).
- evaluateExpression("y=x^2+1", 3) returns 10.

## Security and Safety

- Reject any expression that contains identifiers other than the single independent variable and whitelisted function names.
- Do not allow property access or member expressions.
- Reject any attempt to include commas or multiple statements.

## Backwards Compatibility

- If src/lib/main.js already exports parseExpression or similar names, extend behavior without removing existing exports; maintain previous semantics where present.

## Notes for Contributors

- Follow the repository contributing guidelines when adding tests and implementing the parser.
- Keep changes minimal and focused in src/lib/main.js and tests/unit/main.test.js; update README examples to reference evaluateExpression where relevant.
