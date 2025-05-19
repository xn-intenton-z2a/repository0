# Overview
This feature enables users to plot any valid mathematical expression over a specified domain and sample count. It extends the existing plotting capabilities beyond fixed quadratic and sine functions, empowering the CLI tool to visualize arbitrary expressions in SVG format.

# CLI Commands

- plot-expression: Generate an SVG plot for a user-defined expression.
  - --expr <string>       The mathematical expression in JavaScript syntax or mathjs format (e.g., x^2 + sin(x)).
  - --domain <start,end>  The numeric range for x values, separated by a comma (default: "-10,10").
  - --samples <number>    The number of points to sample across the domain (default: 100).
  - --width <number>      Width of the generated SVG in pixels (default: 800).
  - --height <number>     Height of the generated SVG in pixels (default: 600).
  - --output <path>       Output file path (default: plot.svg).

# Implementation Details

1. Add a new dependency: mathjs for safe parsing and evaluation of expressions.
2. In src/lib/main.js, extend the command parser to recognize plot-expression and its flags using minimist.
3. Implement helper function generateExpressionSVG(expr, domainStart, domainEnd, samples, width, height) which:
   - Parses and compiles the expression using mathjs.
   - Computes y values at evenly spaced x points across the domain.
   - Builds an SVG string with a polyline or path element connecting the computed points.
   - Includes basic axes and viewBox settings for portability.
4. Use fs/promises to write the SVG string to the specified output file.

# Tests

- Unit tests in tests/unit/main.test.js:
  - Verify that generateExpressionSVG produces an SVG string containing the expected <path> or <polyline> tag for simple expressions (e.g., x, x^2).
  - Test sampling behavior and axis inclusion.
- Integration tests in sandbox/tests/plot-expression.test.js:
  - Invoke main(["plot-expression","--expr","x^2","--domain","-5,5","--samples","50","--output","expr.svg"]) and assert that expr.svg exists and contains an SVG header and path data.

# Documentation

- Update README.md to include usage examples for plot-expression:
  npm run start -- plot-expression --expr "x^2 + sin(x)" --domain "-10,10" --samples 200 --output expr.svg
- Add plot-expression to the list of available commands under the CLI section.
