# Overview

This feature adds the capability to generate plots from parametric equations by sampling parameters over a specified range and converting each point to Cartesian coordinates for SVG rendering. It extends the main library, CLI, README, and tests to support parametric plot generation alongside existing Cartesian and polar plotting functionality.

# Functionality

- Introduce function generateParametricPlot(xFunction, yFunction, options) that:
  - Samples parameter t uniformly between options.minT and options.maxT (inclusive).
  - Computes x = xFunction(t) and y = yFunction(t) for each sampled point.
  - Returns a string containing valid SVG markup of the parametric curve path.
- Options object includes:
  - minT: number (inclusive starting parameter value, default 0).
  - maxT: number (inclusive ending parameter value, default 1).
  - steps: integer (number of sample points, default 100).
  - width: integer (SVG canvas width in pixels, default 400).
  - height: integer (SVG canvas height in pixels, default 400).
  - strokeColor: string (SVG stroke color for the curve, default black).
  - strokeWidth: number (stroke width in pixels, default 2).

# API

Exported function: generateParametricPlot(xFunction, yFunction, options)

- xFunction: a callback f(t) returning x coordinate.
- yFunction: a callback f(t) returning y coordinate.
- options: object as defined above.
- returns: string containing an SVG document embedding the parametric plot.

# CLI Behavior

Extend src/lib/main.js to parse new flags for parametric plot:
- type parametric minT maxT steps width height outputPath --stroke-color <color> --stroke-width <width>

When invoked with:
  npm run start -- type parametric 0 6.28 200 600 600 parametric.svg --stroke-color blue --stroke-width 3

the CLI will:
- Call generateParametricPlot with xFunction and yFunction callbacks derived from argument definitions.
- Write the resulting SVG string to parametric.svg or stdout if no file is specified.

# Testing

- Add unit tests for generateParametricPlot:
  - Test simple linear parametric functions, e.g. x(t) = t, y(t) = t and verify SVG path commands form a straight line.
  - Verify width, height, strokeColor, and strokeWidth attributes match options.
- Add CLI integration tests:
  - Simulate process.argv for the parametric type with example functions provided as module imports or inline definitions in tests.
  - Capture stdout or file output and verify it starts with <svg and contains expected <path elements.

# README Updates

- Document generateParametricPlot API and options in README.md under an API reference section.
- Provide CLI usage examples for parametric plotting, including custom styling flags.
- Include a sample snippet of the generated SVG markup.