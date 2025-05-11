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