# Equation Plotting

## Overview
Support generating plots for quadratic and sine equations as SVG files through the CLI.

## Implementation
1. Define functions plotQuadratic and plotSine in src/lib/main.js that compute point coordinates and assemble SVG markup.
2. Use minimist to parse command line options --equation and --output in main.
3. Generate an SVG string with svg tags, appropriate viewBox, and path or polyline elements representing the function curve.
4. Write the SVG output to the specified file path or to output.svg by default using the fs module.
5. No additional dependencies are required.

## CLI Usage
Run npm start with flags --equation [quadratic|sine] and --output [filename.svg]
Default equation is quadratic and default output file is output.svg.

## Tests
- Add unit tests in tests/unit/main.test.js for plotQuadratic and plotSine to verify the SVG strings include the svg opening tag and expected coordinates count.
- Add a feature level test in sandbox/tests/equation-plotting.test.js that invokes npm start and checks that the output file is created and contains an svg opening tag.

## Documentation
- Update README.md to document the new CLI options and provide example commands.
- Add sandbox/docs/EQUATION_PLOTTING.md with detailed usage examples and sample SVG snippets.