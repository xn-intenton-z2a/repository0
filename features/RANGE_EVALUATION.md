# RANGE_EVALUATION

Overview

Parse a numeric range string and generate an array of sample points by evaluating a parsed expression across the range.

Description

The system accepts range strings in the format start:step:end (for example -3.14:0.01:3.14). The range parser verifies numeric values, non-zero step, and sign consistency. An evaluation function takes a parsed expression function and the range string and returns an array of objects with properties x and y.

Acceptance Criteria

- A function parseRange or equivalent is exported from src/lib/main.js and accepts strings like -3.14:0.01:3.14.
- Evaluating the parsed expression for expression y=Math.sin(x) over the range -3.14:0.01:3.14 returns approximately 628 data points (allow ±1 to accommodate inclusive/exclusive boundary handling).
- The returned series is an array of objects where each element has numeric properties x and y, the first x equals start (within tolerance), and successive x values differ by step (within tolerance).
- The function throws for invalid range strings (missing fields, non-numeric values, zero step).

Implementation Notes

- Export a named helper evaluateExpressionOverRange that accepts (exprFn, rangeString) and returns [{x,y}, ...].
- Tests in tests/unit/main.test.js should assert the point count and basic numeric correctness when combined with parseExpression from the EXPRESSION_PARSER feature.

Edge Cases

- Floating point rounding should be handled with a small epsilon when checking inclusivity of the end value.