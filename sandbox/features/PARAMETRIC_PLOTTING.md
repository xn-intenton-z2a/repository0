# Parametric Plotting

## Overview
Support generating plots for parametric equations defined by x(t) and y(t) over a given parameter range.
The output is an SVG file produced via the CLI.

## Implementation
1. Add function plotParametric in src/lib/main.js that:
   - Accepts two JavaScript expressions for x(t) and y(t) and a t range [start, end].
   - Samples t at regular intervals, evaluates x and y for each t, and assembles an SVG polyline or path.
2. Use minimist to parse CLI flags:
   --equation parametric to select parametric mode
   --x <expression> to specify x as a function of t
   --y <expression> to specify y as a function of t
   --t-range <start,end> to define the sampling range for t
   --output <filename> to choose the output SVG file name
3. Apply defaults when flags are absent:
   x = Math.cos(t) and y = Math.sin(t)
   t-range = 0, 6.283 (approx 2π)
   output file = parametric.svg
4. Evaluate the expressions using the Function constructor (e.g. new Function('t', `return ${expr}`)).
5. Write the generated SVG string to the specified file path using fs.

## CLI Usage
npm run start -- --equation parametric --x Math.sin(3*t) --y Math.cos(2*t) --t-range 0,6.283 --output lissajous.svg

## Tests
- Unit tests in tests/unit/main.test.js for plotParametric to verify the SVG string includes an opening svg tag, a viewBox attribute, and a correct number of sampled points.
- Feature-level test sandbox/tests/parametric-plotting.test.js that runs npm run start with parametric flags and checks that the output file exists and contains an svg opening tag.

## Documentation
- Update README.md to document parametric plotting flags, default expressions, and an example command.
- Add sandbox/docs/PARAMETRIC_PLOTTING.md with detailed usage instructions and sample SVG outputs.