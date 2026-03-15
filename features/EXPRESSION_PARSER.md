# EXPRESSION_PARSER

Summary

Status: Implemented (closed issue #3022)

Implement a safe expression parser that converts a user supplied expression string into an evaluatable JavaScript function. The parser must accept expressions that assign y as a function of x, for example y=Math.sin(x) or y=x*x+2*x-1, and return a callable function f(x) that produces numeric y values.

Rationale

Parsing expressions is the foundational capability that enables expression-driven plotting, interactive CLI usage, and unit testability without bringing in heavy math libraries.

Scope

- Add a named export parseExpression in src/lib/main.js.
- Provide minimal validation to ensure the expression assigns to y and uses only the x variable and the Math global.
- Fail fast with a helpful error for invalid or unsafe expressions.

Files to change

- src/lib/main.js (add parseExpression export)
- tests/unit/expression.test.js (unit tests)
- README.md (usage example)

Acceptance Criteria

- parseExpression is exported as a named export from src/lib/main.js.
- parseExpression called with the string y=Math.sin(x) returns a callable function f.
- Calling f(0) returns 0 (within a small numeric tolerance).
- parseExpression rejects expressions that do not assign to y or that reference identifiers other than x or Math.
- Unit tests cover the happy path, a numeric check, and invalid input.

Implementation notes

- Use a tightly scoped Function constructor or evaluate within an explicit sandbox exposing only Math and the numeric argument x.
- Do not add external dependencies for expression parsing; rely on controlled evaluation using built-in JavaScript only.
