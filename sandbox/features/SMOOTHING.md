# SMOOTHING

Provide an option to apply moving average smoothing to each data series to reduce noise and improve visual clarity in plots.

# CLI INTEGRATION

Add integer flag --smooth <windowSize> to the plot and plots commands. windowSize must be an odd integer greater than or equal to 3. When provided, series data are replaced by their moving average over the specified sliding window. Introduce boolean flag --overlay-smooth, which when present draws the original series first and then overlays the smoothed series as a dashed polyline with default dasharray 4,2 and stroke-width reduced by one.

# HTTP ENDPOINT SUPPORT

Extend the /plot and /polar endpoints with query parameters smooth=<windowSize> and overlaySmooth=true. Validate windowSize as a positive odd integer >=3. When smooth is present, transform data using moving average. If overlaySmooth is true, respond with both original and smoothed polylines in the SVG. On invalid values, return 400 Bad Request with an explanatory message.

# IMPLEMENTATION NOTES

1. In sandbox/source/main.js, implement computeMovingAverage(series, windowSize) that applies a central sliding window average, using edge values to pad where necessary.
2. In handlePlot and handlePolar, detect argv.smooth and argv['overlay-smooth'], parse and validate values, compute smoothed series, and collect original and smoothed series based on overlaySmooth.
3. Refactor generatePlotSVG and generatePolarSVG signatures to accept smoothOptions containing windowSize and overlaySmooth, then emit one or two <polyline> elements per series with appropriate styles.
4. Add unit tests in sandbox/tests/cli-interface.test.js to verify CLI parsing of smooth and overlaySmooth flags, correct number of polylines, dashed styling, and error handling for invalid window sizes.
5. Add integration tests in sandbox/tests/data-export.test.js to verify HTTP /plot and /polar responses include smoothed polylines and overlay behavior when requested.
6. Update sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md to document the --smooth and overlaySmooth options with usage examples.
7. Update the top-level README.md feature list to include SMOOTHING alongside existing features.