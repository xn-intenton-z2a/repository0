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
* Invalid expression: invoke plot on "x **" or containing disallowed tokens and assert process exits with a non-zero code and writes an error message to stderr.