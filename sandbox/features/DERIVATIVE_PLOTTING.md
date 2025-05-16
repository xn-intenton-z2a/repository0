# DERIVATIVE_PLOTTING

Overlay a numerically computed first derivative curve for each data series in Cartesian plots to visualize rate-of-change information.

# CLI INTEGRATION

• --derivative (boolean)
  When provided on the plot or plots commands, the tool computes the first derivative of each data series generated or imported and overlays it as a separate polyline on the Cartesian SVG output.

• --derivative-style <style>
  Optional JSON string or comma-separated list defining stroke style for derivative curves (e.g., dasharray values or stroke-width override). Applies per series in the same order as the data series.

Behavior:
  - If --derivative is present, after generating the primary polyline(s), compute derivative points for each series using central differences at interior points and forward/backward differences at endpoints.
  - Append each derivative series as a dashed polyline with the specified style or default dasharray="4,2" and stroke-width=1.
  - Distinct derivative curves cycle through the same color palette but use dashed or dotted styling unless overridden.
  - If multiple series are present, derivative overlays are computed and rendered for each.
  - Errors in parsing the derivative-style parameter (invalid JSON or dasharray) result in an error and non-zero exit.

# HTTP ENDPOINT SUPPORT

Extend the /plot HTTP endpoint with new query parameters:

• derivative=true
  Enable derivative overlay for each series.

• derivativeStyle=<style>
  Define stroke style for derivative curves, matching the CLI --derivative-style format.

When derivative=true is present, compute and append derivative polylines to the SVG response. On invalid style or missing derivative flag, return 400 Bad Request with a clear message.

# IMPLEMENTATION NOTES

1. In sandbox/source/main.js, update handlePlot and the HTTP /plot handler to detect argv.derivative and params.get('derivative').
2. Parse --derivative-style or derivativeStyle param. Accept a JSON array of style objects or a comma-separated string interpreted as dasharray and optional stroke-width.
3. After building the array of data series, implement a helper function computeDerivative(series) that:
   - For each point i in series, compute dy/dx via:
     • i = 0: (y1 - y0) / (x1 - x0)
     • 0 < i < n-1: (y_{i+1} - y_{i-1}) / (x_{i+1} - x_{i-1})
     • i = n-1: (y_n - y_{n-1}) / (x_n - x_{n-1})
   - Return an array of {x, y} derivative points matching original x coordinates.
4. In generatePlotSVG, accept an optional derivative option containing the computed derivative series array(s) and style definitions. After drawing primary polylines, loop through derivative series to append dashed <polyline> elements with the requested stroke and dasharray attributes.
5. Unit Tests (sandbox/tests/cli-interface.test.js):
   - Verify that invoking CLI with --derivative adds additional <polyline> elements with dasharray attributes.
   - Test custom derivative style parsing and error cases for invalid style strings.
6. Integration Tests (sandbox/tests/data-export.test.js):
   - GET /plot?function=quadratic&range=0,5&derivative=true returns an SVG containing two <polyline> elements per series: the original and the derivative dashed line.
   - Test derivativeStyle parameter formatting and error responses.
7. Documentation:
   - Update sandbox/docs/CLI_USAGE.md to document --derivative and --derivative-style flags with examples.
   - Update sandbox/docs/HTTP_SERVER.md to document derivative=true and derivativeStyle parameters.
   - Update README.md feature list to include DERIVATIVE_PLOTTING.
