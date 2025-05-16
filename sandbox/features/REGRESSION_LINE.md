# REGRESSION_LINE

Provide an option to compute and overlay a least-squares regression line on Cartesian plots to visualize linear or quadratic trends.

# CLI INTEGRATION

Add a new string flag --regression with allowed values linear or quadratic applicable to the plot command. When provided, the CLI will compute coefficients for a degree-1 or degree-2 polynomial fit to the data produced by the plot generator or imported via input data. After drawing the primary polyline, generate a second polyline representing the regression curve. The regression line uses the same stroke color with a dashed stroke style and a stroke width reduced by one by default. If the regression value is invalid, the CLI reports an error and exits.

# HTTP ENDPOINT SUPPORT

Extend the /plot endpoint to accept an optional query parameter regression with values linear or quadratic. When present, the server computes regression coefficients for the generated or imported data and injects a second polyline element with dashed stroke style into the SVG response. Invalid regression values result in a 400 Bad Request response with a clear error message.

# IMPLEMENTATION NOTES

Define a helper function computeRegression(data, degree) in sandbox/source/main.js that returns polynomial coefficients by solving normal equations for the specified degree. Update handlePlot to detect argv.regression and pass the regression option into generatePlotSVG. Modify generatePlotSVG signature to accept an optional regression parameter. When regression is applied, compute regression curve points across the same x-range at the original resolution and append an additional polyline element with dashed style before closing the SVG. Add unit tests in sandbox/tests/cli-interface.test.js to verify flag parsing, error handling for invalid values, and presence of a dashed polyline. Extend integration tests in sandbox/tests/data-export.test.js to verify HTTP /plot responses include two polyline elements with correct dasharray when regression is requested. Update documentation in sandbox/docs/CLI_USAGE.md, sandbox/docs/HTTP_SERVER.md, and README.md with usage examples for --regression and regression query parameters.