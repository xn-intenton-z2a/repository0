# Overview
This feature enables users to plot polar equations defined as r = f(θ) over a specified angular domain and sample count. It introduces a new CLI command and extends the existing HTTP plot server to support polar plotting, converting polar coordinates to Cartesian for SVG output.

# CLI Commands
- plot-polar: Generate an SVG polar plot for a user-defined radius function.
  - --expr <string>      The mathematical expression for r in terms of theta (θ) using JavaScript or mathjs syntax, e.g., 1 + sin(3 * x).
  - --domain <start,end> Angular range for θ values in radians, separated by a comma (default: "0,6.283").
  - --samples <number>   Number of points to sample across the angular domain (default: 100).
  - --width <number>     Width of the generated SVG in pixels (default: 500).
  - --height <number>    Height of the generated SVG in pixels (default: 500).
  - --output <path>      Output file path (default: polar.svg).

# HTTP Endpoints
- GET /plot?type=polar&expr=<expr>&domain=<start,end>&samples=<n>&width=<w>&height=<h>
  - Query parameters:
    - type=polar           Plot type indicator for polar plotting.
    - expr                 Radius function expression in terms of theta (θ).
    - domain               Angular range "start,end" in radians.
    - samples              Number of sample points.
    - width, height        Optional SVG dimensions.
  - Response: 200 OK with Content-Type image/svg+xml and the generated polar plot SVG.

# Implementation Details
1. In sandbox/source/main.js, implement generatePolarSVG(expr, thetaMin, thetaMax, samples, width, height):
   - Parse and compile the expression using mathjs evaluate with variable x as theta.
   - For each sample i, compute theta = thetaMin + i*(thetaMax-thetaMin)/(samples-1) and r = evaluate(expr, {x: theta}).
   - Convert to Cartesian coordinates: x = r*cos(theta), y = r*sin(theta).
   - Normalize points into pixel coordinates and assemble polyline path.
   - Include a circle at the origin and optional axis lines for reference.
2. Add a new case in the CLI switch for plot-polar, parsing flags via minimist, invoking generatePolarSVG, and writing output with fs/promises.
3. Extend the HTTP server case in plot-server to handle type=polar by extracting expr, domain, samples, width, height, invoking generatePolarSVG, and returning SVG with proper headers.

# Tests
- Unit tests in sandbox/tests/polar.test.js:
  - Verify generatePolarSVG with simple expressions (e.g., constant radius, r = 1) produces an SVG string containing <polyline> tags and starts with <svg>.
  - Test sampling count and domain mapping by inspecting point count attributes or path data segments.
- Integration tests in sandbox/tests/cli-polar.test.js:
  - Invoke main(["plot-polar","--expr","1","--domain","0,3.1416","--samples","10","--output","test.svg"]) and assert test.svg exists and contains an SVG header.
- HTTP tests in sandbox/tests/plot-server-polar.test.js:
  - Start server via main with port 0 and host 127.0.0.1, send GET request to /plot?type=polar&expr=x&domain=0,3.1416&samples=5, assert 200 and SVG in response.

# Documentation
- Update README.md and sandbox/docs/CLI_COMMANDS.md:
  - Add plot-polar under CLI commands with usage examples and description.
  - Document HTTP endpoint for polar in the plot-server section.
- Add sandbox/features/POLAR_PLOTTER.md with full feature spec.