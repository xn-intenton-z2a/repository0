# Overview

This feature adds the capability to generate plots of functions defined in polar coordinates by sampling angles over a specified range and converting each point to Cartesian coordinates for SVG rendering. It extends the main library, CLI, README, and tests to support polar plot generation alongside existing Cartesian plotting functionality.

# Functionality

- Introduce function generatePolarPlot(functionDefinition, options) that:
  - Samples angles uniformly between options.minTheta and options.maxTheta (in radians).
  - Computes x = r * cos(theta) and y = r * sin(theta) for each sampled point where r = functionDefinition(theta).
  - Returns a string containing valid SVG markup of the polar curve path.
- Options object includes:
  - minTheta: number (inclusive starting angle in radians).
  - maxTheta: number (inclusive ending angle in radians).
  - steps: integer (number of sample points, default 100).
  - width: integer (SVG canvas width in pixels, default 400).
  - height: integer (SVG canvas height in pixels, default 400).
  - strokeColor: string (SVG stroke color for the curve, default black).
  - strokeWidth: number (stroke width in pixels, default 2).

# API

Exported function: generatePolarPlot(functionDefinition, options)

- functionDefinition: a callback f(theta) returning radius r.
- options: object as defined above.
- returns: string containing an SVG document embedding the polar plot.

# CLI Behavior

Extend src/lib/main.js to parse new flags for polar plot:
- type polar minTheta maxTheta steps width height outputPath --stroke-color <color> --stroke-width <width>

When invoked with:
 npm run start -- type polar 0 6.283 200 600 600 polar.svg --stroke-color red --stroke-width 3

the CLI will:
- Call generatePolarPlot with the provided options.
- Write the resulting SVG string to polar.svg or stdout if no file is specified.

# Testing

- Add unit tests for generatePolarPlot:
  - Test a linear radial function (e.g., f(theta) = theta) and verify SVG path commands approximate the correct spiral.
  - Verify that width and height attributes match options.
  - Test custom strokeColor and strokeWidth appear correctly in the SVG output.
- Add CLI integration tests:
  - Simulate process.argv for the polar type and capture stdout or file output.
  - Verify the produced file starts with `<svg` and contains expected path `<path` elements.

# README Updates

- Document generatePolarPlot API and options in README.md under an API reference section.
- Provide CLI usage examples for polar plotting, including custom styling flags.
- Include a sample snippet of the generated SVG markup.