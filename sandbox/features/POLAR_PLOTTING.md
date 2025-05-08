# Polar Plotting

## Overview
Support generating plots for polar equations by sampling angles and converting polar coordinates into Cartesian coordinates rendered as SVG files through the CLI.

## Implementation
1. Define a function plotPolar in src/lib/main.js that iterates theta from 0 to 2π, computes r based on a default formula or optional formula input, converts each point to x = r * cos(theta) and y = r * sin(theta), and assembles SVG markup with path or polyline elements.
2. Parse command line options in main using minimist to support flags --equation polar, --formula for a radius expression in terms of theta, and --output for the output filename.
3. Use a default formula r = sin(theta) and default output file polar.svg if not overridden. Write the SVG string to the specified file path using fs.
4. Maintain compatibility with ESM and existing dependencies; no new packages required.

## CLI Usage
Run npm run start with flags:
--equation polar to select polar plotting mode
--formula <expression> to customize radius as a function of theta (for example 1+0.5*sin(theta))
--output <filename> to choose the SVG output file
Examples:
npm run start -- --equation polar --output myPolar.svg
npm run start -- --equation polar --formula 1+0.5*sin(theta)

## Tests
- Add unit tests in tests/unit/main.test.js for plotPolar to verify the returned SVG string contains an opening svg tag, a viewBox attribute, and a correct number of points based on sampling.
- Add a feature-level test sandbox/tests/polar-plotting.test.js that runs npm run start with --equation polar and checks that the output file is created and contains an svg opening tag.

## Documentation
Update README.md to include the polar plotting option, show example CLI commands, and describe the new flags and default behavior.