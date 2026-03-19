# EXPRESSION_PARSER

Overview

Provide a small, robust parser that converts a user-provided mathematical expression string into a callable JavaScript function f(x) that returns a numeric y value.

Description

The parser accepts expressions of the form y=Math.sin(x) or y=x*x+2*x-1 and produces a function with the signature (x) => number. Parsing must use only built-in JavaScript Math functionality; no external math libraries are permitted. The parser validates the expression, ensures it assigns into variable y, and throws a descriptive error for invalid or unsafe inputs.

Acceptance Criteria

- parseExpression is exported from src/lib/main.js as a named export.
- parseExpression("y=Math.sin(x)") returns a value of type function.
- Calling the returned function with x=0 yields a value equal to Math.sin(0) (within floating point tolerance).
- parseExpression("y=x*x+2*x-1") evaluated at x=2 returns 6 (within tolerance).
- parseExpression rejects or throws for inputs that do not assign to y or that attempt to reference globals other than Math and x.

Implementation Notes

- Add a named export parseExpression to src/lib/main.js.
- Implementation may use new Function or equivalent but must explicitly bind Math to the expression environment and disallow arbitrary global access.
- Add unit tests in tests/unit/main.test.js that verify the acceptance criteria and error cases.

Out of Scope

- No attempt to sandbox arbitrary JS engines beyond binding Math and blocking access to process, require, global, or other host objects.