# Overview

Add support for generic parametric curve plotting to the existing CLI equation plotter. Users can define functions x(t) and y(t) as mathematical expressions, specify the parameter range and sampling steps, and generate an SVG visualization of the resulting parametric curve.

# CLI Interface

The script accepts a positional argument functionType with value parametric and named options:

- --output or -o: path for the output SVG file (default plot.svg)
- --width: canvas width in pixels (default 800)
- --height: canvas height in pixels (default 600)
- --steps: number of sample points to draw (default 100)
- Parametric-specific options:
  - --xExpr: mathematical expression for x(t), using any functions supported by mathjs (required)
  - --yExpr: mathematical expression for y(t), using any functions supported by mathjs (required)
  - --tMin: start value for parameter t (default 0)
  - --tMax: end value for parameter t (default 2*pi)

# Behavior

1. Parse and validate functionType and all provided options. Ensure xExpr and yExpr are provided and valid mathjs expressions.
2. Import mathjs and create compiled functions for x(t) and y(t).
3. Generate an array of t values evenly spaced from tMin to tMax with the given number of steps.
4. Evaluate x(t) and y(t) for each sample point.
5. Scale and translate the resulting coordinates into the SVG viewport based on width and height, centering the origin at the midpoint.
6. Construct an SVG path element connecting all calculated points and include optional reference axes.
7. Write the complete SVG document to the specified output file.

# Testing

- Unit tests should cover CLI argument parsing for parametric type and its required options.
- Tests should verify expression compilation and evaluation for simple expressions such as t and sin(t).
- Confirm the generated SVG contains a <path> element and correct number of coordinate pairs.
- Ensure errors are thrown for missing or invalid expressions.

# Documentation

- Update README to illustrate usage examples:
  Example for a circle using parametric: npm run start parametric --xExpr cos(t) --yExpr sin(t) -o circle.svg
  Example for a custom Lissajous curve: npm run start parametric --xExpr sin(3*t) --yExpr cos(2*t) --tMax 6.283 -o lissajous.svg
- Reference mathjs functions supported in expressions and link to mathjs documentation.