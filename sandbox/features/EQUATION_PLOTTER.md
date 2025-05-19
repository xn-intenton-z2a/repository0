# Overview
This feature adds core equation plotting capabilities to the CLI tool. Users can now generate SVG plots for two built-in functions: quadratic (y = ax² + bx + c) and sine (y = sin(x)). The output is written to a file specified by the user or to a default `plot.svg` in the working directory.

# CLI Commands
- plot-quadratic: Generate an SVG plot for a quadratic function. Flags:
    - --a <number>    Coefficient a (default: 1)
    - --b <number>    Coefficient b (default: 0)
    - --c <number>    Coefficient c (default: 0)
    - --output <path> Output file path (default: plot.svg)
- plot-sine: Generate an SVG plot for the sine function. Flags:
    - --frequency <number>  Frequency multiplier (default: 1)
    - --amplitude <number>  Amplitude multiplier (default: 1)
    - --output <path>       Output file path (default: plot.svg)

# Implementation Details
- In `src/lib/main.js`, extend the command parser to recognize `plot-quadratic` and `plot-sine` commands and their flags using the existing `minimist` integration.
- Implement two helper functions:
    - `generateQuadraticSVG(a, b, c, width, height)`: Compute points across a fixed domain and return an SVG string.
    - `generateSineSVG(frequency, amplitude, width, height)`: Compute sine wave points and return an SVG string.
- Use the Node.js `fs` module to write the generated SVG to the specified output file.
- Ensure the SVG has basic styling and viewBox settings for portability.

# Tests
- Update `tests/unit/main.test.js` to include unit tests for both helper functions, verifying the presence of expected `<path>` elements in the SVG string.
- Add integration tests in `sandbox/tests/plot.test.js` that:
    - Invoke `main(["plot-quadratic","--a","2","--b","3","--c","1","--output","quadratic.svg"])` and assert that `quadratic.svg` exists and contains an SVG header.
    - Invoke `main(["plot-sine","--frequency","2","--amplitude","0.5","--output","sine.svg"])` and assert that `sine.svg` exists and contains sine path data.

# Documentation
- Update `README.md` to document the new plot commands with usage examples:
    npm run start -- plot-quadratic --a 1 --b 0 --c 0 --output quad.svg
    npm run start -- plot-sine --frequency 1 --amplitude 1 --output sine.svg
- Mention in the Overview that the CLI now supports generating SVG plots for sample functions.
- Add a link to these commands in the list of available commands under the CLI section.
