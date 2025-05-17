# Overview

Extend the CLI plotter to support arbitrary user-defined mathematical expressions. Users supply a function expression in terms of x, and the CLI generates an SVG curve or a data table for that expression over a specified range.

# Functionality

- Recognize a new function type identifier "expr" or "custom" as the first CLI argument.
- Accept a string mathematical expression (e.g., "sin(x) + 0.5*x") as the second argument.
- Accept optional flags for range start (`--range-start` or `-r`), range end (`--range-end` or `-R`), and step size (`--step` or `-s`).
- Parse and evaluate the expression for each x in the specified range using a lightweight parser library.
- Generate an SVG string depicting the function curve over the range when `--output` is set, otherwise print a CSV table of x and y values to stdout.

# CLI Usage

- `npm run start custom "x*x + 3*x" --range-start -5 --range-end 5 --step 0.5`
  Outputs a CSV table of x and y pairs.
- `npm run start expr "sin(x) + 0.2*x" -r 0 -R 6.28 -s 0.1 --output myplot.svg`
  Generates an SVG file `myplot.svg` showing the curve.

# Testing

- Add unit tests in sandbox/tests to:
  - Verify that the expression parser evaluates known expressions correctly (e.g., x*2, sin(x)).
  - Confirm that CSV output matches expected values for a small range.
  - Confirm that SVG output string begins with `<svg` and contains valid `<path` data for a simple expression.
  - Test default fallback behavior when flags are omitted or invalid inputs are supplied.

# Implementation Details

- Add `math-expression-evaluator` or similar lightweight dependency to `package.json`.
- In `src/lib/main.js`, extend argument parsing to detect the new identifier and flags.
- Use the expression evaluator to compute y values for each x step.
- Reuse existing SVG path builder logic or extend it to plot the points.
- Update README.md with usage examples and describe the new custom expression feature.
- Ensure ESM import of the parser and handle parsing errors gracefully with user-friendly messages.