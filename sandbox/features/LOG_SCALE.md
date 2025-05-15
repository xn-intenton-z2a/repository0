# LOG_SCALE

# Purpose
Enable users to plot data on logarithmic scales for improved visualization of exponential relationships and large dynamic ranges.

# CLI Behavior
- Introduce flags --log-scale-x and --log-scale-y to enable logarithmic scaling on the X or Y axis respectively.
- Accept optional --log-base parameter to specify the logarithm base (default: 10).
- When a log scale flag is present:
  - Validate that axis values are strictly positive over the specified range or data series.
  - If invalid values are detected, output an error message and exit with code 1.
- Apply the logarithmic transformation to data points before rendering the SVG polyline.
- Support combinations: log scale on one axis or both axes concurrently.

# HTTP Endpoints
- Extend GET /plot and GET /polar endpoints to accept query parameters:
  - logScaleX=true, logScaleY=true, and logBase=<number>.
- Validate parameters and return 400 status for missing or invalid values or if data domain is non-positive.
- Apply log transformation server-side before generating SVG.

# Implementation Details
- In CLI parsing logic in sandbox/source/main.js and core handler:
  - Parse boolean flags logScaleX, logScaleY and numeric logBase (default 10).
  - After computing raw data arrays, map values: x = log(x)/log(base) if logScaleX, y = log(y)/log(base) if logScaleY.
- In HTTP handler, use searchParams.get for logScaleX, logScaleY, and logBase. Convert types and validate.
- Ensure axis labels, grid lines, and tick marks reflect transformed values and scales.
- Update viewBox calculations if necessary to accommodate transformed ranges.

# Testing
- Add sandbox/tests/log-scale.test.js covering:
  - CLI: --plot quadratic --range 1,100 --log-scale-y generates a plot where Y data are plotted in log scale.
  - CLI: combining both log axes transforms data correctly.
  - CLI error when range includes zero or negative values with log flags.
  - HTTP: GET /plot?function=sine&range=0.1,10&logScaleX=true&logBase=2 returns an SVG with transformed coordinates.
  - HTTP: invalid logBase or negative domain returns 400 with descriptive message.

# Documentation
- Update sandbox/docs/CLI_USAGE.md under plot and polar sections to document --log-scale-x, --log-scale-y, and --log-base usage.
- Update sandbox/docs/HTTP_SERVER.md to document logScaleX, logScaleY, and logBase query parameters.
- Update README.md features section to include Log Scale Support.