# SERIES_GENERATION

Summary

Provide a utility to evaluate a parsed expression over a numeric range and return an ordered series of points suitable for rendering or analysis.

Rationale

Converts a parsed function into discrete samples over start:step:end which are then rendered to SVG or converted to PNG.

Scope

- Add a named export evaluateExpressionRange in src/lib/main.js.
- Range format: start:step:end where start, step and end are decimal numbers.
- Return value: an array of points; each point may be an object {x, y} or a two-element array.

Files to change

- src/lib/main.js (add evaluateExpressionRange export)
- tests/unit/series.test.js (unit tests)

Acceptance Criteria

- evaluateExpressionRange is exported and callable.
- For the expression y=Math.sin(x) with range -3.14:0.01:3.14, returned series contains approximately 628 data points.
- All returned y values are finite numbers (not NaN or Infinity).
- Range parsing handles positive and negative step values and includes the start and end points consistently.

Implementation notes

- Implement a robust parser for the range string that tolerates whitespace and rejects malformed ranges with a helpful error message.
- Ensure stable ordering and deterministic rounding to avoid off-by-one sampling errors.
