# EXPRESSION_PARSER

Summary

Provide a robust, testable mathematical expression parser that converts a user-supplied formula into an evaluable function suitable for time series generation and plotting.

Motivation

Users need a reliable way to express mathematical relationships (for example y=sin(x) or y = a*x + b) that the library can evaluate across a numeric range. A clear parser API enables CLI, tests, and rendering code to share a single source of truth for expression semantics.

Scope

- Parse assignment-style expressions where the dependent variable (commonly y) is defined as a function of a single independent variable (commonly x or t). Examples: y=sin(x), y = x^2 + 3*x - 1
- Support numeric literals, standard arithmetic operators, parentheses, unary operators, and a core set of math functions: sin, cos, tan, exp, log, sqrt, abs, pow.
- Produce a programmatic evaluator that accepts an input numeric x and returns the numeric y, and that throws structured parse/evaluation errors for invalid inputs.
- Provide a minimal, documented API surface usable from src/lib/main.js and the CLI.

Non-goals

- Full symbolic algebra or simplification routines. This feature focuses on parsing and numeric evaluation only.

Implementation notes

- Prefer using an existing, well-tested parser library already acceptable to the project (for example a lightweight expression parser). If adding a dependency is necessary, document it in package.json and README change requests.
- Return errors with an informative message and position info where the parser exposes it; otherwise provide a stable error type so callers can distinguish parse errors from runtime evaluation errors.

Files to modify

- src/lib/main.js (or a small new module under src/lib/parser.js referenced by main.js)
- tests/unit/parser.test.js (new or extended tests in the existing test harness)
- README.md examples showing an expression

Acceptance criteria

- Given a string expression representing y as a function of x, the parser returns an object with a function evaluate(x) that returns numeric y for valid x inputs.
- The parser accepts standard math functions listed above and operators + - * / ^ and parentheses.
- For malformed expressions the parser throws/returns a well-typed parse error that tests can assert against.
- Unit tests cover at least five expressions including sin(x), x^2, a combination of functions and operators, unary minus, and one invalid expression to assert error behaviour.

Test cases (examples)

- Expression: y=sin(x) with x = 0 should evaluate to 0.
- Expression: y = x^2 with x = 3 should evaluate to 9.
- Expression: y = -x with x = 2 should evaluate to -2.
- Expression: y = sin(x) + 2*log(x) with x > 0 should evaluate numerically without throwing.
- Invalid expression: y = sin( with an incomplete payload should produce a parse error that tests assert on.

Notes

Keep the API minimal and synchronous: parsing and evaluator creation are synchronous operations that return a small object used downstream by the generator and renderer.