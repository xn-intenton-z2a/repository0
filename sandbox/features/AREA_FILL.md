# AREA_FILL

Enable shading of area under a curve to emphasize magnitude and region interpretation.

# CLI INTEGRATION

Introduce a new boolean flag --fill-area applicable to plot and polar commands. When provided the CLI closes the curve path to the baseline and renders a filled shape beneath the data series. The fill uses style.fillColor or a semi-transparent variant of strokeColor and can be combined with other style options.

# HTTP ENDPOINT SUPPORT

Extend the /plot and /polar endpoints to accept a query parameter fillArea=true. When present the server renders a filled shape under the curve using the same logic as the CLI. Default behavior remains unchanged when omitted.

# IMPLEMENTATION NOTES

In generatePlotSVG and generatePolarSVG update function signatures to accept fillArea. For Cartesian compute polygon points by appending baseline points at zero then close the shape with a polygon or closed path before the polyline. For polar close the curve by linking last coordinate back to the first and render as a polygon. Use style.fillColor or derive a semi-transparent fill from strokeColor. Update CLI parser in sandbox/source/main.js to parse fill-area flag and pass fillArea to the generators. Extend HTTP handlers to check params.get fillArea and pass it to SVG generators. Add or update unit tests in sandbox/tests/cli-interface.test.js to verify presence of fill element when fill-area is used. Add integration tests in sandbox/tests/data-export.test.js to verify SVG includes fill when fillArea is true. Update README.md sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md with examples.