# VIEWBOX_SCALING

Provide the ability to set and compute SVG viewBox and output dimensions so plots automatically scale to their data range and fit within a defined viewport.

# CLI INTEGRATION

Introduce two new integer flags --width and --height on the plot and polar commands. When provided, the generated <svg> element will include width and height attributes set to the specified pixel values. In all cases, compute a viewBox attribute from the data extent (minX, minY, width, height) so that axes and data mapping align correctly within the viewport. Default output dimensions should be 800 by 600 pixels if flags are omitted.

# HTTP ENDPOINT SUPPORT

Extend the /plot and /polar endpoints to accept optional query parameters width and height. When present and valid integers, the server-generated SVG response will include those dimension attributes and a computed viewBox from the data range. When omitted, default dimensions are applied (800x600).

# IMPLEMENTATION NOTES

- In generatePlotSVG and generatePolarSVG signature, accept additional numeric parameters width and height.
- Compute data bounding box by iterating over all (x,y) points: determine minX, maxX, minY, maxY.
- Build viewBox string as "minX minY (maxX - minX) (maxY - minY)".
- Generate the <svg> root element with xmlns, width, height, and viewBox attributes.
- Update CLI parser in sandbox/source/main.js to parse --width and --height as integers and include them in the style or config object passed to SVG generators.
- Update HTTP handlers in sandbox/source/main.js for /plot and /polar to read params.get('width') and params.get('height'), parse as integers, validate positive, and pass them along.
- Add unit tests to sandbox/tests/cli-interface.test.js to verify width, height, and viewBox appear when flags are used.
- Add integration tests for HTTP endpoints in sandbox/tests/data-export.test.js (or new test file) to verify SVG root includes correct attributes.
- Update README.md and sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md to document these new options and examples.