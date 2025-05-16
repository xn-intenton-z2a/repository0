# ANALYTIC_OVERLAYS

This feature enables users to overlay analytical augmentations onto their plots including smoothing, derivative curves, regression fits, and extrema annotations in both Cartesian and polar modes.

# CLI INTEGRATION

• --smooth <windowSize>
  Apply moving average smoothing to each data series. windowSize must be an odd integer greater than or equal to 3.

• --overlay-smooth (boolean)
  When present, overlay the smoothed polyline as a dashed line on top of the original series, using default dasharray 4,2 and reduced stroke width.

• --derivative (boolean)
  Compute and overlay the first derivative curve for each series using central differences at interior points and forward/backward differences at endpoints.

• --derivative-style <styleSpec>
  Define stroke style for derivative overlays. Accepts a JSON array of style objects or a comma separated list interpreted as dasharray and optional stroke width.

• --regression <linear|quadratic>
  Compute a least squares fit of specified polynomial degree to each data series and overlay the regression curve with dashed styling.

• --annotate-extrema (boolean)
  Mark and label the minimum and maximum y points of each series with circle markers and text labels.

• --marker-color <color>
  Specify the fill color for extrema markers and labels. Defaults to series stroke color.

• --marker-size <pixels>
  Specify the radius in pixels for extrema marker circles and font size for labels. Defaults to 4.

# HTTP ENDPOINT SUPPORT

Extend the /plot and /polar endpoints with query parameters smooth, overlaySmooth, derivative, derivativeStyle, regression, annotateExtrema, markerColor, and markerSize. Validate all parameters and return HTTP 400 Bad Request on invalid values. When analytics parameters are present, transform data or append additional SVG elements in the response.

# IMPLEMENTATION NOTES

1. In sandbox/source/main.js implement helper functions:
   - computeMovingAverage(series, windowSize)
   - computeDerivative(series)
   - computeRegression(series, degree)
   - findExtrema(series)
2. Refactor generatePlotSVG and generatePolarSVG to accept analyticsOptions containing fields smooth, overlaySmooth, derivative, derivativeStyle, regression, annotateExtrema, markerColor, markerSize. Append additional <polyline> elements for smoothed, derivative, and regression series, and <circle> and <text> elements for extrema annotations.
3. Update handlePlot and handlePolar to detect new CLI flags and HTTP params, parse and validate inputs, compute analytic outputs, and pass analyticsOptions to the SVG generators.

# TESTING

Add unit tests in sandbox/tests/cli-interface.test.js to verify correct parsing of analytics flags, presence and count of overlay SVG elements, styling attributes, and error handling. Add integration tests in sandbox/tests/data-export.test.js to verify HTTP SVG responses include analytics elements or return expected error codes.

# DOCUMENTATION

Update sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md with descriptions of all analytics parameters and examples. Update README.md feature list to include ANALYTIC_OVERLAYS.