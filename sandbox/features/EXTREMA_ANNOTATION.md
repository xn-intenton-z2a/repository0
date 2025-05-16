# EXTREMA_ANNOTATION

Annotate each plotted data series with its minimum and maximum points to highlight key extrema.

# CLI INTEGRATION

• --annotate-extrema (boolean)
  Enable automatic computation and annotation of extrema on Cartesian plots.

• --marker-color <color>
  Specify color for extrema markers (default uses series stroke color).

• --marker-size <pixels>
  Specify marker circle radius in pixels (default 4).

When --annotate-extrema is present, after drawing the data polyline for each series, compute the data point with the minimum y value and the maximum y value, append a circle marker at each coordinate with the specified marker color and size, and add a text label showing the numeric value near each marker.

# HTTP ENDPOINT SUPPORT

Extend the /plot endpoint with query parameters annotateExtrema=true, markerColor=<color>, and markerSize=<pixels>. Mirror CLI behavior when annotateExtrema is present. On invalid markerSize or color values, respond with 400 Bad Request.

# IMPLEMENTATION NOTES

1. In sandbox/source/main.js, update handlePlot and the HTTP /plot handler to detect argv['annotate-extrema'] or params.get('annotateExtrema'). Parse markerColor and markerSize from argv or params, validating markerSize as a positive integer and markerColor as a non-empty string.

2. After building the data polylines, for each series data array, find the data point with the minimum y and the point with the maximum y. For each extremum, append a circle element: <circle cx="x" cy="y" r="markerSize" fill="markerColor"/> and a text element: <text x="x" y="y" dx="markerSize + 2" dy="-2" font-size="markerSize" fill="markerColor">value</text>.

3. Update unit tests in sandbox/tests/cli-interface.test.js to cover CLI invocation with --annotate-extrema, verifying that the output SVG contains <circle> and <text> elements for both minima and maxima per series.

4. Add integration tests in sandbox/tests/data-export.test.js for HTTP: GET /plot?function=quadratic&range=0,5&annotateExtrema=true should return an SVG containing circle and text elements marking the extrema.

5. Update sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md to document the --annotate-extrema flag and annotateExtrema query parameter, including usage examples.

6. Update README.md feature list to include EXTREMA_ANNOTATION alongside the existing features.

7. No new external dependencies are required.