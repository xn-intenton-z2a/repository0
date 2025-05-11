sandbox/features/FUNCTION_PLOTTER.md
# sandbox/features/FUNCTION_PLOTTER.md
# Feature Overview

A new CLI subcommand plot that generates an SVG representation of a mathematical function over a given range. The plot command accepts an expression in x, samples points across a range, constructs an SVG polyline, and prints the SVG to stdout.

# CLI Usage

Invoke the tool with:
  node src/lib/main.js plot "x * x"
  node src/lib/main.js plot "Math.sin(x)" --range -3.14,3.14

The output is an SVG document containing a polyline of the sampled points.

# Implementation Details

1. In src/lib/main.js inspect the first argument. If it is plot, treat the second argument as the function expression in x.
2. Parse an optional --range flag with format min,max. Default to range -10,10.
3. Validate that the expression contains only allowed characters: digits, whitespace, x, operators +-*/(), decimal points, and references to Math functions.
4. Create a function f = new Function('x', 'return ' + expression).
5. Sample 100 evenly spaced x values between min and max. Compute y values by calling f(x).
6. Determine yMin and yMax from samples. Normalize values to an SVG viewBox of width 500 and height 300.
7. Build a points string "x1,y1 x2,y2 ..." mapping each normalized pair.
8. Construct an SVG element with width and height attributes, include a polyline element with the points string, stroke set to black, fill set to none.
9. Print the SVG string to stdout. On any error (syntax, evaluation), write error to stderr and exit with non-zero code.

# Testing

Add unit tests in sandbox/tests/function-plotter.test.js covering:

* A quadratic expression: invoke plot on "x * x" and assert output contains <svg and <polyline and that the points attribute includes normalized values with 100 segments.
* A sine expression: invoke plot on "Math.sin(x)" and assert valid SVG structure and correct number of sampled points.
* Invalid expression: invoke plot on "x **" or containing disallowed tokens and assert process exits with a non-zero code and writes an error message to stderr.sandbox/features/EXPRESSION_EVALUATOR.md
# sandbox/features/EXPRESSION_EVALUATOR.md
# Feature Overview
A command line expression evaluator that parses and computes basic arithmetic expressions. It extends the main function to accept an eval subcommand followed by an expression and prints the result to stdout.

# CLI Usage
Invoke the tool with:
node src/lib/main.js eval "2 + 2 * (3 - 1)"
The output should be:
4

# Implementation Details
Modify src/lib/main.js to inspect the first argument. If it is eval, treat the second argument as an arithmetic expression string. Use a safe evaluation strategy with the Function constructor to parse and compute the result. Validate that the expression contains only numbers, spaces, and the operators + - * / and parentheses. Handle and report syntax errors or invalid tokens with a non-zero exit code.

# Testing
Add unit tests in tests/unit/expression.test.js covering basic operations, operator precedence, parentheses, and invalid input errors. Ensure errors throw and exit codes reflect failure.sandbox/features/POLAR_PLOTTER.md
# sandbox/features/POLAR_PLOTTER.md
# Feature Overview
A new CLI subcommand polar that generates an SVG representation of a function defined in polar coordinates. The polar command accepts an expression in t representing the radius r as a function of angle, samples points across a range of angles, converts them to Cartesian coordinates, constructs an SVG polyline, and prints the SVG to stdout.

# CLI Usage
Invoke the tool with:
node src/lib/main.js polar "1 + Math.cos(t)" --range 0,6.28 --samples 200
The output is an SVG document containing a polyline of the sampled polar curve.

# Implementation Details
1. In src/lib/main.js inspect the first argument. If it is polar, treat the second argument as the polar expression in variable t.
2. Parse optional flags: --range with format min,max for angle bounds (default to 0,2*PI), and --samples for number of points (default to 100).
3. Validate the expression against allowed characters and Math functions.
4. Create a function f = new Function('t', 'return ' + expression).
5. Sample evenly spaced t values between min and max. Compute r by calling f(t).
6. Convert each (r,t) to Cartesian coordinates x=r*Math.cos(t) and y=r*Math.sin(t).
7. Determine the min and max of x and y across samples, then normalize values to fit an SVG viewBox of width 500 and height 300.
8. Build a points string "x1,y1 x2,y2 ..." mapping normalized pairs.
9. Construct an SVG element with width and height attributes, include a polyline element with the points string, stroke set to black, fill set to none.
10. Print the SVG to stdout. On any error (syntax, evaluation), write the error to stderr and exit with a non-zero code.

# Testing
Add unit tests in sandbox/tests/polar-plotter.test.js covering:
* A cardioid: expression "1 + Math.cos(t)" and assert output contains <svg>, <polyline>, and the correct number of segments.
* A rose curve: expression "Math.cos(3*t)" sampled over a full range.
* Invalid expression: ensure disallowed tokens or syntax errors cause a non-zero exit code and error message on stderr.